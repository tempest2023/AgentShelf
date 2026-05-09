# 产品与技术设计文档 (PRD & TDD): AgentShelf

## 1. 产品概述 (Product Overview)
**产品名称**: AgentShelf - AI Commerce Channel Manager
**产品一句话定位**: AgentShelf 是一个 AI Commerce Readiness 与渠道管理控制台，帮助电商品牌让商品在 ChatGPT、Google AI Mode、Perplexity 以及未来 AI Shopping Agent 中变得可理解、可比较、可推荐、可商业化接入。
**核心价值**: 帮助商家从传统 SEO 进入 GEO (Generative Engine Optimization)，再从 GEO 演进至全渠道的 AI Commerce，成为商家的 **AI Commerce Operating System**。

## 2. 背景与市场机会 (Background & Opportunity)
传统电商增长主要依赖：`SEO + Google Ads + Meta Ads + Shopify Store`
而在 AI Commerce 时代，流量入口正在发生根本性转变：`GEO + AI Answer Engine Visibility + Agent Shopping Readiness + AI-native Ads`

* **OpenAI**: 已经开始测试 ChatGPT 广告，并强调广告可以在用户“探索选项、比较方案、权衡取舍、做决策”时触达用户，且清晰标注不影响自然回答。
* **Google**: 将 AI 搜索与商业化深度结合，Google Merchant Center 的商品数据规范明确表示会用商家提交的数据匹配相关查询。
* **Perplexity 等 Answer Engines**: 代表了未来的问答式搜索引擎曝光渠道。

**痛点**: 商家不知道如何让自己的商品在这些 AI 渠道中被正确理解和推荐，缺乏针对性的内容准备和渠道管理工具。

## 3. 核心功能模块 (Core Modules)

### 3.1 AI Commerce Channel Dashboard
**目标**:
让商家看到自己的商品在不同 AI Commerce 渠道中的准备情况。

**支持渠道**:
Hackathon MVP 可以展示以下渠道卡片：

| Channel | Current Status | MVP 实现方式 |
| --- | --- | --- |
| ChatGPT / OpenAI Ads | Coming / Pilot-ready | Mock 接入状态 + 商业意图匹配分析 |
| Google AI Mode / Merchant Center | Ready to prepare | Mock Merchant Center readiness check |
| Perplexity | Monitor / Future-ready | Mock Answer Engine visibility preview |
| Claude | No merchant ads yet | 只做 GEO readiness compatibility |
| Gemini | Google ecosystem-ready | Mock Google AI shopping readiness |

**UI 展示**:
每个渠道展示：
* Channel readiness score
* Product feed compatibility
* Missing required attributes
* Query intent coverage
* Ad / sponsored placement readiness
* Organic AI answer visibility
* Next setup actions

**示例**:
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
**背景**:
OpenAI 的广告逻辑不同于传统搜索广告。OpenAI 官方描述的核心场景是：用户在 ChatGPT 中探索选项、比较替代方案、权衡取舍并做决策时，广告可以出现。

这意味着商家不应该只准备关键词，而应该准备：
* 用户购买意图
* 商品适用场景
* 竞品对比点
* 决策理由
* 信任信号
* 价格与优惠信息
* FAQ
* 可被 AI 理解的结构化商品信息

**AgentShelf 功能**:
AgentShelf 可以生成一个 ChatGPT Commercial Pack：
* **Commercial Intent Map**
  * “best sunscreen for oily skin”
  * “mineral sunscreen under $30”
  * “non-greasy sunscreen for acne-prone skin”
  * “daily sunscreen that works under makeup”
* **Sponsored Placement Readiness**
  * 商品是否适合被展示为 sponsored product / service
  * 是否有足够清晰的购买场景
  * 是否有明确价格、卖点、适用人群
* **Ad-safe Product Summary**
  * 简短、可信、不过度承诺的商品描述
* **Comparison Claims**
  * 和竞品相比的差异点
  * 避免医疗化、夸大化表述
* **Landing Page Fixes**
  * 为 ChatGPT commercial traffic 准备的商品页优化建议

**MVP UI 示例**:
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
**背景**:
Google 的 AI Commerce 更依赖 Merchant Center、Shopping Graph、结构化商品数据和广告系统。Google Merchant Center 官方商品数据规范说明，Google 使用商品数据来匹配用户查询，准确且格式正确的商品数据对广告和免费商品展示都很重要。

Google 的 Product structured data 文档也说明，商品结构化数据可以让价格、库存、评分、配送等信息以更丰富的方式出现在 Google Search、Google Images、Google Lens 等结果中。

**AgentShelf 功能**:
AgentShelf 可以生成 Google AI Mode Readiness Checklist：
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

**MVP UI 示例**:
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

**可以生成的 Mock Output**:
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
**背景**:
Perplexity 之前测试过 sponsored follow-up questions 这种广告形式，广告以赞助问题的方式出现在答案旁边，且答案由 Perplexity 生成，而不是由广告主直接撰写。

不过 Perplexity 的广告策略存在变化。有报道显示 Perplexity 后来暂停了广告测试，理由是即使标注广告，也可能影响 AI answer engine 的可信度。

所以在设计文档里不要把 Perplexity 写成“已经有稳定广告 API”。更准确的说法是：
> Perplexity represents an answer-engine visibility channel. AgentShelf prepares merchants for future sponsored or organic answer-engine surfaces, but does not assume a stable Perplexity merchant ads API today.

**功能**:
Perplexity 模块应聚焦于：
* 商品是否容易被 answer engine 引用
* 商品页是否有可信来源
* 是否有清晰 FAQ
* 是否能被 AI 生成对比答案
* 是否有可引用的 structured claims
* 是否有 source-friendly product content

**MVP UI 示例**:
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
**目标**: 提供跨渠道的执行清单，用于统一追踪发布进度。
**示例 Checklist**:

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

## 4. Hackathon MVP 落地范围 (MVP Scope)
在 Hackathon 期间，不实际接入 OpenAI Ads 或 Google Merchant Center 的真实 API，而是通过 Mock Data 实现以下三个核心 Tab：
1. **Tab 1: GEO Readiness**: 商品评分、缺失信号检查、Query Simulator、GEO Fix。
2. **Tab 2: AI Commerce Channels**: 各大 AI 渠道（ChatGPT, Google, Perplexity 等）的准备度卡片。
3. **Tab 3: Commercial Launch Pack**: 包含意图映射、Feed Patch、FAQ、JSON-LD 以及 Mock Publish Checklist。

## 5. 系统架构与技术栈 (System Architecture & Tech Stack)
**核心技术组合**: CopilotKit + Gemini + LangChain + MCP mock tools

### 5.1 技术组件选型
* **前端与交互 (Frontend & Agentic UI)**:
  * 框架：**Next.js / React / Tailwind CSS**
  * 交互：**CopilotKit**。用于实现 AI Chat / Copilot sidebar、生成 GEO Readiness Dashboard、动态渲染交互式卡片（如点击 "Fix Description" 后 Agent 直接更新 UI）。
* **核心 AI 引擎 (AI Model)**:
  * 模型：**Google Gemini** (或 OpenAI)。
  * 职责：读取 Shopify product JSON，评估 AI 推荐潜力，识别缺失字段，生成 user query intents，以及生成优化后的文案（description / FAQ / schema）。
* **工作流管理 (Workflow Layer)**:
  * 框架：**LangChain**。
  * 职责：编排多步 Agent 逻辑：`Catalog Input → Audit Agent → Missing Signal Detector → Simulator → GEO Fix Generator → UI Update`。
* **工具与集成层 (Tools Layer)**:
  * 规范：**MCP-style mock tools**。封装为 Agent 可调用的 commerce tools，如拉取商品、生成 FAQ、打补丁等。
* **批量任务 (Batch Auditing) - 可选**:
  * 工具：**Daytona**。用于安全的批量检查 JSON-LD schema，生成下载报告。

### 5.2 高层架构图 (High-Level Architecture)
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

## 6. 核心数据模型与 API 设计 (Data Model & Tools)

### 6.1 数据模型设计 (Mock Data Design)
```typescript
// 商品对象
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

// 审核结果对象
type ProductAudit = {
  productId: string;
  aiReadinessScore: number;
  discoverabilityScore: number;
  clarityScore: number;
  schemaScore: number;
  missingSignals: string[];
  recommendedFixes: GeoFix[];
};

// GEO 修复对象
type GeoFix = {
  type: "title" | "description" | "faq" | "comparison" | "schema";
  currentValue?: string;
  suggestedValue: string;
  reasoning: string;
};

// Query 模拟结果对象
type QuerySimulation = {
  query: string;
  matches: { productId: string; matchScore: number; reason: string; missingSignals: string[]; }[];
  agentPreviewAnswer: string;
};
```

### 6.2 核心 Tool/API 设计 (MCP Tools)
* `getProductCatalog(catalogId)`: 返回 Mock 的美妆护肤品类 catalog。
* `auditProductReadiness(product)`: 返回商品各维度的评分和 missing signals。
* `simulateShoppingQuery(query, catalog)`: 模拟 AI 购物助手针对特定 query（如“适合痘痘肌的防晒”）的召回逻辑。
* `generateGeoFixes(product, queryContext)`: 返回优化后的标题、描述、FAQ、比较表格和 JSON-LD。
* `applyMockPatch(productId, patch)`: 更新本地 UI 状态，模拟将改动同步至 Shopify。

## 7. Demo 流程设计 / User Story (Demo Flow)

### Scene 1：从 SEO 到 GEO，再到 AI Commerce
**旁白**：
> Search is becoming conversational, and commerce is moving into AI assistants. Brands no longer only need SEO. They need to be readable, recommendable, and commercially ready across AI channels.

### Scene 2：商品 GEO Audit
**展示**：原有 Dashboard，商家选择特定商品 **“ClearGlow Mineral Sunscreen SPF 30”**。
**细节**：展示该商品目前的 AI 准备度评分仅为 64 分，并指出其缺陷（如：页面未明确说明是否致痘、缺乏结构化的价格和物流信息、没有针对敏感肌的专门描述等）。

### Scene 3：ChatGPT Commercial Readiness
**展示**：
* **Commercial intent map**: 命中高价值商业意图 “Best lightweight sunscreen under $30 for oily acne-prone skin”。
* **Sponsored message preview**: 预览生成的赞助内容：“ClearGlow is a lightweight mineral SPF 30 sunscreen designed for oily-skin routines, with a non-greasy finish and daily-wear texture.”
* **Ad-safe product summary**: 提炼出针对痘痘肌的安全性声明。
* **Risk warning**: 提示风险：“Avoid claiming 'prevents acne' unless clinically supported.”

**旁白**：
> Since AI ads are emerging inside assistants, AgentShelf helps merchants prepare commercial-intent product content without confusing paid placement with organic answers.

*(注意：需强调 OpenAI 明确说广告不会影响自然回答，广告是独立、清晰标注的。)*

### Scene 4：Google AI Mode / Merchant Center Readiness
**展示**：针对 **ClearGlow Sunscreen** 的数据修复
* **Merchant Center feed patch**: 自动填补缺失的属性，例如 GTIN，并明确 `targetAudience: oily/acne-prone skin`。
* **JSON-LD schema**: 为商品页生成符合 Google 规范的结构化数据代码块。
* **Missing shipping / return policy**: 提示并补充确实的物流和 30 天退换货政策。

**旁白**：
> For Google AI Mode, product data quality matters. AgentShelf turns messy product pages into structured product feeds and schema-ready content.

### Scene 5：AI Commerce Launch Pack
**展示**：
* 一键生成针对 **ClearGlow Sunscreen** 的 cross-channel launch checklist（跨渠道发布任务清单）。
* Mock publish：一键应用所有生成的优化内容（描述、FAQ、结构化数据等）。
* 核心指标变化：ClearGlow 的 Score 从 **64** 提升到 **88**。
* 状态变化：Channel status 从 **“Not Ready”** 变成 **“Pilot Ready”**。

## 8. 参考资料 (References)
* [Advertise in ChatGPT | OpenAI Ads](https://ads.openai.com/?utm_source=chatgpt.com)
* [New ways AI in Search helps your business (Google Blog)](https://blog.google/products/ads-commerce/google-search-ai-brand-discovery/?utm_source=chatgpt.com)
* [Product data specification (Google Merchant Center Help)](https://support.google.com/merchants/answer/7052112?hl=en&utm_source=chatgpt.com)
* [Intro to Product Structured Data on Google](https://developers.google.com/search/docs/appearance/structured-data/product?utm_source=chatgpt.com)
* [Perplexity testing ads / pausing ads (Search Engine Land)](https://searchengineland.com/perplexity-begins-testing-ads-448277?utm_source=chatgpt.com)
