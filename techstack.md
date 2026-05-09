## AgentShelf Tech Stack

**CopilotKit + OpenAI + LangChain + Daytona**

### 1. CopilotKit: Frontend Core

Using CopilotKit for AgentShelf's interactive frontend:

* AI Chat / Copilot sidebar
* Generating GEO Readiness Dashboard
* Dynamically rendering Product Cards
* User clicks on "Fix Description / Generate FAQ / Generate Schema"
* Agent updates the UI based on user actions
* SEO vs GEO Before/After comparison panel

#### Simple Integration Example

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

### 2. OpenAI API: Core AI Engine

Using OpenAI API as the core AI reasoning engine (primary model: GPT-5.5):

* Reading Shopify product JSON
* Evaluating whether products are easily recommended by AI
* Identifying missing fields
* Generating customer query intents
* Generating optimized descriptions / FAQs / comparison tables
* Generating SEO vs GEO comparison data
* Supports Google Gemini model API integration (optional alternative)

#### Simple Integration Example

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

### 3. LangChain: Agent Workflow Orchestration

Using LangChain to manage the entire Agent workflow:

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

#### Simple Integration Example

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

### 4. Daytona: Sandbox Execution Environment

Daytona is used for secure execution of AI-generated code and batch tasks:

* Validating if JSON-LD schemas are legal
* Batch checking the product catalog
* Generating downloadable audit reports
* Securely executing AI-generated optimization code

#### Simple Integration Example

Install the CLI tool:

```bash
brew install daytonaio/cli/daytona # macOS/Linux
# OR
powershell -Command "irm https://get.daytona.io/windows | iex" # Windows
```

Basic workflow:

```bash
# Login and authenticate
daytona login

# Initialize in the project directory
daytona init

# Launch the sandbox environment
daytona up
```

### 5. Google Gemini API (Optional)

After OpenAI integration is complete, Google Gemini model API can be quickly integrated:

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

## MVP Architecture

```text
React / Next.js frontend (Tailwind UI)
        ↓
CopilotKit Agentic UI Layer
        ↓
LangChain Agent (Controller / API Route)
        ↓
OpenAI GPT-5.5 (Primary) / Gemini (Optional)
        ↓
Daytona Sandbox (Schema Validation / Batch Audit)
        ↓
Core Tools:
  - get_product_catalog() → Mock Shopify catalog (Electronics/Outdoor/Pet/Supplements)
  - audit_product_readiness() → GEO readiness scoring
  - generate_geo_faq() → FAQ generation
  - generate_product_schema() → JSON-LD generation
  - simulate_ai_shopping_query() → AI shopping query simulation
  - generate_seo_geo_comparison() → SEO vs GEO comparison data
  - apply_mock_patch() → Mock Shopify update
```

## Demo Script Highlights

> AgentShelf uses CopilotKit's agentic frontend stack to turn AI analysis into interactive commerce UI, OpenAI GPT-5.5 for product-readiness reasoning, LangChain for multi-step agent orchestration, and Daytona for secure schema validation and batch auditing. The platform helps merchants optimize their product data for ChatGPT Ads and Google AI Mode, turning traditional SEO into GEO — Generative Engine Optimization.
