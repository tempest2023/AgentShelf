# AgentShelf - Testing & Development Guide

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles (dark theme)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Entry point → AppShell
├── components/
│   ├── AppShell.tsx        # Main app shell with state management
│   ├── Header.tsx          # Top navigation bar with tab switching
│   ├── Sidebar.tsx         # Product catalog sidebar with category filter
│   ├── ScoreRing.tsx       # Animated circular score component
│   ├── Card.tsx            # Reusable card container
│   ├── Badge.tsx           # Status badge component
│   └── tabs/
│       ├── GEOTab.tsx      # Tab 1: GEO Readiness Dashboard
│       ├── ChannelsTab.tsx # Tab 2: AI Commerce Channels
│       └── LaunchTab.tsx   # Tab 3: Commercial Launch Pack
└── lib/
    ├── types.ts            # TypeScript type definitions
    └── mock/               # Mock data (all features use mock data)
        ├── index.ts        # Re-exports all mock data
        ├── products.ts     # Product catalog (4 categories, 39 products)
        ├── audits.ts       # GEO readiness audit results
        ├── channels.ts     # ChatGPT packs & Google AI checklists
        ├── comparisons.ts  # SEO vs GEO comparison data
        ├── queries.ts      # Query simulation results
        └── checklist.ts    # Launch checklist items
```

## Features to Test

### Tab 1: GEO Readiness Dashboard

1. **Score Visualization**: The main score ring should animate on load, showing the product's AI readiness score (0-100). Sub-scores for discoverability, clarity, and schema are shown as progress bars.

2. **Missing Signals**: A list of signals the product is missing for AI commerce readiness. Changes when you select a different product.

3. **Query Simulator**: Type a query like `"best noise cancelling headphones for commuting"` and click **Simulate**. The simulator shows:
   - An AI agent preview answer (how ChatGPT would respond)
   - Product match results with match scores
   - Missing signals for each match

4. **GEO Fixes**: Expandable cards showing recommended fixes for title, description, FAQ, comparison, and JSON-LD schema. Each shows the current value, suggested value, and reasoning.

### Tab 2: AI Commerce Channels

1. **ChatGPT Commercial Readiness**: Shows commercial intent map, sponsored message (with copy button), ad-safe summary, risk warnings, comparison claims, and required fixes.

2. **Google AI Mode / Merchant Center**: Displays a readiness checklist with pass/warn/fail items and a score ring. Includes a JSON feed patch viewer with copy button.

3. **Coming Soon Cards**: Perplexity, Claude, and Gemini shown as coming soon cards.

### Tab 3: Commercial Launch Pack

1. **SEO vs GEO Comparison**: Side-by-side comparison showing traffic, conversion rate, and CAC before (SEO) and after (GEO) optimization. Includes channel coverage comparison.

2. **JSON-LD Schema**: Click to expand and view the generated product schema. Copy button available.

3. **Structured FAQ**: Click to expand and view generated Q&A pairs. Copy button available.

4. **Launch Checklist**: Table showing all launch tasks with their status (Done, Needs Review, Missing).

5. **Mock Publish**: Click "Publish Now" to see a publishing animation followed by a success state.

### Sidebar

- **Category Filter**: Switch between Electronics, Outdoor & Sports, Pet Supplies, and Health & Supplements.
- **Product Selection**: Click any product to see its data across all tabs. The currently selected product is highlighted.

## Mock Data Guide

### How Mock Data Works

All data is static and lives in `lib/mock/`. No API calls are made. The mock data system provides:

- **Specific data** for featured products (MacBook Pro, AirPods Pro 2, hiking backpack, dog leash, fish oil)
- **Generated defaults** for all other products (randomized scores, generic fixes)

### Adding a New Product

Edit `lib/mock/products.ts` and add a new `Product` object:

```typescript
{
  id: "your-product-id",        // Unique identifier
  title: "Product Name",
  category: "electronics",       // electronics | outdoor | pets | health
  price: 99.99,
  description: "Product description",
  brand: "Brand Name",
  gtin: "1234567890123",         // Optional
  sku: "SKU-001",               // Optional
  targetAudience: ["audience1", "audience2"],
  attributes: { key: "value" },
  reviews: { rating: 4.5, count: 1000, summary: "Great product" },
  shippingPolicy: "Free shipping",
  returnPolicy: "30-day returns",
}
```

### Adding Specific Audit Data

Edit `lib/mock/audits.ts` and add an entry to `mockAudits`:

```typescript
"your-product-id": {
  productId: "your-product-id",
  aiReadinessScore: 72,
  discoverabilityScore: 68,
  clarityScore: 75,
  schemaScore: 60,
  missingSignals: ["Signal 1", "Signal 2"],
  recommendedFixes: [
    {
      type: "title",
      currentValue: "Current title",
      suggestedValue: "Better title with keywords",
      reasoning: "Why this change helps",
    },
    // ... more fixes
  ],
}
```

### Adding ChatGPT Pack Data

Edit `lib/mock/channels.ts` and add to `chatgptPacks`:

```typescript
"your-product-id": {
  productId: "your-product-id",
  primaryIntents: ["query 1", "query 2"],
  sponsoredMessage: "Ad copy text",
  adSafeSummary: "Safe summary",
  riskWarnings: ["Warning 1"],
  comparisonClaims: [{ competitor: "Competitor", claim: "Comparison" }],
  requiredFixes: ["Fix 1", "Fix 2"],
}
```

### Adding Google AI Mode Checklist

Edit `lib/mock/channels.ts` and add to `googleChecklists`:

```typescript
"your-product-id": {
  productId: "your-product-id",
  score: 66,
  items: [
    { label: "Check Item", status: "pass", detail: "Details" },
    { label: "Warning Item", status: "warn", detail: "Needs improvement" },
    { label: "Fail Item", status: "fail", detail: "Missing" },
  ],
  feedPatch: {
    title: "Optimized title",
    description: "Full description",
    // ... more fields
  },
}
```

### Adding SEO vs GEO Comparison

Edit `lib/mock/comparisons.ts` and add to `mockComparisons`:

```typescript
"your-product-id": {
  productId: "your-product-id",
  category: "electronics",
  seoMetrics: {
    estimatedMonthlyTraffic: 15000,
    conversionRate: 2.1,
    cac: 4.2,
    channelCoverage: "Google Search only",
  },
  geoMetrics: {
    estimatedMonthlyTraffic: 25000,
    conversionRate: 5.2,
    cac: 2.1,
    channelCoverage: ["ChatGPT", "Google AI Mode", "Perplexity"],
  },
  improvementPercent: {
    traffic: 67,
    conversion: 148,
    cacReduction: 50,
  },
}
```

### Adding Query Simulations

Edit `lib/mock/queries.ts` and add to `querySimulations`:

```typescript
{
  query: "your search query",
  matches: [
    { productId: "your-product-id", matchScore: 92, reason: "Match reason", missingSignals: ["Gap 1"] },
  ],
  agentPreviewAnswer: "How the AI would answer this query",
}
```

### Customizing the Launch Checklist

Edit `lib/mock/checklist.ts` to add, remove, or modify checklist items:

```typescript
{ id: "new-id", task: "Task description", channel: "Channel name", status: "done" }
// status: "done" | "needs-review" | "missing"
```

## Available Product Categories

| Category | ID | # Products |
|---|---|---|
| Electronics | `electronics` | 10 (MacBook, iPhone, AirPods, ThinkPad, Samsung, Pixel, etc.) |
| Outdoor & Sports | `outdoor` | 10 (backpacks, hiking boots, trekking poles, tent, headlamp, etc.) |
| Pet Supplies | `pets` | 10 (leashes, cat/dog food, raincoat, scratcher, feeder, etc.) |
| Health & Supplements | `health` | 9 (fish oil, vitamin D, probiotics, collagen, protein, etc.) |

## Featured Products (with detailed mock data)

These products have hand-crafted audit results, channel data, and comparisons:

- **Apple AirPods Pro 2** (`elec-004`) - Default selected product
- **Apple MacBook Pro 14" M3** (`elec-001`)
- **Waterproof Hiking Backpack 30L** (`out-001`)
- **Heavy Duty Dog Leash** (`pet-001`)
- **Omega-3 Fish Oil Capsules** (`hlth-001`)

All other products use auto-generated defaults with randomized scores.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: TypeScript
- **Package Manager**: npm (or bun)

## Troubleshooting

**Port already in use**: Use `npm run dev -- -p 3001` to start on a different port.

**Build errors**: Run `npx tsc --noEmit` to check for TypeScript errors.

**Styles not loading**: Ensure Tailwind is properly configured. Run `npm install` to reinstall dependencies.
