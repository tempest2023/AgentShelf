# Product and Technical Design Document (PRD & TDD): AgentShelf

## 1. Product Overview
**Product Name**: AgentShelf - AI Commerce Channel Manager
**One-Line Positioning**: AgentShelf is an AI Commerce Readiness and channel management console that helps e-commerce brands make their products readable, comparable, recommendable, and commercially ready across ChatGPT, Google AI Mode, Perplexity, and future AI Shopping Agents.
**Core Value**: Help merchants transition from traditional SEO to GEO (Generative Engine Optimization), and from GEO to omni-channel AI Commerce, becoming the merchant's **AI Commerce Operating System**.

## 2. Background & Opportunity
Traditional e-commerce growth primarily relies on: `SEO + Google Ads + Meta Ads + Shopify Store`
In the AI Commerce era, the traffic gateways are undergoing a fundamental shift: `GEO + AI Answer Engine Visibility + Agent Shopping Readiness + AI-native Ads`

* **OpenAI**: Has already started testing ChatGPT ads, emphasizing that ads can reach users when they are "exploring options, comparing alternatives, weighing trade-offs, and making decisions", and clearly stating that ads will not impact natural answers.
* **Google**: Is deeply integrating AI search with commercialization. Google Merchant Center's product data specifications explicitly state that Google will use merchant-submitted data to match relevant queries.
* **Answer Engines like Perplexity**: Represent the future visibility channels of question-answering search engines.

**Pain Point**: Merchants do not know how to make their products correctly understood and recommended in these AI channels, and they lack targeted content preparation and channel management tools.

## 3. Core Modules

### 3.1 AI Commerce Channel Dashboard
**Goal**:
Allow merchants to see the readiness of their products across different AI Commerce channels.

**Supported Channels**:
The Hackathon MVP can display the following channel cards:

| Channel | Current Status | MVP Implementation |
| --- | --- | --- |
| ChatGPT / OpenAI Ads | Coming / Pilot-ready | Mock connection status + commercial intent matching analysis |
| Google AI Mode / Merchant Center | Ready to prepare | Mock Merchant Center readiness check |
| Perplexity | Monitor / Future-ready | Mock Answer Engine visibility preview |
| Claude | No merchant ads yet | Only for GEO readiness compatibility |
| Gemini | Google ecosystem-ready | Mock Google AI shopping readiness |

**UI Display**:
Each channel displays:
* Channel readiness score
* Product feed compatibility
* Missing required attributes
* Query intent coverage
* Ad / sponsored placement readiness
* Organic AI answer visibility
* Next setup actions

**Example**:
```text
ChatGPT Commerce Readiness: 72 / 100
Status: OpenAI Ads pilot-ready
Missing:
- Clear product use cases
- Strong comparison claims
- Structured FAQ
- Commercial-intent query mapping
Recommended Action:
Generate ChatGPT Ads intent pack
```

### 3.2 ChatGPT Commercial Readiness
**Background**:
OpenAI's ad logic differs from traditional search ads. The core scenario described officially by OpenAI is: ads can appear when users explore options, compare alternatives, weigh trade-offs, and make decisions in ChatGPT.

This means merchants shouldn't just prepare keywords; they should prepare:
* User purchase intent
* Product use cases
* Competitor comparison points
* Decision reasoning
* Trust signals
* Pricing and offer information
* FAQ
* Structured product information understandable by AI

**AgentShelf Features**:
AgentShelf can generate a ChatGPT Commercial Pack:
* **Commercial Intent Map**
  * "best sunscreen for oily skin"
  * "mineral sunscreen under $30"
  * "non-greasy sunscreen for acne-prone skin"
  * "daily sunscreen that works under makeup"
* **Sponsored Placement Readiness**
  * Whether the product is suitable to be displayed as a sponsored product / service
  * Whether there is a sufficiently clear purchase scenario
  * Whether price, selling points, and target audience are clear
* **Ad-safe Product Summary**
  * Short, credible, non-overpromising product descriptions
* **Comparison Claims**
  * Points of differentiation compared to competitors
  * Avoiding medical or exaggerated statements
* **Landing Page Fixes**
  * Product page optimization suggestions tailored for ChatGPT commercial traffic

**MVP UI Example**:
```text
ChatGPT Commercial Pack

Primary Intent:
"Best lightweight sunscreen under $30 for oily acne-prone skin"

Recommended Sponsored Message:
"ClearGlow is a lightweight mineral SPF 30 sunscreen designed for oily-skin routines, with a non-greasy finish and daily-wear texture."

Risk Warning:
Avoid claiming "prevents acne" unless clinically supported.

Required Fixes:
- Add non-comedogenic clarification
- Add under-makeup FAQ
- Add texture comparison
- Add return and shipping policy
```

### 3.3 Google AI Mode / Merchant Center Readiness
**Background**:
Google's AI Commerce relies more heavily on Merchant Center, Shopping Graph, structured product data, and its ad system. Google Merchant Center's official product data specifications state that Google uses product data to match user queries; accurate and well-formatted product data is critical for both ads and free product listings.

Google's Product structured data documentation also indicates that product structured data allows price, availability, ratings, shipping, and other info to appear in richer formats across Google Search, Google Images, Google Lens, etc.

**AgentShelf Features**:
AgentShelf can generate a Google AI Mode Readiness Checklist:
* Product title quality
* Description completeness
* GTIN / SKU / brand / category
* Price and availability
* Product images
* Shipping policy
* Return policy
* Reviews and rating
* Product structured data
* Merchant Center feed compatibility

**MVP UI Example**:
```text
Google AI Mode Readiness: 66 / 100

Merchant Center Feed Gaps:
- Missing GTIN
- Description too short
- No shipping policy
- No return policy
- Weak product attributes
- Missing product structured data

Recommended Fix:
Generate Google Merchant Center feed patch
```

**Mock Output Example**:
```json
{
  "title": "ClearGlow Lightweight Mineral Sunscreen SPF 30 for Oily Skin",
  "brand": "ClearGlow",
  "price": "24.00 USD",
  "availability": "in_stock",
  "condition": "new",
  "product_type": "Beauty > Skin Care > Sunscreen",
  "description": "A lightweight mineral SPF 30 sunscreen designed for oily and acne-prone routines.",
  "shipping": "Free shipping over $35",
  "return_policy": "30-day returns"
}
```

### 3.4 Perplexity / Answer Engine Visibility Preview
**Background**:
Perplexity previously tested an ad format called sponsored follow-up questions, where ads appeared as sponsored questions next to answers, and the answers were generated by Perplexity rather than written directly by the advertiser.

However, Perplexity's ad strategy has shifted. Reports indicate that Perplexity later paused ad testing, citing concerns that even labeled ads could impact the credibility of the AI answer engine.

Therefore, the design document should not portray Perplexity as having a "stable ads API." A more accurate phrasing is:
> Perplexity represents an answer-engine visibility channel. AgentShelf prepares merchants for future sponsored or organic answer-engine surfaces, but does not assume a stable Perplexity merchant ads API today.

**Features**:
The Perplexity module should focus on:
* How easily the product can be cited by an answer engine
* Whether the product page has credible sources
* Whether there is a clear FAQ
* Whether it can generate comparative answers by AI
* Whether it has citable structured claims
* Whether it has source-friendly product content

**MVP UI Example**:
```text
Perplexity Visibility Preview

User Query:
"What is a good mineral sunscreen for oily skin under $30?"

Likely Answer Engine Behavior:
Perplexity may cite pages with clear product specs, third-party reviews, and structured comparison content.

Weakness:
Your product page lacks source-friendly FAQ and comparison content.

Recommended Fix:
Generate answer-engine FAQ and comparison block.
```

### 3.5 AI Commerce Launch Checklist
**Goal**: Provide an execution checklist across multiple channels to uniformly track launch progress.
**Example Checklist**:

| Task                                        | Channel                       | Status       |
| ------------------------------------------- | ----------------------------- | ------------ |
| Generate GEO-optimized product descriptions | All AI engines                | Done         |
| Add structured FAQ                          | ChatGPT / Perplexity / Google | Done         |
| Generate JSON-LD Product Schema             | Google                        | Done         |
| Create Merchant Center feed patch           | Google AI Mode                | Needs review |
| Map commercial intent queries               | ChatGPT Ads                   | Done         |
| Generate sponsored message variants         | ChatGPT Ads                   | Needs review |
| Add comparison table                        | Perplexity / ChatGPT          | Done         |
| Add shipping and return policy              | Google / ChatGPT              | Missing      |
| Simulate AI shopping query                  | All                           | Done         |
| Mock publish changes                        | Shopify Mock                  | Ready        |

## 4. Hackathon MVP Scope
During the Hackathon, we will not integrate with the actual OpenAI Ads or Google Merchant Center APIs. Instead, we will use mock data to implement the following three core tabs:
1. **Tab 1: GEO Readiness**: Product scoring, missing signals detection, Query Simulator, GEO Fix.
2. **Tab 2: AI Commerce Channels**: Readiness cards for major AI channels (ChatGPT, Google, Perplexity, etc.).
3. **Tab 3: Commercial Launch Pack**: Includes intent mapping, Feed Patch, FAQ, JSON-LD, and Mock Publish Checklist.

## 5. System Architecture & Tech Stack
**Core Tech Stack**: CopilotKit + Gemini + LangChain + MCP mock tools

### 5.1 Tech Component Selection
* **Frontend & Agentic UI**:
  * Framework: **Next.js / React / Tailwind CSS**
  * Interaction: **CopilotKit**. Used to implement AI Chat / Copilot sidebar, generate GEO Readiness Dashboard, and dynamically render interactive cards (e.g., Agent directly updating the UI after a user clicks "Fix Description").
* **Core AI Engine (AI Model)**:
  * Model: **Google Gemini** (or OpenAI).
  * Responsibilities: Read Shopify product JSON, evaluate AI recommendation potential, identify missing fields, generate user query intents, and generate optimized copy (description / FAQ / schema).
* **Workflow Layer**:
  * Framework: **LangChain**.
  * Responsibilities: Orchestrate multi-step Agent logic: `Catalog Input → Audit Agent → Missing Signal Detector → Simulator → GEO Fix Generator → UI Update`.
* **Tools Layer**:
  * Specification: **MCP-style mock tools**. Encapsulated as commerce tools callable by the Agent, such as fetching products, generating FAQs, applying patches, etc.
* **Batch Auditing - Optional**:
  * Tool: **Daytona**. Used for secure batch auditing of JSON-LD schemas and generating downloadable reports.

### 5.2 High-Level Architecture
```text
React / Next.js (Tailwind UI)
        ↓
CopilotKit Agentic UI Layer
        ↓
LangChain Agent (Controller / API Route)
        ↓
Google Gemini (LLM)
        ↓
MCP-Style Tools:
  - get_product_catalog()
  - audit_product_readiness()
  - generate_geo_faq()
  - generate_product_schema()
  - simulate_ai_shopping_query()
  - apply_mock_patch()
        ↓
Updated Interactive Dashboard
```

## 6. Core Data Model & Tools

### 6.1 Mock Data Design
```typescript
// Product Object
type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  ingredients?: string[];
  targetAudience?: string[];
  attributes?: Record<string, string>;
  reviews?: { rating: number; count: number; summary: string; };
};

// Audit Result Object
type ProductAudit = {
  productId: string;
  aiReadinessScore: number;
  discoverabilityScore: number;
  clarityScore: number;
  schemaScore: number;
  missingSignals: string[];
  recommendedFixes: GeoFix[];
};

// GEO Fix Object
type GeoFix = {
  type: "title" | "description" | "faq" | "comparison" | "schema";
  currentValue?: string;
  suggestedValue: string;
  reasoning: string;
};

// Query Simulation Result Object
type QuerySimulation = {
  query: string;
  matches: { productId: string; matchScore: number; reason: string; missingSignals: string[]; }[];
  agentPreviewAnswer: string;
};
```

### 6.2 Core Tool/API Design (MCP Tools)
* `getProductCatalog(catalogId)`: Returns a mock beauty & skincare catalog.
* `auditProductReadiness(product)`: Returns product scores across various dimensions and missing signals.
* `simulateShoppingQuery(query, catalog)`: Simulates the recall logic of an AI shopping assistant for a specific query (e.g., "sunscreen for acne-prone skin").
* `generateGeoFixes(product, queryContext)`: Returns an optimized title, description, FAQ, comparison table, and JSON-LD.
* `applyMockPatch(productId, patch)`: Updates local UI state, simulating syncing changes to Shopify.

## 7. Demo Flow / User Story

### Scene 1: From SEO to GEO, and to AI Commerce
**Narration**:
> Search is becoming conversational, and commerce is moving into AI assistants. Brands no longer only need SEO. They need to be readable, recommendable, and commercially ready across AI channels.

### Scene 2: Product GEO Audit
**Display**: Original Dashboard, the merchant selects the specific product **"ClearGlow Mineral Sunscreen SPF 30"**.
**Details**: Shows the product's current AI Readiness score is only 64, highlighting its flaws (e.g., the page doesn't explicitly state if it's non-comedogenic, lacks structured price and shipping info, and has no specific description for sensitive skin).

### Scene 3: ChatGPT Commercial Readiness
**Display**:
* **Commercial intent map**: Hits the high-value commercial intent "Best lightweight sunscreen under $30 for oily acne-prone skin".
* **Sponsored message preview**: Previews the generated sponsored content: "ClearGlow is a lightweight mineral SPF 30 sunscreen designed for oily-skin routines, with a non-greasy finish and daily-wear texture."
* **Ad-safe product summary**: Extracts a safety claim tailored for acne-prone skin.
* **Risk warning**: Shows risk warning: "Avoid claiming 'prevents acne' unless clinically supported."

**Narration**:
> Since AI ads are emerging inside assistants, AgentShelf helps merchants prepare commercial-intent product content without confusing paid placement with organic answers.

*(Note: Emphasize that OpenAI has explicitly stated ads will not affect natural answers, and ads are independent and clearly labeled.)*

### Scene 4: Google AI Mode / Merchant Center Readiness
**Display**: Data repair for **ClearGlow Sunscreen**.
* **Merchant Center feed patch**: Automatically fills in missing attributes like GTIN, and explicitly defines `targetAudience: oily/acne-prone skin`.
* **JSON-LD schema**: Generates a structured data code block compliant with Google's specifications for the product page.
* **Missing shipping / return policy**: Prompts and supplements the missing shipping and 30-day return policy.

**Narration**:
> For Google AI Mode, product data quality matters. AgentShelf turns messy product pages into structured product feeds and schema-ready content.

### Scene 5: AI Commerce Launch Pack
**Display**:
* Generates a 1-click cross-channel launch checklist specifically for **ClearGlow Sunscreen**.
* Mock publish: One-click application of all generated optimized content (descriptions, FAQs, structured data, etc.).
* Core Metric Changes: ClearGlow's Score increases from **64** to **88**.
* Status Changes: Channel status changes from **"Not Ready"** to **"Pilot Ready"**.

## 8. References
* [Advertise in ChatGPT | OpenAI Ads](https://ads.openai.com/?utm_source=chatgpt.com)
* [New ways AI in Search helps your business (Google Blog)](https://blog.google/products/ads-commerce/google-search-ai-brand-discovery/?utm_source=chatgpt.com)
* [Product data specification (Google Merchant Center Help)](https://support.google.com/merchants/answer/7052112?hl=en&utm_source=chatgpt.com)
* [Intro to Product Structured Data on Google](https://developers.google.com/search/docs/appearance/structured-data/product?utm_source=chatgpt.com)
* [Perplexity testing ads / pausing ads (Search Engine Land)](https://searchengineland.com/perplexity-begins-testing-ads-448277?utm_source=chatgpt.com)
