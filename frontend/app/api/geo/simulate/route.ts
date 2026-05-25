import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { getGeoModel, isOpenAIConfigured, resolveGeoModel } from "@/lib/openai";
import { simulateQuery } from "@/lib/mock";
import type { Product, SimulationResponsePayload } from "@/lib/types";

const simulationSchema = z.object({
  matches: z.array(
    z.object({
      productId: z.string(),
      matchScore: z.number().min(0).max(100),
      reason: z.string(),
      missingSignals: z.array(z.string()),
    })
  ),
  agentPreviewAnswer: z.string(),
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
  if (product.attributes) {
    for (const [k, v] of Object.entries(product.attributes)) {
      lines.push(`${k}: ${v}`);
    }
  }
  if (product.reviews) {
    lines.push(
      `Reviews: ${product.reviews.rating}/5 (${product.reviews.count} reviews)`
    );
  }

  return lines.join("\n");
}

export async function POST(req: Request) {
  const { query, product } = (await req.json()) as {
    query: string;
    product: Product;
  };

  if (!query?.trim() || !product?.id) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const fallbackSimulation = simulateQuery(query, product.category);
  const model = resolveGeoModel();
  const configured = isOpenAIConfigured();

  if (!configured) {
    const payload: SimulationResponsePayload = {
      simulation: fallbackSimulation,
      status: {
        mode: "unavailable",
        configured: false,
        model,
        message:
          "OpenAI is not configured yet. AgentShelf is showing the deterministic query simulator fallback.",
        updatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(payload);
  }

  try {
    const result = await generateObject({
      model: getGeoModel(),
      schema: simulationSchema,
      prompt: `You are an AI shopping engine analyst. A user has typed a search query, and you need to evaluate how well a specific product matches that query, as if you were an AI shopping assistant (like ChatGPT Shopping, Google AI Mode, or Perplexity).

## User Query
"${query}"

## Product Being Evaluated
${buildProductSummary(product)}

## Your Task

1. **Evaluate the match:** How well does this product match the user's search intent? Consider:
   - Does the product title contain relevant keywords?
   - Does the description address the user's likely needs?
   - Is the price range appropriate for the query?
   - Are reviews/ratings strong enough to recommend?
   - Is the product category correct for this query?

2. **Generate 1-3 match results** with:
   - A match score (0-100) based on how well the product fits the query
   - A specific reason explaining the match quality
   - Missing signals: what data or content is missing that would improve the match

3. **Write an agent preview answer** — as if you were an AI shopping assistant responding to the user. This should be 2-3 sentences that naturally recommend (or explain why you can't confidently recommend) the product. Be conversational and helpful.

Be realistic. If the product is a poor match for the query, give it a low score and explain why. Don't inflate scores.`,
      temperature: 0.3,
    });

    const payload: SimulationResponsePayload = {
      simulation: {
        ...result.object,
        query,
      },
      status: {
        mode: "live",
        configured: true,
        model,
        message: "Live OpenAI query simulation completed successfully.",
        updatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(payload);
  } catch (error) {
    const payload: SimulationResponsePayload = {
      simulation: fallbackSimulation,
      status: {
        mode: "fallback",
        configured: true,
        model,
        message:
          "The live OpenAI query simulation failed, so AgentShelf fell back to the deterministic simulator.",
        error:
          error instanceof Error ? error.message : "Unknown simulation error",
        updatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(payload);
  }
}
