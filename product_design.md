# AgentShelf Product Design Doc

Team: Commerce Alchemists
Hackathon: Generative UI Hackathon w/ Google and CopilotKit
Version: Hackathon MVP / Video Demo Only

---

## 1. Product Summary

**AgentShelf** is a **GEO Readiness Console for AI Commerce**.

As product discovery shifts from traditional SEO to AI assistants such as ChatGPT, Perplexity, Google AI Mode, and shopping agents, e-commerce brands need a new way to make their products understandable, comparable, and recommendable by AI agents.

AgentShelf helps merchants audit their product catalog, identify missing product signals, simulate how AI agents may understand their products, and generate structured fixes such as optimized descriptions, FAQs, comparison tables, and JSON-LD product schema.

For this hackathon, AgentShelf does not need real Shopify or ad platform integration. The goal is to build a convincing interactive product demo using mock product data and AI-generated UI.

---

## 2. Core Demo Message

Traditional SEO asks:

> Can Google find my product page?

AgentShelf asks:

> Can AI agents understand, compare, recommend, and purchase my product?

The key product idea:

> AgentShelf turns messy product pages into agent-ready commerce interfaces.

---

## 3. Target User

### Primary User

Small to mid-sized e-commerce brands, especially Shopify or DTC merchants.

### Initial Vertical

**Beauty / Skincare e-commerce**

Reason:

* Product attributes are complex.
* Customers ask natural-language shopping questions.
* AI recommendation behavior matters.
* Product pages often lack structured data.
* Demo UI can be visually clear and attractive.

Example merchant:

> A skincare brand selling sunscreen, moisturizer, cleanser, and acne-safe products.

---

## 4. User Problem

E-commerce merchants currently optimize for SEO, but AI shopping changes discovery.

A customer may ask:

> What is the best lightweight sunscreen under $30 for oily, acne-prone skin?

An AI assistant needs structured signals:

* Who is the product for?
* What problem does it solve?
* What skin type is it suitable for?
* What ingredients does it contain?
* What makes it different from competitors?
* Is it safe for sensitive or acne-prone users?
* What reviews or trust signals support it?
* Is price, shipping, and return policy clear?

Most product pages are written for humans, not AI agents.

AgentShelf helps brands identify and fix this gap.

---

## 5. Hackathon MVP Scope

This MVP is designed for a short demo video, not production deployment.

### In Scope

1. Mock Shopify product catalog
2. Product readiness dashboard
3. AI discoverability score
4. Missing signal detection
5. AI shopping query simulator
6. Agent preview panel
7. One-click GEO fixes
8. Editable generated product improvements
9. Mock publish/apply action

### Out of Scope

1. Real Shopify API integration
2. Real ChatGPT / Perplexity ranking data
3. Real ad campaign creation
4. Real product publishing
5. Real competitor scraping
6. Real payment or checkout integration
7. Full user authentication
8. Production-grade analytics

---

## 6. Recommended Hackathon Tech Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**

### Generative UI / Agentic UI

* **CopilotKit**

  * Copilot sidebar
  * Agent actions
  * Dynamic UI updates
  * Human-in-the-loop interaction

### AI Model

* **Google Gemini** or **OpenAI**

  * Product analysis
  * Query simulation
  * GEO recommendations
  * Copy generation

For hackathon practicality, either model is acceptable. If using sponsor tools is important, prioritize Gemini and CopilotKit.

### Workflow Layer

* **LangChain**

  * Optional but useful for structuring agent workflows
  * Can be lightly mocked if implementation time is short

### MCP / Tool Layer

* **MCP-style mock commerce tools**

  * No real MCP server required for MVP unless time allows
  * Functions can be represented as backend API routes or mocked local tools

---

## 7. High-Level Architecture

```text
Next.js / React / Tailwind UI
        ↓
CopilotKit Agentic UI Layer
        ↓
Agent Controller / API Route
        ↓
LLM: Gemini or OpenAI
        ↓
Mock Tools:
  - getProductCatalog()
  - auditProductReadiness()
  - detectMissingSignals()
  - simulateShoppingQuery()
  - generateGeoFixes()
  - generateProductSchema()
  - applyMockPatch()
        ↓
Updated Interactive Dashboard
```

---

## 8. Main User Flow

### Step 1: Merchant Opens AgentShelf

The landing screen shows:

* Product name: **AgentShelf**
* Tagline: **Make every product agent-ready**
* Short explanation:
  “Audit your catalog for AI shopping readiness and generate GEO fixes instantly.”

User clicks:

> Start GEO Audit

---

### Step 2: Select or Upload Product Catalog

For demo, use mock catalog options:

1. Skincare Starter Catalog
2. Fashion Catalog
3. Home Goods Catalog

Recommended demo catalog:

> Skincare Starter Catalog

Mock products:

* ClearGlow Mineral Sunscreen SPF 30
* HydraBarrier Gel Moisturizer
* CalmPore Gentle Cleanser
* NightRepair Retinol Serum

User selects:

> Skincare Starter Catalog

---

### Step 3: AI Generates GEO Readiness Dashboard

The dashboard shows catalog-level scores:

| Metric                | Example Score |
| --------------------- | ------------: |
| AI Discoverability    |            72 |
| Product Clarity       |            68 |
| Comparison Readiness  |            54 |
| Trust Signal Strength |            61 |
| Query Intent Coverage |            58 |
| Schema Completeness   |            46 |

Main insight:

> Your catalog is partially readable by AI agents, but missing comparison attributes, structured FAQs, and clear use-case targeting.

---

### Step 4: Product Cards

Each product appears as an interactive card.

Example card:

**ClearGlow Mineral Sunscreen SPF 30**

* Price: $24
* Category: Sunscreen
* Target customer: oily / acne-prone skin
* Current AI readiness score: 64 / 100
* Status: Needs optimization

Problems detected:

* Missing “non-comedogenic” claim clarity
* No FAQ for acne-prone users
* No comparison against chemical sunscreen
* No JSON-LD product schema
* Weak review summary
* No clear texture description

Actions:

* Generate GEO Fix
* Preview AI Agent Answer
* Generate FAQ
* Generate Schema
* Mark as Ready

---

### Step 5: AI Shopping Query Simulator

User enters a natural-language query:

> Best lightweight sunscreen under $30 for oily acne-prone skin

AgentShelf simulates how an AI shopping agent may interpret the catalog.

Output UI:

**Query Match Result**

| Product                            | Match | Reason                                                          |
| ---------------------------------- | ----: | --------------------------------------------------------------- |
| ClearGlow Mineral Sunscreen SPF 30 |   84% | Good price, sunscreen category, but acne-safe signal is unclear |
| HydraBarrier Gel Moisturizer       |   32% | Good for oily skin, but not sunscreen                           |
| CalmPore Gentle Cleanser           |   18% | Acne-related but not sunscreen                                  |

AI Agent Preview:

> ClearGlow may be considered, but the product page does not clearly state whether it is non-comedogenic, lightweight, or suitable for acne-prone skin. A competing product with clearer claims may be recommended first.

This is the key demo moment.

It shows that the product might be good, but AI agents may not recommend it because the page lacks structured signals.

---

### Step 6: One-Click GEO Fix

User clicks:

> Generate GEO Fix

AgentShelf generates an interactive editable panel:

### Optimized Title

Current:

> ClearGlow Mineral Sunscreen SPF 30

Suggested:

> ClearGlow Lightweight Mineral Sunscreen SPF 30 for Oily & Acne-Prone Skin

### Optimized Description

Generated copy should emphasize:

* Lightweight texture
* Mineral SPF
* Suitable for oily skin
* Non-greasy finish
* Under $30
* Daily use
* Sensitive skin consideration

### Generated FAQ

Example:

**Q: Is this sunscreen suitable for acne-prone skin?**
A: ClearGlow is designed for users looking for a lightweight, non-greasy mineral sunscreen. It is suitable for oily and acne-prone routines when used as directed.

**Q: Does it leave a white cast?**
A: The formula is designed to blend more easily than traditional mineral sunscreens, though results may vary by skin tone.

**Q: Can I wear it under makeup?**
A: Yes, the lightweight texture is designed for daily wear and layering under makeup.

### Comparison Table

| Feature  | ClearGlow              | Typical Mineral Sunscreen | Chemical Sunscreen   |
| -------- | ---------------------- | ------------------------- | -------------------- |
| SPF      | 30                     | 30–50                     | 30–50                |
| Texture  | Lightweight            | Often thicker             | Usually lightweight  |
| Best for | Oily / acne-prone skin | Sensitive skin            | Daily invisible wear |
| Price    | $24                    | $20–$40                   | $15–$35              |

### JSON-LD Schema Preview

The UI should show a structured product schema preview, not necessarily fully production-ready.

Actions:

* Apply Fix
* Edit Copy
* Regenerate
* Export JSON
* Mock Publish

---

## 9. Key Screens

### Screen 1: Landing / Intro

Purpose:

Explain product quickly.

Components:

* Hero headline
* Demo catalog selector
* Start audit button
* Short value proposition cards

Suggested headline:

> Make your products readable, comparable, and recommendable by AI agents.

Suggested subheading:

> AgentShelf audits your e-commerce catalog for GEO readiness and generates structured fixes for the next era of AI shopping.

---

### Screen 2: GEO Readiness Dashboard

Purpose:

Show the product’s main value immediately.

Components:

* Catalog score
* Score breakdown
* Product list
* Missing signal summary
* AI assistant sidebar

Important visual elements:

* Score cards
* Progress bars
* Product readiness badges
* Warning cards
* “Generate Fix” buttons

---

### Screen 3: Product Detail Panel

Purpose:

Show product-level diagnosis.

Components:

* Product card
* Current product data
* Missing attributes
* AI readability analysis
* Query matches
* Suggested improvements

---

### Screen 4: AI Shopping Preview

Purpose:

Show how AI agents may understand the product.

Components:

* User query input
* Simulated AI recommendation
* Ranking likelihood
* Reasoning panel
* Missing signal explanation

This screen is important for the video demo because it clearly explains the SEO → GEO transition.

---

### Screen 5: GEO Fix Workspace

Purpose:

Show generative UI in action.

Components:

* Editable optimized title
* Editable product description
* FAQ generator
* Comparison table
* JSON-LD schema preview
* Apply changes button

---

## 10. Mock Data Design

### Product Object

```ts
type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  ingredients?: string[];
  targetAudience?: string[];
  attributes?: Record<string, string>;
  reviews?: {
    rating: number;
    count: number;
    summary: string;
  };
  images?: string[];
};
```

### Audit Result Object

```ts
type ProductAudit = {
  productId: string;
  aiReadinessScore: number;
  discoverabilityScore: number;
  clarityScore: number;
  comparisonScore: number;
  trustScore: number;
  schemaScore: number;
  missingSignals: string[];
  recommendedFixes: GeoFix[];
};
```

### GEO Fix Object

```ts
type GeoFix = {
  type: "title" | "description" | "faq" | "comparison" | "schema";
  currentValue?: string;
  suggestedValue: string;
  reasoning: string;
};
```

### Query Simulation Object

```ts
type QuerySimulation = {
  query: string;
  matches: {
    productId: string;
    matchScore: number;
    reason: string;
    missingSignals: string[];
  }[];
  agentPreviewAnswer: string;
};
```

---

## 11. Mock Tools

These can be implemented as simple TypeScript functions or API routes.

### getProductCatalog()

Returns mock skincare catalog.

```ts
getProductCatalog("skincare-demo")
```

### auditProductReadiness(product)

Returns product scores and missing signals.

```ts
auditProductReadiness(product)
```

### simulateShoppingQuery(query, catalog)

Returns AI shopping match result.

```ts
simulateShoppingQuery(
  "Best lightweight sunscreen under $30 for oily acne-prone skin",
  catalog
)
```

### generateGeoFixes(product, queryContext)

Returns optimized title, description, FAQ, comparison table, and schema.

```ts
generateGeoFixes(product, queryContext)
```

### applyMockPatch(productId, patch)

Updates local UI state only.

```ts
applyMockPatch(productId, patch)
```

---

## 12. CopilotKit Usage

CopilotKit should be used to make the project feel like an agentic product, not just a dashboard.

### Suggested Copilot Actions

1. **Audit catalog**

   * User: “Audit my skincare catalog for ChatGPT shopping readiness.”
   * Agent updates dashboard.

2. **Simulate shopping query**

   * User: “Would this product be recommended for oily acne-prone skin?”
   * Agent updates the AI Shopping Preview panel.

3. **Generate GEO fixes**

   * User: “Improve this product for AI shopping agents.”
   * Agent opens the GEO Fix Workspace.

4. **Apply changes**

   * User approves generated copy.
   * Agent updates product card state.

### Example Copilot Sidebar Prompts

* “Audit my catalog.”
* “Find products with weak AI readiness.”
* “Simulate a ChatGPT shopping query.”
* “Generate FAQ for this product.”
* “Create JSON-LD schema.”
* “Make this product more recommendable for acne-prone users.”

---

## 13. Generative UI Requirement

The demo should clearly show that AI is not just returning text.

The AI should generate or update:

* Score cards
* Product cards
* Missing signal checklists
* Query match tables
* FAQ blocks
* Comparison tables
* Schema preview panels
* Editable recommendation cards

This is the main hackathon alignment.

Bad demo:

> AI says: “You should add FAQs and better descriptions.”

Good demo:

> AI creates an editable product optimization workspace with title, description, FAQ, comparison table, schema, and apply buttons.

---

## 14. UI Style Direction

### Visual Style

* Clean SaaS dashboard
* Modern AI product feel
* White background
* Soft cards
* Rounded corners
* Subtle borders
* Clear score visualization
* E-commerce product cards

### Suggested Layout

```text
-------------------------------------------------
Top Nav: AgentShelf | Catalog | Dashboard | Fixes
-------------------------------------------------

Left/Main:
  GEO Readiness Dashboard
  Product Cards
  Query Simulator
  Fix Workspace

Right:
  Copilot Sidebar
  Agent Actions
  Current Analysis
```

### Color Concepts

No need to overcomplicate.

Suggested semantic usage:

* Green: ready / strong signal
* Yellow: needs improvement
* Red: missing / weak signal
* Blue or purple: AI-generated recommendation

---

## 15. Demo Script for Project Video

### Scene 1: Problem

Narration:

> Search is changing. Customers are no longer just typing keywords into Google. They are asking AI agents what to buy. But most e-commerce product pages are not ready for AI shopping.

Show:

* AgentShelf landing page
* Skincare catalog selected

---

### Scene 2: Catalog Audit

User action:

Click:

> Start GEO Audit

Narration:

> AgentShelf audits a product catalog for AI discoverability, clarity, comparison readiness, trust signals, and schema completeness.

Show:

* Dashboard scores appear
* Product cards appear
* Missing signals are highlighted

---

### Scene 3: AI Shopping Query

User enters:

> Best lightweight sunscreen under $30 for oily acne-prone skin

Narration:

> Instead of guessing SEO keywords, AgentShelf simulates how an AI shopping agent may evaluate the catalog for a real customer question.

Show:

* ClearGlow gets partial match
* Missing signals explain why it may not be ranked first

---

### Scene 4: Generate GEO Fix

User clicks:

> Generate GEO Fix

Narration:

> AgentShelf turns AI analysis into an interactive workspace. It generates an optimized title, description, FAQs, comparison table, and structured schema.

Show:

* Editable title
* FAQ cards
* Comparison table
* JSON-LD preview

---

### Scene 5: Apply Fix

User clicks:

> Apply Fix

Narration:

> The merchant can review, edit, and apply the improvements. AgentShelf helps brands move from SEO to GEO: from ranking on search engines to being recommended by AI agents.

Show:

* Product score improves from 64 to 88
* Status changes to “Agent-ready”

---

## 16. Success Criteria for Hackathon Demo

The project is successful if the video clearly communicates:

1. What AgentShelf does
2. Why GEO matters for e-commerce
3. How AI output becomes interactive UI
4. How merchants can act on the output
5. How sponsor tools fit into the architecture

Minimum working demo:

* One mock catalog
* One dashboard
* One query simulator
* One product fix flow
* One CopilotKit agent interaction

---

## 17. Product Tagline Options

Recommended:

> Make every product agent-ready.

Other options:

> From SEO to GEO for AI commerce.

> Help AI agents understand and recommend your products.

> Turn product pages into AI-readable shopping signals.

> The GEO console for the next era of e-commerce discovery.

---

## 18. Final Hackathon Positioning

**AgentShelf is not a generic SEO tool.**

It is a new category:

> GEO Readiness Console for AI Commerce

It helps merchants answer:

* Can AI agents understand my products?
* Can they compare my products correctly?
* Can they recommend them for the right customer intent?
* What product signals are missing?
* What should I change to become agent-ready?

For the hackathon, the product should focus on a polished and convincing workflow rather than deep backend integration.

The strongest demo is:

> A merchant asks a natural-language question, and AgentShelf generates a complete interactive commerce optimization workspace.
