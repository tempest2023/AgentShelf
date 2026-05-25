import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { getGeoModel, isOpenAIConfigured, resolveGeoModel } from "@/lib/openai";
import { getAuditForProduct } from "@/lib/mock";
import type { AuditResponsePayload, Product } from "@/lib/types";

const auditSchema = z.object({
  aiReadinessScore: z.number().min(0).max(100),
  discoverabilityScore: z.number().min(0).max(100),
  clarityScore: z.number().min(0).max(100),
  schemaScore: z.number().min(0).max(100),
  missingSignals: z.array(z.string()),
  recommendedFixes: z.array(
    z.object({
      type: z.enum(["title", "description", "faq", "comparison", "schema"]),
      currentValue: z.string().optional(),
      suggestedValue: z.string(),
      reasoning: z.string(),
    })
  ),
});

function buildProductSummary(product: Product): string {
  const lines = [
    `Product ID: ${product.id}`,
    `Title: ${product.title}`,
    `Brand: ${product.brand}`,
    `Category: ${product.category}`,
    `Price: $${product.price}`,
    `Description: ${product.description}`,
  ];

  if (product.gtin) lines.push(`GTIN: ${product.gtin}`);
  if (product.sku) lines.push(`SKU: ${product.sku}`);
  if (product.ingredients?.length)
    lines.push(`Ingredients: ${product.ingredients.join(", ")}`);
  if (product.targetAudience?.length)
    lines.push(`Target audience: ${product.targetAudience.join(", ")}`);
  if (product.attributes) {
    for (const [k, v] of Object.entries(product.attributes)) {
      lines.push(`${k}: ${v}`);
    }
  }
  if (product.reviews) {
    lines.push(
      `Reviews: ${product.reviews.rating}/5 (${product.reviews.count} reviews) — "${product.reviews.summary}"`
    );
  }
  if (product.shippingPolicy) lines.push(`Shipping: ${product.shippingPolicy}`);
  if (product.returnPolicy) lines.push(`Returns: ${product.returnPolicy}`);

  return lines.join("\n");
}

export async function POST(req: Request) {
  const { product } = (await req.json()) as { product: Product };

  if (!product?.id || !product?.title) {
    return NextResponse.json(
      { error: "Invalid product data" },
      { status: 400 }
    );
  }

  const fallbackAudit = getAuditForProduct(product.id);
  const model = resolveGeoModel();
  const configured = isOpenAIConfigured();

  if (!configured) {
    const payload: AuditResponsePayload = {
      audit: fallbackAudit,
      status: {
        mode: "unavailable",
        configured: false,
        model,
        message:
          "OpenAI is not configured yet. AgentShelf is showing the deterministic mock fallback.",
        updatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(payload);
  }

  try {
    const result = await generateObject({
      model: getGeoModel(),
      schema: auditSchema,
      prompt: `You are a Generative Engine Optimization (GEO) expert. Analyze this product and score its readiness for AI-powered recommendation engines (ChatGPT Shopping, Google AI Mode, Perplexity, Claude, Gemini).

## Product Data
${buildProductSummary(product)}

## Scoring Criteria

**Discoverability (0-100):** How easily can AI engines find and match this product to user queries?
- Keyword richness in title and description
- Search intent coverage (does the description answer common buyer questions?)
- Category-specific terminology usage
- Long-tail keyword presence

**Clarity (0-100):** How well does the product listing communicate value to AI engines?
- Description completeness and structure
- Feature-benefit clarity
- Unique selling propositions
- Comparison-ready information

**Schema Readiness (0-100):** How well-structured is the data for machine consumption?
- Has GTIN/UPC/SKU
- Has structured attributes
- Has ingredients/materials listed
- Has target audience defined
- Has reviews data

**Missing Signals:** List specific data points or content elements that are missing or weak.

**Recommended Fixes:** For each fix type (title, description, faq, comparison, schema), provide:
- The current value (if it exists in the product data)
- A suggested improved value
- Reasoning for the change

Generate realistic, specific suggestions based on the actual product data. Do not invent product features that don't exist.`,
      temperature: 0.3,
    });

    const payload: AuditResponsePayload = {
      audit: {
        ...result.object,
        productId: product.id,
      },
      status: {
        mode: "live",
        configured: true,
        model,
        message: "Live OpenAI audit completed successfully.",
        updatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(payload);
  } catch (error) {
    const payload: AuditResponsePayload = {
      audit: fallbackAudit,
      status: {
        mode: "fallback",
        configured: true,
        model,
        message:
          "The live OpenAI audit failed, so AgentShelf fell back to the deterministic mock audit.",
        error: error instanceof Error ? error.message : "Unknown audit error",
        updatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(payload);
  }
}
