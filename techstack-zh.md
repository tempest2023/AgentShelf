## AgentShelf 的技术组合

**CopilotKit + Gemini + LangChain + MCP mock tools**

### 1. CopilotKit：前端核心

用 CopilotKit 做 AgentShelf 的交互式前端：

* AI Chat / Copilot sidebar
* 生成 GEO Readiness Dashboard
* 动态渲染 Product Cards
* 用户点击 “Fix Description / Generate FAQ / Generate Schema”
* Agent 根据用户操作更新 UI

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

### 2. OpenAI API 分析商品目录

用 OpenAI API 做核心 AI reasoning：

* 读取 Shopify product JSON
* 评估商品是否容易被 AI 推荐
* 识别缺失字段
* 生成 customer query intents
* 生成优化后的 description / FAQ / comparison table

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
    messages: [{ role: "user", content: "Explain Node.js in one sentence." }],
    model: "gpt-4o",
  });
  console.log(completion.choices[0].message.content);
}
main();
```

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

#### 简单接入示例

```bash
npm install langchain @langchain/openai
```

```javascript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o",
  apiKey: process.env.OPENAI_API_KEY, 
});

const response = await model.invoke("Hello, how are you?");
console.log(response.content);
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

#### 简单接入示例

使用 `@modelcontextprotocol/sdk` 快速构建 MCP Server：

```bash
npm install @modelcontextprotocol/sdk zod
```

```typescript
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";

const server = new McpServer({
  name: "commerce-tools",
  version: "1.0.0",
});

server.registerTool(
  "get_product_catalog",
  "获取商品目录",
  {},
  async () => ({
    content: [{ type: "text", text: "Product JSON data..." }],
  })
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch(console.error);
```

### 5. Daytona

Daytona 可以用来跑安全的 batch audit：

* 验证 JSON-LD schema 是否合法
* 批量检查 product catalog
* 生成 downloadable audit report

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
