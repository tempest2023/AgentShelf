# AgentShelf 产品设计文档

团队：Commerce Alchemists
Hackathon：Generative UI Hackathon w/ Google and CopilotKit
版本：Hackathon MVP / 仅用于项目视频 Demo

---

## 1. 产品概述

**AgentShelf** 是一个面向 AI Commerce 的 **GEO Readiness Console**。

随着商品发现方式从传统搜索引擎转向 ChatGPT、Perplexity、Google AI Mode 和购物 Agent，电商品牌需要一种新的方式，让自己的商品能够被 AI Agent 理解、比较、推荐和购买。

AgentShelf 帮助商家审查商品目录，识别缺失的商品信号，模拟 AI Agent 可能如何理解商品，并生成结构化优化方案，例如优化后的商品描述、FAQ、对比表和 JSON-LD 商品结构化数据。

本次 Hackathon 不需要接入真实 Shopify 或广告平台。目标是使用 Mock 商品数据和 AI 生成式 UI，打造一个有说服力的交互式产品 Demo。

---

## 2. 核心 Demo 信息

传统 SEO 关注的是：

> Google 能不能找到我的商品页面？

AgentShelf 关注的是：

> AI Agent 能不能理解、比较、推荐并购买我的商品？

核心产品理念：

> AgentShelf 把混乱的商品页面转化为 Agent-ready 的电商界面。

---

## 3. 目标用户

### 主要用户

中小型电商品牌，尤其是 Shopify / DTC 商家。

### 初始垂直领域

**美妆 / 护肤电商**

选择原因：

* 商品属性复杂。
* 用户会用自然语言提出购买问题。
* AI 推荐行为对转化很重要。
* 商品页面经常缺少结构化数据。
* Demo UI 可以做得清晰、美观、有商业感。

示例商家：

> 一个销售防晒、保湿霜、洁面和祛痘友好型产品的护肤品牌。

---

## 4. 用户问题

电商商家现在主要在优化 SEO，但 AI Shopping 正在改变商品发现方式。

用户可能会问：

> 适合油皮、痘肌、30 美元以下的轻薄防晒有哪些？

AI Assistant 需要理解结构化信号：

* 这个商品适合谁？
* 它解决什么问题？
* 它适合什么肤质？
* 它包含哪些成分？
* 它和竞品有什么区别？
* 它是否适合敏感肌或痘肌？
* 有哪些评价或信任信号支持它？
* 价格、配送、退货政策是否清楚？

大多数商品页面是写给人看的，而不是写给 AI Agent 看的。

AgentShelf 帮助品牌识别并修复这个差距。

---

## 5. Hackathon MVP 范围

这个 MVP 是为短视频 Demo 设计的，不是生产级部署。

### 包含范围

1. Mock Shopify 商品目录
2. 商品 GEO Readiness Dashboard
3. AI Discoverability Score
4. 缺失商品信号检测
5. AI Shopping Query Simulator
6. Agent Preview Panel
7. 一键 GEO Fix
8. 可编辑的商品优化建议
9. Mock Publish / Apply Action

### 不包含范围

1. 真实 Shopify API 接入
2. 真实 ChatGPT / Perplexity 排名数据
3. 真实广告活动创建
4. 真实商品发布
5. 真实竞品爬取
6. 真实支付或结账集成
7. 完整用户登录认证
8. 生产级数据分析

---

## 6. 推荐 Hackathon 技术栈

### 前端

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**

### Generative UI / Agentic UI

* **CopilotKit**

  * Copilot Sidebar
  * Agent Actions
  * Dynamic UI Updates
  * Human-in-the-loop Interaction

### AI 模型

* **Google Gemini** 或 **OpenAI**

  * 商品分析
  * 用户 Query 模拟
  * GEO 优化建议
  * 商品文案生成

为了 Hackathon 的可行性，Gemini 或 OpenAI 都可以。如果需要强调赞助商工具，优先使用 Gemini 和 CopilotKit。

### Workflow Layer

* **LangChain**

  * 可选，但适合组织 Agent Workflow
  * 如果时间紧，可以轻量 Mock

### MCP / Tool Layer

* **MCP-style Mock Commerce Tools**

  * MVP 阶段不一定需要真实 MCP Server
  * 可以用 backend API routes 或本地 mock tools 表示

---

## 7. 高层架构

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

## 8. 主要用户流程

### Step 1：商家打开 AgentShelf

Landing 页面展示：

* 产品名：**AgentShelf**
* Tagline：**Make every product agent-ready**
* 简短说明：
  “Audit your catalog for AI shopping readiness and generate GEO fixes instantly.”

用户点击：

> Start GEO Audit

---

### Step 2：选择或上传商品目录

Demo 使用 Mock Catalog：

1. Skincare Starter Catalog
2. Fashion Catalog
3. Home Goods Catalog

推荐 Demo Catalog：

> Skincare Starter Catalog

Mock 商品：

* ClearGlow Mineral Sunscreen SPF 30
* HydraBarrier Gel Moisturizer
* CalmPore Gentle Cleanser
* NightRepair Retinol Serum

用户选择：

> Skincare Starter Catalog

---

### Step 3：AI 生成 GEO Readiness Dashboard

Dashboard 展示 catalog-level scores：

| Metric                | Example Score |
| --------------------- | ------------: |
| AI Discoverability    |            72 |
| Product Clarity       |            68 |
| Comparison Readiness  |            54 |
| Trust Signal Strength |            61 |
| Query Intent Coverage |            58 |
| Schema Completeness   |            46 |

主要洞察：

> Your catalog is partially readable by AI agents, but missing comparison attributes, structured FAQs, and clear use-case targeting.

中文意思：

> 你的商品目录已经可以被 AI Agent 部分理解，但缺少可比较属性、结构化 FAQ 和明确的使用场景定位。

---

### Step 4：商品卡片

每个商品以交互式卡片展示。

示例卡片：

**ClearGlow Mineral Sunscreen SPF 30**

* Price: $24
* Category: Sunscreen
* Target customer: oily / acne-prone skin
* Current AI readiness score: 64 / 100
* Status: Needs optimization

检测到的问题：

* 缺少明确的 “non-comedogenic” 说明
* 没有面向痘肌用户的 FAQ
* 没有和化学防晒的对比
* 没有 JSON-LD 商品结构化数据
* Review summary 较弱
* 没有清楚描述产品质地

操作按钮：

* Generate GEO Fix
* Preview AI Agent Answer
* Generate FAQ
* Generate Schema
* Mark as Ready

---

### Step 5：AI Shopping Query Simulator

用户输入自然语言 Query：

> Best lightweight sunscreen under $30 for oily acne-prone skin

AgentShelf 模拟 AI Shopping Agent 可能如何理解商品目录。

输出 UI：

**Query Match Result**

| Product                            | Match | Reason                                                          |
| ---------------------------------- | ----: | --------------------------------------------------------------- |
| ClearGlow Mineral Sunscreen SPF 30 |   84% | Good price, sunscreen category, but acne-safe signal is unclear |
| HydraBarrier Gel Moisturizer       |   32% | Good for oily skin, but not sunscreen                           |
| CalmPore Gentle Cleanser           |   18% | Acne-related but not sunscreen                                  |

AI Agent Preview：

> ClearGlow may be considered, but the product page does not clearly state whether it is non-comedogenic, lightweight, or suitable for acne-prone skin. A competing product with clearer claims may be recommended first.

中文意思：

> ClearGlow 可能会被 AI 考虑推荐，但商品页面没有清楚说明它是否不致痘、是否轻薄、是否适合痘肌。相比之下，拥有更清晰商品信号的竞品可能会被优先推荐。

这是 Demo 里的关键时刻。

它展示了一个核心问题：
商品本身可能不错，但如果页面缺少结构化信号，AI Agent 可能不会优先推荐它。

---

### Step 6：一键 GEO Fix

用户点击：

> Generate GEO Fix

AgentShelf 生成一个可交互、可编辑的优化面板：

### Optimized Title

当前标题：

> ClearGlow Mineral Sunscreen SPF 30

建议标题：

> ClearGlow Lightweight Mineral Sunscreen SPF 30 for Oily & Acne-Prone Skin

### Optimized Description

生成文案需要强调：

* 轻薄质地
* 矿物防晒
* 适合油皮
* 不油腻
* 30 美元以下
* 日常使用
* 对敏感肌的考虑

### Generated FAQ

示例：

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

UI 展示一个结构化商品 Schema Preview，不需要完全生产可用。

操作按钮：

* Apply Fix
* Edit Copy
* Regenerate
* Export JSON
* Mock Publish

---

## 9. 核心页面

### Screen 1：Landing / Intro

目的：

快速解释产品。

组件：

* Hero headline
* Demo catalog selector
* Start audit button
* 简短价值主张卡片

建议 headline：

> Make your products readable, comparable, and recommendable by AI agents.

建议 subheading：

> AgentShelf audits your e-commerce catalog for GEO readiness and generates structured fixes for the next era of AI shopping.

---

### Screen 2：GEO Readiness Dashboard

目的：

立刻展示产品核心价值。

组件：

* Catalog score
* Score breakdown
* Product list
* Missing signal summary
* AI assistant sidebar

重要视觉元素：

* Score cards
* Progress bars
* Product readiness badges
* Warning cards
* “Generate Fix” buttons

---

### Screen 3：Product Detail Panel

目的：

展示单个商品的诊断结果。

组件：

* Product card
* Current product data
* Missing attributes
* AI readability analysis
* Query matches
* Suggested improvements

---

### Screen 4：AI Shopping Preview

目的：

展示 AI Agent 可能如何理解商品。

组件：

* User query input
* Simulated AI recommendation
* Ranking likelihood
* Reasoning panel
* Missing signal explanation

这个页面对视频 Demo 很重要，因为它可以清楚解释 SEO → GEO 的转变。

---

### Screen 5：GEO Fix Workspace

目的：

展示 Generative UI 的核心能力。

组件：

* Editable optimized title
* Editable product description
* FAQ generator
* Comparison table
* JSON-LD schema preview
* Apply changes button

---

## 10. Mock Data 设计

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

这些可以实现为简单的 TypeScript 函数或 API routes。

### getProductCatalog()

返回 Mock 护肤商品目录。

```ts
getProductCatalog("skincare-demo")
```

### auditProductReadiness(product)

返回商品分数和缺失信号。

```ts
auditProductReadiness(product)
```

### simulateShoppingQuery(query, catalog)

返回 AI Shopping Match Result。

```ts
simulateShoppingQuery(
  "Best lightweight sunscreen under $30 for oily acne-prone skin",
  catalog
)
```

### generateGeoFixes(product, queryContext)

返回优化后的标题、描述、FAQ、对比表和 Schema。

```ts
generateGeoFixes(product, queryContext)
```

### applyMockPatch(productId, patch)

只更新本地 UI state。

```ts
applyMockPatch(productId, patch)
```

---

## 12. CopilotKit 使用方式

CopilotKit 应该让项目看起来像一个 Agentic Product，而不是普通 Dashboard。

### 建议的 Copilot Actions

1. **Audit catalog**

   * 用户：“Audit my skincare catalog for ChatGPT shopping readiness.”
   * Agent 更新 Dashboard。

2. **Simulate shopping query**

   * 用户：“Would this product be recommended for oily acne-prone skin?”
   * Agent 更新 AI Shopping Preview Panel。

3. **Generate GEO fixes**

   * 用户：“Improve this product for AI shopping agents.”
   * Agent 打开 GEO Fix Workspace。

4. **Apply changes**

   * 用户批准生成文案。
   * Agent 更新商品卡片状态。

### Copilot Sidebar Prompt 示例

* “Audit my catalog.”
* “Find products with weak AI readiness.”
* “Simulate a ChatGPT shopping query.”
* “Generate FAQ for this product.”
* “Create JSON-LD schema.”
* “Make this product more recommendable for acne-prone users.”

---

## 13. Generative UI 要求

Demo 必须清楚展示：AI 不只是返回文字。

AI 应该生成或更新：

* Score cards
* Product cards
* Missing signal checklists
* Query match tables
* FAQ blocks
* Comparison tables
* Schema preview panels
* Editable recommendation cards

错误示范：

> AI 说：“你应该添加 FAQ 和更好的描述。”

正确示范：

> AI 创建一个可编辑的商品优化工作台，其中包含标题、描述、FAQ、对比表、Schema 和 Apply buttons。

---

## 14. UI 风格方向

### 视觉风格

* 干净的 SaaS Dashboard
* 现代 AI 产品感
* 白色背景
* 柔和卡片
* 圆角
* 细边框
* 清晰的评分可视化
* 电商商品卡片感

### 建议布局

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

### 颜色概念

不需要复杂。

建议语义化使用：

* Green：ready / strong signal
* Yellow：needs improvement
* Red：missing / weak signal
* Blue or purple：AI-generated recommendation

---

## 15. 项目视频 Demo 脚本

### Scene 1：问题

旁白：

> Search is changing. Customers are no longer just typing keywords into Google. They are asking AI agents what to buy. But most e-commerce product pages are not ready for AI shopping.

中文意思：

> 搜索正在改变。用户不再只是去 Google 输入关键词，而是直接向 AI Agent 询问该买什么。但大多数电商商品页面并没有为 AI Shopping 做好准备。

展示：

* AgentShelf Landing Page
* 选择 Skincare Catalog

---

### Scene 2：Catalog Audit

用户操作：

点击：

> Start GEO Audit

旁白：

> AgentShelf audits a product catalog for AI discoverability, clarity, comparison readiness, trust signals, and schema completeness.

中文意思：

> AgentShelf 会从 AI 可发现性、商品清晰度、可比较性、信任信号和 Schema 完整度等维度审查商品目录。

展示：

* Dashboard scores 出现
* Product cards 出现
* Missing signals 被高亮

---

### Scene 3：AI Shopping Query

用户输入：

> Best lightweight sunscreen under $30 for oily acne-prone skin

旁白：

> Instead of guessing SEO keywords, AgentShelf simulates how an AI shopping agent may evaluate the catalog for a real customer question.

中文意思：

> AgentShelf 不只是猜测 SEO 关键词，而是模拟 AI Shopping Agent 如何针对真实用户问题评估商品目录。

展示：

* ClearGlow 获得部分匹配
* Missing signals 解释为什么它可能不会排在第一

---

### Scene 4：Generate GEO Fix

用户点击：

> Generate GEO Fix

旁白：

> AgentShelf turns AI analysis into an interactive workspace. It generates an optimized title, description, FAQs, comparison table, and structured schema.

中文意思：

> AgentShelf 把 AI 分析转化为一个可交互的工作台，生成优化后的标题、描述、FAQ、对比表和结构化 Schema。

展示：

* Editable title
* FAQ cards
* Comparison table
* JSON-LD preview

---

### Scene 5：Apply Fix

用户点击：

> Apply Fix

旁白：

> The merchant can review, edit, and apply the improvements. AgentShelf helps brands move from SEO to GEO: from ranking on search engines to being recommended by AI agents.

中文意思：

> 商家可以审查、编辑并应用这些优化。AgentShelf 帮助品牌从 SEO 走向 GEO：从在搜索引擎中排名，走向被 AI Agent 推荐。

展示：

* Product score 从 64 提升到 88
* Status 变成 “Agent-ready”

---

## 16. Hackathon Demo 成功标准

如果视频能清楚表达以下内容，项目就是成功的：

1. AgentShelf 是什么
2. 为什么 GEO 对电商重要
3. AI 输出如何变成交互式 UI
4. 商家如何基于 AI 输出采取行动
5. 赞助商工具如何融入架构

最小可工作 Demo：

* 一个 Mock Catalog
* 一个 Dashboard
* 一个 Query Simulator
* 一个 Product Fix Flow
* 一个 CopilotKit Agent Interaction

---

## 17. Product Tagline 选项

推荐：

> Make every product agent-ready.

其他选项：

> From SEO to GEO for AI commerce.

> Help AI agents understand and recommend your products.

> Turn product pages into AI-readable shopping signals.

> The GEO console for the next era of e-commerce discovery.

---

## 18. 最终 Hackathon 定位

**AgentShelf 不是一个普通 SEO 工具。**

它是一个新类别：

> GEO Readiness Console for AI Commerce

它帮助商家回答：

* AI Agent 能理解我的商品吗？
* AI Agent 能正确比较我的商品吗？
* AI Agent 能在正确的用户意图下推荐我的商品吗？
* 我的商品页面缺少哪些信号？
* 我应该修改什么，才能让商品变得 Agent-ready？

对于本次 Hackathon，产品应重点关注一个精致、有说服力的工作流，而不是复杂后端集成。

最强 Demo 是：

> 商家提出一个自然语言问题，AgentShelf 生成一个完整的、可交互的电商商品优化工作台。
