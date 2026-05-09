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
* **Perplexity**: Showing significant growth on the consumer side, with increasingly close partnerships with businesses — representing an important future direction for answer engine commercialization, and our next key target.

**Pain Point**: Merchants do not know how to make their products correctly understood and recommended in these AI channels, and they lack targeted content preparation and channel management tools.

## 3. Core Modules

### 3.1 AI Commerce Channel Dashboard
**Goal**:
Allow merchants to see the readiness of their products across different AI Commerce channels.

**MVP Focused Channels**:

| Channel | Positioning | MVP Implementation |
| --- | --- | --- |
| ChatGPT / OpenAI Ads | Core channel (largest consumer traffic) | Full Commercial Readiness analysis |
| Google AI Mode / Merchant Center | Core channel (largest consumer traffic) | Full Merchant Center readiness check |
| Perplexity | Next target (significant consumer growth) | Coming Soon card + GEO readiness preview |
| Claude | Future channel | Coming Soon card |
| Gemini | Future channel | Coming Soon card |

**Core Channel UI Display**:
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
  * "best noise cancelling headphones under $200"
  * "ThinkPad vs MacBook for programming"
  * "lightweight hiking boots for women"
  * "dog harness for large dogs that pull"
* **Sponsored Placement Readiness**
  * Whether the product is suitable to be displayed as a sponsored product / service
  * Whether there is a sufficiently clear purchase scenario
  * Whether price, selling points, and target audience are clear
* **Ad-safe Product Summary**
  * Short, credible, non-overpromising product descriptions
* **Comparison Claims**
  * Points of differentiation compared to competitors
  * Avoiding exaggerated statements
* **Landing Page Fixes**
  * Product page optimization suggestions tailored for ChatGPT commercial traffic

**MVP UI Example**:
```text
ChatGPT Commercial Pack

Primary Intent:
"Best noise cancelling headphones under $200 for commuting"

Recommended Sponsored Message:
"Sony WH-1000XM5 offers industry-leading noise cancellation with 30-hour battery life, designed for daily commuters and frequent travelers."

Risk Warning:
Avoid claiming "best noise cancellation" without referencing a specific test standard.

Required Fixes:
- Add commute/work-from-home use case
- Add comparison with AirPods Max
- Add comfort FAQ for long wear
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
  "title": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black",
  "brand": "Sony",
  "price": "198.00 USD",
  "availability": "in_stock",
  "condition": "new",
  "product_type": "Electronics > Audio > Headphones > Over-Ear",
  "description": "Industry-leading noise cancellation with Auto NC Optimizer, 30-hour battery life, and ultra-comfortable design for all-day wear.",
  "shipping": "Free shipping over $35",
  "return_policy": "30-day returns"
}
```

### 3.4 SEO vs GEO Before/After Comparison (Core Showcase)
**Goal**:
On a single page, visually display the traffic and conversion differences between traditional SEO and AI Commerce (GEO), allowing judges to instantly see the product's business value.

**Comparison Dimensions**:

| Metric | SEO (Traditional) | GEO (AI Commerce) | Change |
| --- | --- | --- | --- |
| Est. Monthly Traffic | Based on current search volume | Based on AI search penetration forecast | ↑ Growth % |
| Conversion Rate | Category avg. SEO conversion | Estimated GEO conversion | ↑ Increase |
| Customer Acquisition Cost | Current Google Ads CPC | Est. AI channel CAC | ↓ Decrease |
| Channel Coverage | Google Search only | ChatGPT + Google AI + Perplexity | 3x |

**Category Conversion Rate Reference** (MVP uses fixed data):

| Category | SEO Avg. Conversion | GEO Est. Conversion | Notes |
| --- | --- | --- | --- |
| Electronics | 1.5-2.5% | 4-6% | High AI recommendation scenario match |
| Outdoor & Sports | 2-3% | 5-7% | Clear use cases, easy for AI to match |
| Pet Supplies | 2.5-3.5% | 5-8% | Specific demand descriptions, precise recommendations |
| Health Supplements | 1.5-2% | 3-5% | Requires trust building, AI recommendations have an advantage |

**UI Display**:
Left side shows "Before" (current SEO state), right side shows "After" (post-GEO optimization estimate), with arrows and percentage labels indicating improvement. Judges can instantly see: **after optimization, how much the product's recommendation probability in AI search improves, and the estimated new traffic and conversions.**

### 3.5 Perplexity / Answer Engine Visibility (Next Target)
**Background**:
Perplexity is showing significant growth on the consumer side, with increasingly close partnerships with businesses. While its ad strategy is still evolving, as a representative of answer engine commercialization, it is our next key target.

**Features**:
The Perplexity module is presented as a "Coming Soon" card in the MVP, focusing on:
* How easily the product can be cited by an answer engine
* Whether the product page has credible sources
* Whether there is a clear FAQ
* Whether it can generate comparative answers by AI
* Whether it has citable structured claims

**MVP UI Display**:
Shown as a Coming Soon card; clicking reveals a GEO readiness preview and "coming soon" notice.

### 3.6 AI Commerce Launch Checklist
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
2. **Tab 2: AI Commerce Channels**: Full showcase for ChatGPT + Google AI Mode, with Coming Soon cards for Perplexity and other channels.
3. **Tab 3: Commercial Launch Pack**: Includes intent mapping, Feed Patch, FAQ, JSON-LD, SEO vs GEO Before/After comparison, and Mock Publish Checklist.

### 4.1 Mock Product Data Strategy
The demo uses a pre-built product catalog covering the following categories, allowing judges to select different categories to experience the product:

**Category 1: Electronics Merchant**
* Apple MacBook Pro 14" M3
* Apple MacBook Air 15" M3
* Apple iPhone 15 Pro Max
* Apple AirPods Pro 2
* Apple AirPods Max
* ThinkPad X1 Carbon Gen 11
* Samsung Galaxy S24 Ultra
* Google Pixel 8 Pro
* Custom Desktop PC (High-end gaming / Design workstation)
* Google Pixel Buds Pro

**Category 2: Outdoor & Sports Merchant**
* Waterproof Backpack (30L / 50L)
* Hiking Boots (Men's / Women's)
* Water Shoes
* Trekking Poles (Carbon fiber / Aluminum)
* Hardshell Jacket (Gore-Tex)
* Camping Tent (2-person / 4-person)
* Headlamp
* Insulated Water Bottle

**Category 3: Pet Supplies Merchant**
* Dog Leash (Large / Medium breeds)
* Cat Food (Indoor cat / Kitten)
* Dog Food (Large breed / Small breed)
* Pet Clothing (Raincoat / Winter coat)
* Cat Scratching Post
* Automatic Pet Feeder
* Pet Carrier Backpack

**Category 4: Health Supplements Merchant**
* Fish Oil Capsules (Omega-3)
* Vitamin D3
* Probiotic Capsules
* Collagen Powder
* Melatonin Tablets
* Multivitamin (Men's / Women's)
* Protein Powder (Whey / Plant-based)

## 5. System Architecture & Tech Stack
**Core Tech Stack**: CopilotKit + OpenAI + LangChain + Daytona

### 5.1 Tech Component Selection
* **Frontend & Agentic UI**:
  * Framework: **Next.js / React / Tailwind CSS**
  * Interaction: **CopilotKit**. Used to implement AI Chat / Copilot sidebar, generate GEO Readiness Dashboard, and dynamically render interactive cards (e.g., Agent directly updating the UI after a user clicks "Fix Description").
* **Core AI Engine (AI Model)**:
  * Model: **OpenAI GPT-5.5** (primary model).
  * Responsibilities: Read Shopify product JSON, evaluate AI recommendation potential, identify missing fields, generate user query intents, and generate optimized copy (description / FAQ / schema).
  * Note: Supports Google Gemini model API integration as an optional alternative.
* **Workflow Layer**:
  * Framework: **LangChain**.
  * Responsibilities: Orchestrate multi-step Agent logic: `Catalog Input → Audit Agent → Missing Signal Detector → Simulator → GEO Fix Generator → UI Update`.
* **Sandbox Execution Environment**:
  * Tool: **Daytona**. Used for secure execution of AI-generated code, such as JSON-LD schema validation and batch catalog checks.
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
OpenAI GPT-5.5 (LLM)
        ↓
Daytona Sandbox (Schema Validation / Batch Audit)
        ↓
Core Tools:
  - get_product_catalog() → Mock Shopify catalog
  - audit_product_readiness() → GEO readiness scoring
  - generate_geo_faq() → FAQ generation
  - generate_product_schema() → JSON-LD generation
  - simulate_ai_shopping_query() → AI shopping query simulation
  - apply_mock_patch() → Mock Shopify update
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
  brand: string;
  gtin?: string;
  sku?: string;
  ingredients?: string[];
  targetAudience?: string[];
  attributes?: Record<string, string>;
  reviews?: { rating: number; count: number; summary: string; };
  images?: string[];
  shippingPolicy?: string;
  returnPolicy?: string;
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

// SEO vs GEO Comparison Data
type SeoGeoComparison = {
  productId: string;
  category: string;
  seoMetrics: {
    estimatedMonthlyTraffic: number;
    conversionRate: number;
    cac: number;
    channelCoverage: string;
  };
  geoMetrics: {
    estimatedMonthlyTraffic: number;
    conversionRate: number;
    cac: number;
    channelCoverage: string[];
  };
  improvementPercent: {
    traffic: number;
    conversion: number;
    cacReduction: number;
  };
};
```

### 6.2 Core Tool/API Design
* `getProductCatalog(catalogId)`: Returns a mock product catalog (supports Electronics / Outdoor & Sports / Pet Supplies / Health Supplements).
* `auditProductReadiness(product)`: Returns product scores across various dimensions and missing signals.
* `simulateShoppingQuery(query, catalog)`: Simulates the recall logic of an AI shopping assistant for a specific query.
* `generateGeoFixes(product, queryContext)`: Returns an optimized title, description, FAQ, comparison table, and JSON-LD.
* `applyMockPatch(productId, patch)`: Updates local UI state, simulating syncing changes to Shopify.
* `generateSeoGeoComparison(product, category)`: Generates SEO vs GEO traffic and conversion comparison data.

## 7. Demo Flow / User Story

### Act 1: The Problem (30 seconds)
**Display**: Open the AgentShelf Dashboard and select a product — **"Sony WH-1000XM5 Headphones"**.
**Details**: Show the product's current GEO Readiness score is only 64, highlighting key flaws:
* Missing structured use case descriptions
* No content targeting high-value intents like "commuting" / "work from home"
* No competitor comparison (vs AirPods Max, Bose QC Ultra)
* No JSON-LD structured data
* Missing FAQ

**Narration**:
> This is a best-selling headphone, but when users ask AI "best noise cancelling headphones for commuting," it won't be recommended. Why? Because AI can't understand its core selling points.

### Act 2: The Solution (2 minutes)
**Display**: Click the **"AI Commerce Ready"** button, and AgentShelf automatically executes:

**Step 1 - ChatGPT Commercial Readiness**:
* Generates Commercial Intent Map: hits "best noise cancelling headphones under $200 for commuting"
* Generates Sponsored Message Preview
* Generates Ad-safe Product Summary
* Flags Risk Warning

**Step 2 - Google AI Mode Readiness**:
* Generates Merchant Center Feed Patch (fills in GTIN, brand, category, etc.)
* Generates JSON-LD Product Schema
* Supplements Shipping / Return Policy

**Step 3 - GEO Fix**:
* Optimizes product title
* Generates structured FAQ
* Generates competitor comparison table
* Optimizes product description

**Narration**:
> AgentShelf completed in 30 seconds what used to take an e-commerce team days: analyzing missing signals across AI channels, generating optimized content, and preparing for launch.

### Act 3: The Result (30 seconds)
**Display**: A **SEO vs GEO Before/After comparison panel** slides in on the right side of the Dashboard:

| Metric | Before (SEO) | After (GEO) | Change |
| --- | --- | --- | --- |
| GEO Readiness Score | 64 | 88 | +37% |
| AI Channel Coverage | Google only | ChatGPT + Google AI | 2x |
| Est. Monthly Traffic Lift | - | +45% | ↑ |
| Est. Conversion Rate | 2.1% | 5.2% | +147% |
| Channel Status | Not Ready | Pilot Ready | ✓ |

**Narration**:
> After optimization, this headphone becomes recommendable in both ChatGPT and Google AI search. Estimated monthly traffic increases by 45%, and the conversion rate jumps from 2.1% to 5.2%. This is the power of GEO.

## 8. References
* [Advertise in ChatGPT | OpenAI Ads](https://ads.openai.com/?utm_source=chatgpt.com)
* [New ways AI in Search helps your business (Google Blog)](https://blog.google/products/ads-commerce/google-search-ai-brand-discovery/?utm_source=chatgpt.com)
* [Product data specification (Google Merchant Center Help)](https://support.google.com/merchants/answer/7052112?hl=en&utm_source=chatgpt.com)
* [Intro to Product Structured Data on Google](https://developers.google.com/search/docs/appearance/structured-data/product?utm_source=chatgpt.com)
* [Perplexity testing ads / pausing ads (Search Engine Land)](https://searchengineland.com/perplexity-begins-testing-ads-448277?utm_source=chatgpt.com)
