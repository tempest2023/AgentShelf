## AgentShelf 的技术组合

**CopilotKit + Gemini + LangChain + MCP mock tools**

### 1. CopilotKit：前端核心

用 CopilotKit 做 AgentShelf 的交互式前端：

* AI Chat / Copilot sidebar
* 生成 GEO Readiness Dashboard
* 动态渲染 Product Cards
* 用户点击 “Fix Description / Generate FAQ / Generate Schema”
* Agent 根据用户操作更新 UI

### 2. Gemini：分析商品目录

用 Gemini 做核心 AI reasoning：

* 读取 Shopify product JSON
* 评估商品是否容易被 AI 推荐
* 识别缺失字段
* 生成 customer query intents
* 生成优化后的 description / FAQ / comparison table

### 3. LangChain：组织 workflow

用 LangChain 管理整个流程：

```text
Catalog Input
→ Product Audit Agent
→ Missing Signal Detector
→ AI Shopping Query Simulator
→ GEO Fix Generator
→ Structured Schema Generator
→ UI State Update
```

### 4. Manufact MCP：做成可被 agent 调用的 commerce tools

可以设计几个 MCP-style tools：

```text
get_product_catalog()
audit_product_readiness(product)
generate_geo_faq(product)
generate_product_schema(product)
simulate_ai_shopping_query(product, query)
publish_shopify_patch(product_id, patch)
```

### 5. Daytona

Daytona 可以用来跑安全的 batch audit：

* 验证 JSON-LD schema 是否合法
* 批量检查 product catalog
* 生成 downloadable audit report

## MVP 架构

```text
React / Next.js frontend
        ↓
CopilotKit AG-UI layer
        ↓
LangChain Agent
        ↓
Gemini model
        ↓
MCP-style tools:
  - Shopify catalog mock
  - GEO audit tool
  - FAQ generator
  - schema generator
  - AI shopping preview simulator
```

## Demo 里可以明确说

> AgentShelf uses CopilotKit’s agentic frontend stack to turn AI analysis into interactive commerce UI, Gemini for product-readiness reasoning, LangChain for multi-step agent orchestration, and MCP-style tools for catalog auditing, schema generation, and Shopify patch simulation.
