# 产品与技术设计文档 (PRD & TDD): AgentShelf

## 1. 产品概述 (Product Overview)
**产品名称**: AgentShelf - AI Commerce Channel Manager
**产品一句话定位**: AgentShelf 是一个 AI Commerce Readiness 与渠道管理控制台，帮助电商品牌让商品在 ChatGPT、Google AI Mode、Perplexity 以及未来 AI Shopping Agent 中变得可理解、可比较、可推荐、可商业化接入。
**核心价值**: 帮助商家从传统 SEO 进入 GEO (Generative Engine Optimization)，再从 GEO 演进至全渠道的 AI Commerce，成为商家的 **AI Commerce Operating System**。

## 2. 背景与市场机会 (Background & Opportunity)
传统电商增长主要依赖：`SEO + Google Ads + Meta Ads + Shopify Store`
而在 AI Commerce 时代，流量入口正在发生根本性转变：`GEO + AI Answer Engine Visibility + Agent Shopping Readiness + AI-native Ads`

* **OpenAI**: 已经开始测试 ChatGPT 广告，并强调广告可以在用户"探索选项、比较方案、权衡取舍、做决策"时触达用户，且清晰标注不影响自然回答。
* **Google**: 将 AI 搜索与商业化深度结合，Google Merchant Center 的商品数据规范明确表示会用商家提交的数据匹配相关查询。
* **Perplexity**: 在 C 端增长显著，与商业合作日益密切，代表了未来 answer engine 商业化的重要方向，是我们的下一个重点目标。

**痛点**: 商家不知道如何让自己的商品在这些 AI 渠道中被正确理解和推荐，缺乏针对性的内容准备和渠道管理工具。

## 3. 核心功能模块 (Core Modules)

### 3.1 AI Commerce Channel Dashboard
**目标**:
让商家看到自己的商品在不同 AI Commerce 渠道中的准备情况。

**MVP 聚焦渠道**:

| Channel | 定位 | MVP 实现方式 |
| --- | --- | --- |
| ChatGPT / OpenAI Ads | 核心渠道（C 端流量最大） | 完整实现 Commercial Readiness 分析 |
| Google AI Mode / Merchant Center | 核心渠道（C 端流量最大） | 完整实现 Merchant Center readiness check |
| Perplexity | 下一目标（C 端增长显著） | Coming Soon 卡片 + GEO readiness 预览 |
| Claude | 未来渠道 | Coming Soon 卡片 |
| Gemini | 未来渠道 | Coming Soon 卡片 |

**核心渠道 UI 展示**:
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
  * "best noise cancelling headphones under $200"
  * "ThinkPad vs MacBook for programming"
  * "lightweight hiking boots for women"
  * "dog harness for large dogs that pull"
* **Sponsored Placement Readiness**
  * 商品是否适合被展示为 sponsored product / service
  * 是否有足够清晰的购买场景
  * 是否有明确价格、卖点、适用人群
* **Ad-safe Product Summary**
  * 简短、可信、不过度承诺的商品描述
* **Comparison Claims**
  * 和竞品相比的差异点
  * 避免夸大化表述
* **Landing Page Fixes**
  * 为 ChatGPT commercial traffic 准备的商品页优化建议

**MVP UI 示例**:
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

### 3.4 SEO vs GEO Before/After 对比 (核心展示)
**目标**:
在同一页面中，直观展示商家在传统 SEO 和 AI Commerce (GEO) 之间的流量与转化差异，让评委一眼看到产品的商业价值。

**对比维度**:

| 指标 | SEO (传统) | GEO (AI Commerce) | 变化 |
| --- | --- | --- | --- |
| 预估月流量 | 基于当前搜索量 | 基于 AI 搜索渗透率预估 | ↑ 增长百分比 |
| 转化率 | 品类平均 SEO 转化率 | 预估 GEO 转化率 | ↑ 提升 |
| 单次获客成本 (CAC) | 当前 Google Ads CPC | AI 渠道预估 CAC | ↓ 降低 |
| 渠道覆盖 | Google Search only | ChatGPT + Google AI + Perplexity | 3x |

**品类转化率参考数据** (MVP 使用固定数据):

| 品类 | SEO 平均转化率 | GEO 预估转化率 | 说明 |
| --- | --- | --- | --- |
| 电子产品 | 1.5-2.5% | 4-6% | AI 推荐场景匹配度高 |
| 户外运动 | 2-3% | 5-7% | 使用场景明确，AI 容易匹配 |
| 宠物用品 | 2.5-3.5% | 5-8% | 需求描述具体，推荐精准 |
| 保健品 | 1.5-2% | 3-5% | 需要信任建设，AI 推荐有优势 |

**UI 展示方式**:
左侧展示 "Before"（当前 SEO 状态），右侧展示 "After"（GEO 优化后预估），中间用箭头和百分比标注提升幅度。评委可以一眼看到：**优化后，这个商品在 AI 搜索中被推荐的概率提升了多少，预估能带来多少新增流量和转化。**

### 3.5 Perplexity / Answer Engine Visibility (下一目标)
**背景**:
Perplexity 在 C 端增长显著，与商业合作日益密切。虽然其广告策略仍在演进中，但作为 answer engine 商业化的代表，是我们的下一个重点目标。

**功能**:
Perplexity 模块在 MVP 中作为 "Coming Soon" 卡片展示，核心聚焦于：
* 商品是否容易被 answer engine 引用
* 商品页是否有可信来源
* 是否有清晰 FAQ
* 是否能被 AI 生成对比答案
* 是否有可引用的 structured claims

**MVP UI 展示**:
以 Coming Soon 卡片形式展示，点击后显示 GEO readiness 预览和"即将支持"提示。

### 3.6 AI Commerce Launch Checklist
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
2. **Tab 2: AI Commerce Channels**: ChatGPT + Google AI Mode 完整展示，Perplexity 等渠道 Coming Soon 卡片。
3. **Tab 3: Commercial Launch Pack**: 包含意图映射、Feed Patch、FAQ、JSON-LD、SEO vs GEO Before/After 对比以及 Mock Publish Checklist。

### 4.1 Mock 商品数据方案
Demo 中使用预置的商品目录，覆盖以下品类，让评委可以选择不同品类的商品体验产品功能：

**品类 1：电子产品商家**
* Apple MacBook Pro 14" M3
* Apple MacBook Air 15" M3
* Apple iPhone 15 Pro Max
* Apple AirPods Pro 2
* Apple AirPods Max
* ThinkPad X1 Carbon Gen 11
* Samsung Galaxy S24 Ultra
* Google Pixel 8 Pro
* 自组装台式机 (高配游戏 / 设计工作站)
* Google Pixel Buds Pro

**品类 2：户外运动商家**
* 户外防水背包 (30L / 50L)
* 登山鞋 (男款 / 女款)
* 涉水鞋
* 登山杖 (碳纤维 / 铝合金)
* 冲锋衣 (Gore-Tex)
* 户外帐篷 (2人 / 4人)
* 头灯
* 保温水壶

**品类 3：宠物用品商家**
* 户外狗链 (大犬 / 中犬)
* 猫粮 (室内猫 / 幼猫)
* 狗粮 (大型犬 / 小型犬)
* 宠物服饰 (雨衣 / 冬装)
* 猫抓板
* 宠物自动喂食器
* 宠物背包

**品类 4：保健品商家**
* 鱼油胶囊 (Omega-3)
* 维生素 D3
* 益生菌胶囊
* 胶原蛋白粉
* 褪黑素片
* 复合维生素 (男款 / 女款)
* 蛋白粉 (乳清 / 植物基)

## 5. 系统架构与技术栈 (System Architecture & Tech Stack)
**核心技术组合**: CopilotKit + OpenAI + LangChain + Daytona

### 5.1 技术组件选型
* **前端与交互 (Frontend & Agentic UI)**:
  * 框架：**Next.js / React / Tailwind CSS**
  * 交互：**CopilotKit**。用于实现 AI Chat / Copilot sidebar、生成 GEO Readiness Dashboard、动态渲染交互式卡片（如点击 "Fix Description" 后 Agent 直接更新 UI）。
* **核心 AI 引擎 (AI Model)**:
  * 模型：**OpenAI GPT-5.5**（主模型）。
  * 职责：读取 Shopify product JSON，评估 AI 推荐潜力，识别缺失字段，生成 user query intents，以及生成优化后的文案（description / FAQ / schema）。
  * 备注：支持接入 Google Gemini 模型 API，在 OpenAI 接入完成后可快速切换。
* **工作流管理 (Workflow Layer)**:
  * 框架：**LangChain**。
  * 职责：编排多步 Agent 逻辑：`Catalog Input → Audit Agent → Missing Signal Detector → Simulator → GEO Fix Generator → UI Update`。
* **沙箱执行环境 (Sandbox)**:
  * 工具：**Daytona**。用于安全执行 AI 生成的代码，如 JSON-LD schema 验证、批量 catalog 检查等。
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
OpenAI GPT-5.5 (LLM)
        ↓
Daytona Sandbox (Schema Validation / Batch Audit)
        ↓
Core Tools:
  - get_product_catalog() → Mock Shopify catalog
  - audit_product_readiness() → GEO readiness 评分
  - generate_geo_faq() → FAQ 生成
  - generate_product_schema() → JSON-LD 生成
  - simulate_ai_shopping_query() → AI 购物查询模拟
  - apply_mock_patch() → Mock Shopify 更新
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

// SEO vs GEO 对比数据
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

### 6.2 核心 Tool/API 设计
* `getProductCatalog(catalogId)`: 返回 Mock 的商品目录（支持电子产品 / 户外运动 / 宠物用品 / 保健品）。
* `auditProductReadiness(product)`: 返回商品各维度的评分和 missing signals。
* `simulateShoppingQuery(query, catalog)`: 模拟 AI 购物助手针对特定 query 的召回逻辑。
* `generateGeoFixes(product, queryContext)`: 返回优化后的标题、描述、FAQ、比较表格和 JSON-LD。
* `applyMockPatch(productId, patch)`: 更新本地 UI 状态，模拟将改动同步至 Shopify。
* `generateSeoGeoComparison(product, category)`: 生成 SEO vs GEO 的流量和转化对比数据。

## 7. Demo 流程设计 / User Story (Demo Flow)

### 第一幕：问题 (30 秒)
**展示**：打开 AgentShelf Dashboard，选择一个商品 **"Sony WH-1000XM5 耳机"**。
**细节**：展示该商品目前的 GEO Readiness 评分仅为 64 分，指出关键缺陷：
* 缺少结构化的使用场景描述
* 没有针对 "commuting" / "work from home" 等高价值意图的内容
* 缺少竞品对比（vs AirPods Max、Bose QC Ultra）
* 没有 JSON-LD 结构化数据
* 缺少 FAQ

**旁白**：
> 这是一个卖得很好的耳机，但在 AI 搜索中，当用户问 "best noise cancelling headphones for commuting" 时，它不会被推荐。为什么？因为 AI 理解不了它的核心卖点。

### 第二幕：解决 (2 分钟)
**展示**：点击 **"AI Commerce Ready"** 按钮，AgentShelf 自动执行以下操作：

**Step 1 - ChatGPT Commercial Readiness**:
* 生成 Commercial Intent Map：命中 "best noise cancelling headphones under $200 for commuting"
* 生成 Sponsored Message Preview
* 生成 Ad-safe Product Summary
* 标注 Risk Warning

**Step 2 - Google AI Mode Readiness**:
* 生成 Merchant Center Feed Patch（补齐 GTIN、品牌、品类等）
* 生成 JSON-LD Product Schema
* 补充 Shipping / Return Policy

**Step 3 - GEO Fix**:
* 优化商品标题
* 生成结构化 FAQ
* 生成竞品对比表
* 优化商品描述

**旁白**：
> AgentShelf 在 30 秒内完成了过去需要一个电商团队几天才能做的事：分析商品在 AI 渠道中的缺失信号，生成优化内容，并准备发布。

### 第三幕：效果 (30 秒)
**展示**：Dashboard 右侧弹出 **SEO vs GEO Before/After 对比面板**：

| 指标 | Before (SEO) | After (GEO) | 变化 |
| --- | --- | --- | --- |
| GEO Readiness Score | 64 | 88 | +37% |
| AI 渠道覆盖 | Google only | ChatGPT + Google AI | 2x |
| 预估月流量提升 | - | +45% | ↑ |
| 预估转化率 | 2.1% | 5.2% | +147% |
| Channel Status | Not Ready | Pilot Ready | ✓ |

**旁白**：
> 优化后，这个耳机在 ChatGPT 和 Google AI 搜索中都变得可推荐了。预估月流量提升 45%，转化率从 2.1% 提升到 5.2%。这就是 GEO 的力量。

## 8. 参考资料 (References)
* [Advertise in ChatGPT | OpenAI Ads](https://ads.openai.com/?utm_source=chatgpt.com)
* [New ways AI in Search helps your business (Google Blog)](https://blog.google/products/ads-commerce/google-search-ai-brand-discovery/?utm_source=chatgpt.com)
* [Product data specification (Google Merchant Center Help)](https://support.google.com/merchants/answer/7052112?hl=en&utm_source=chatgpt.com)
* [Intro to Product Structured Data on Google](https://developers.google.com/search/docs/appearance/structured-data/product?utm_source=chatgpt.com)
* [Perplexity testing ads / pausing ads (Search Engine Land)](https://searchengineland.com/perplexity-begins-testing-ads-448277?utm_source=chatgpt.com)
