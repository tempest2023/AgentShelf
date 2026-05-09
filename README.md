# AgentShelf

**AI Commerce Channel Manager** -- Help e-commerce brands make their products understandable, comparable, and recommendable in ChatGPT, Google AI Mode, Perplexity, and future AI Shopping Agents.

## What is AgentShelf?

AgentShelf is an AI Commerce Readiness and Channel Management Console. It helps e-commerce brands transition from traditional SEO to **GEO (Generative Engine Optimization)**, enabling their products to be correctly understood and recommended by AI-powered shopping engines.

### The Problem

Traditional e-commerce growth relies on SEO + Google Ads + Meta Ads. But traffic is shifting to AI channels:

- **OpenAI** is testing ChatGPT ads during user exploration and decision-making
- **Google** is deeply integrating AI Search with commerce via Merchant Center
- **Perplexity** is growing rapidly as an answer engine with commercial partnerships

Merchants don't know how to make their products discoverable in these AI channels. AgentShelf solves this.

### Core Features

**GEO Readiness Dashboard** -- Analyze product readiness for AI commerce with readiness scores, missing signal detection, AI shopping query simulation, and automated GEO fix recommendations.

**AI Commerce Channels** -- Channel-specific readiness for ChatGPT Commercial Readiness (intent mapping, sponsored messages, risk warnings) and Google AI Mode / Merchant Center (checklist, feed patch, JSON-LD). Perplexity, Claude, and Gemini shown as coming soon.

**Commercial Launch Pack** -- SEO vs GEO before/after comparison panel, generated JSON-LD schema, structured FAQ, commercial intent mapping, and a launch checklist with mock Shopify publish.

### Demo Flow

1. Select a product from the catalog (4 categories, 39 products)
2. Review its GEO readiness score and missing signals
3. Simulate AI shopping queries to see recommendation gaps
4. Explore channel-specific readiness for ChatGPT and Google AI Mode
5. View the SEO vs GEO comparison to see projected traffic and conversion improvements

## Team

**Commerce Alchemists**

- **Tempest** -- Full-stack Development

## Project Structure

```
AgentShelf/
├── frontend/           # Next.js application (all code lives here)
│   ├── app/            # Next.js App Router
│   ├── components/     # React components
│   ├── lib/            # Types and mock data
│   └── TESTING.md      # Testing and mock data guide
├── product_design.md   # Product requirements document
├── techstack.md        # Technical architecture document
└── HandBook.md         # Hackathon handbook
```

## Quick Start

```bash
cd frontend
bun install
bun dev
```

Open http://localhost:3000. See [frontend/TESTING.md](frontend/TESTING.md) for the full testing guide.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Icons | Lucide React |
| Language | TypeScript |
| Package Manager | bun |
| AI Engine | Mock data (designed for OpenAI GPT integration) |
| Workflow | Mock data (designed for LangChain agent orchestration) |

## License

MIT
