## AgentShelf 的技术组合

**CopilotKit + OpenAI + LangChain + Daytona**

### 1. CopilotKit：前端核心

用 CopilotKit 做 AgentShelf 的交互式前端：

* AI Chat / Copilot sidebar
* 生成 GEO Readiness Dashboard
* 动态渲染 Product Cards
* 用户点击 "Fix Description / Generate FAQ / Generate Schema"
* Agent 根据用户操作更新 UI
* SEO vs GEO Before/After 对比面板

#### 简单接入示例

```bash
npm install @copilotkit/react-core @copilotkit/react-ui
```

```tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <YourApp />
      <CopilotSidebar />
    </CopilotKit>
  );
}
```

### 2. OpenAI API：核心 AI 引擎

使用 OpenAI API 作为核心 AI reasoning 引擎（主模型：GPT-5.5）：

* 读取 Shopify product JSON
* 评估商品是否容易被 AI 推荐
* 识别缺失字段
* 生成 customer query intents
* 生成优化后的 description / FAQ / comparison table
* 生成 SEO vs GEO 对比数据
* 支持接入 Google Gemini 模型 API（可选切换）

#### 简单接入示例

```bash
npm install openai dotenv
```

```javascript
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Analyze this product for AI commerce readiness..." }],
    model: "gpt-5.5",
  });
  console.log(completion.choices[0].message.content);
}
main();
```

### 3. LangChain：Agent 工作流编排

用 LangChain 管理整个 Agent 工作流：

```text
Catalog Input
→ Product Audit Agent
→ Missing Signal Detector
→ AI Shopping Query Simulator
→ GEO Fix Generator
→ Structured Schema Generator
→ SEO vs GEO Comparison Generator
→ UI State Update
```

#### 简单接入示例

```bash
npm install langchain @langchain/openai
```

```javascript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-5.5",
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await model.invoke("Analyze product readiness for AI commerce channels...");
console.log(response.content);
```

### 4. Daytona：沙箱执行环境

Daytona 用于安全执行 AI 生成的代码和批量任务：

* 验证 JSON-LD schema 是否合法
* 批量检查 product catalog
* 生成 downloadable audit report
* 安全执行 AI 生成的优化代码

#### 简单接入示例

安装 CLI 工具：

```bash
brew install daytonaio/cli/daytona # macOS/Linux
# 或者
powershell -Command "irm https://get.daytona.io/windows | iex" # Windows
```

基础工作流：

```bash
# 登录认证
daytona login

# 在项目目录下初始化
daytona init

# 启动沙箱环境
daytona up
```

### 5. Google Gemini API（可选）

在 OpenAI 接入完成后，可快速接入 Google Gemini 模型 API：

```bash
npm install @google/generative-ai
```

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const result = await model.generateContent("Analyze product readiness...");
console.log(result.response.text());
```

## MVP 架构

```text
React / Next.js frontend (Tailwind UI)
        ↓
CopilotKit Agentic UI Layer
        ↓
LangChain Agent (Controller / API Route)
        ↓
OpenAI GPT-5.5 (主模型) / Gemini (可选)
        ↓
Daytona Sandbox (Schema Validation / Batch Audit)
        ↓
Core Tools:
  - get_product_catalog() → Mock Shopify catalog (电子产品/户外/宠物/保健品)
  - audit_product_readiness() → GEO readiness 评分
  - generate_geo_faq() → FAQ 生成
  - generate_product_schema() → JSON-LD 生成
  - simulate_ai_shopping_query() → AI 购物查询模拟
  - generate_seo_geo_comparison() → SEO vs GEO 对比数据
  - apply_mock_patch() → Mock Shopify 更新
```

## Demo 里可以明确说

> AgentShelf uses CopilotKit's agentic frontend stack to turn AI analysis into interactive commerce UI, OpenAI GPT-5.5 for product-readiness reasoning, LangChain for multi-step agent orchestration, and Daytona for secure schema validation and batch auditing. The platform helps merchants optimize their product data for ChatGPT Ads and Google AI Mode, turning traditional SEO into GEO — Generative Engine Optimization.
