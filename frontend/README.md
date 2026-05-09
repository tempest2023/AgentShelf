# AgentShelf Frontend

Next.js application for the AI Commerce Channel Manager. All product logic, UI, and mock data live in this directory.

## Getting Started

### Prerequisites

- [bun](https://bun.sh/) (recommended) or Node.js 18+

### Install & Run

```bash
bun install
bun dev
```

The app starts at http://localhost:3000.

### Build

```bash
bun run build
bun start
```

### Lint

```bash
bun run lint
```

## App Architecture

```
app/
├── layout.tsx          # Root layout (Inter font, dark theme)
├── page.tsx            # Entry → renders AppShell
└── globals.css         # Tailwind + custom animations

components/
├── AppShell.tsx        # Top-level state: active tab, selected product
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
├── types.ts            # All TypeScript interfaces
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

All data is static mock data -- no API calls, no backend. The flow:

```
User selects product (Sidebar)
  → AppShell updates selectedProduct state
    → Tab component receives product prop
      → Calls mock data functions (getAuditForProduct, etc.)
        → Renders UI with mock results
```

Mock data functions in `lib/mock/` return specific data for featured products and auto-generated defaults for the rest.

## Key Design Decisions

**Client components**: All interactive components use `"use client"` since they manage local state (tab switching, product selection, expandable sections). The root `layout.tsx` and `page.tsx` remain server components.

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
