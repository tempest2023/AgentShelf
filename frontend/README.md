# AgentShelf Frontend

Next.js application for the AI Commerce Channel Manager. Product UI, live AI routes, workspace persistence, and fallback mock data all live in this directory.

## Getting Started

### Prerequisites

- Node.js 18+ or [bun](https://bun.sh/)

### Install & Run

```bash
npm install
npm run dev
```

The app starts at http://localhost:3000.

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Live AI + Fallback

The GEO audit and query simulator now support a production-style execution path:

- If `OPENAI_API_KEY` is present, `/api/geo/audit` and `/api/geo/simulate` return live AI-generated results.
- If the key is missing, the endpoints return deterministic fallback data with an `unavailable` status.
- If the live request fails, the endpoints return fallback data with a `fallback` status and surface the failure reason.

The UI shows the current state as `live`, `fallback`, or `unavailable` so demos and debugging stay explicit instead of silent.

## Workspace Persistence

AgentShelf now stores workspace state in browser storage:

- imported products
- audit runs
- query runs
- exported launch assets
- activation analytics events

The app reads workspace products first and only falls back to the seeded demo catalog when a store has not imported products yet.

## Daytona Sandbox Demo

The GEO Agent sidebar can now simulate the "agent generates raw code -> Daytona executes it -> dashboard inserts the returned UI node" flow.

Configure these environment variables to enable real Daytona execution in the Copilot route handlers:

```bash
DAYTONA_API_KEY=your_daytona_api_key
# Optional:
DAYTONA_API_URL=https://app.daytona.io/api
DAYTONA_TARGET=us
```

Behavior:

- If `DAYTONA_API_KEY` is present, the server sends generated TypeScript raw code to a Daytona sandbox and renders the returned HTML view inside the GEO generated panel.
- If `DAYTONA_API_KEY` is missing, the same UI flow stays interactive but clearly falls back to a local mock renderer.

## App Architecture

```
app/
├── layout.tsx          # Root layout (Inter font, dark theme)
├── page.tsx            # Entry → renders AppShell
└── globals.css         # Tailwind + custom animations

components/
├── AppShell.tsx        # Top-level state: active tab, selected product, workspace catalog
├── Header.tsx          # Sticky header with 3-tab navigation
├── Sidebar.tsx         # Collapsible sidebar: category filter + product list
├── ScoreRing.tsx       # SVG circular score with fill animation
├── Card.tsx            # Reusable card container
├── Badge.tsx           # Status badge (success/warning/danger/info)
└── tabs/
    ├── GEOTab.tsx      # GEO Readiness Dashboard
    ├── ChannelsTab.tsx # AI Commerce Channels
    └── LaunchTab.tsx   # Commercial Launch Pack

lib/
├── types.ts            # Shared product and AI response interfaces
├── workspace/          # Persistent workspace store + CSV parsing
└── mock/
    ├── index.ts        # Re-exports
    ├── products.ts     # 39 products across 4 categories
    ├── audits.ts       # GEO audit results + fix suggestions
    ├── channels.ts     # ChatGPT packs + Google AI checklists
    ├── comparisons.ts  # SEO vs GEO comparison data
    ├── queries.ts      # Query simulation results
    └── checklist.ts    # Launch checklist items
```

## Data Flow

The application now layers imported workspace data on top of the seeded demo catalog:

```
User logs into a store
  → Workspace store resolves imported products (or seeded fallback products)
    → GEO tab calls live AI endpoints
      → Result is persisted as an audit/query run
        → Launch Pack can export generated assets from the latest run
```

Mock data still exists in `lib/mock/`, but it is now an explicit fallback path instead of the only source of truth.

## Key Design Decisions

**Client components**: All interactive components use `"use client"` since they manage local state (tab switching, product selection, imports, expandable sections, and workspace persistence). The root `layout.tsx` and `page.tsx` remain server components.

**Path aliases**: `@/*` maps to the project root via `tsconfig.json` paths. Imports use `@/components/...`, `@/lib/...`.

**Styling**: Tailwind CSS v4 with CSS custom properties for the dark theme. No component library -- all UI is built with Tailwind utilities.

**Animations**: CSS keyframes for score ring fill (`score-ring`), fade-in-up transitions, and staggered children. No JS animation library.

## Customizing Mock Data

See [TESTING.md](TESTING.md) for detailed instructions on adding products, audit data, channel checklists, and query simulations.

Quick example -- add a product to `lib/mock/products.ts`:

```typescript
{
  id: "my-product",
  title: "My Product Name",
  category: "electronics",
  price: 99,
  description: "Product description",
  brand: "Brand",
}
```

Then optionally add specific data in `audits.ts`, `channels.ts`, and `comparisons.ts` keyed by the same `id`. Without specific data, the app generates randomized defaults.

## Tech Stack

| Dependency | Version | Purpose |
|---|---|---|
| next | 16.2.6 | Framework (App Router, Turbopack) |
| react | 19.2.4 | UI library |
| tailwindcss | 4.x | Utility-first CSS |
| lucide-react | latest | Icon library |
| typescript | 5.x | Type safety |
