import { LaunchChecklistItem } from "../types";

export const launchChecklist: LaunchChecklistItem[] = [
  { id: "lc-01", task: "Generate GEO-optimized product descriptions", channel: "All AI engines", status: "done" },
  { id: "lc-02", task: "Add structured FAQ", channel: "ChatGPT / Perplexity / Google", status: "done" },
  { id: "lc-03", task: "Generate JSON-LD Product Schema", channel: "Google", status: "done" },
  { id: "lc-04", task: "Create Merchant Center feed patch", channel: "Google AI Mode", status: "needs-review" },
  { id: "lc-05", task: "Map commercial intent queries", channel: "ChatGPT Ads", status: "done" },
  { id: "lc-06", task: "Generate sponsored message variants", channel: "ChatGPT Ads", status: "needs-review" },
  { id: "lc-07", task: "Add comparison table", channel: "Perplexity / ChatGPT", status: "done" },
  { id: "lc-08", task: "Add shipping and return policy", channel: "Google / ChatGPT", status: "missing" },
  { id: "lc-09", task: "Simulate AI shopping query", channel: "All", status: "done" },
  {
    id: "lc-10",
    task: "Publish approved product updates",
    channel: "Shopify / TikTok Shop / Amazon Shop / Stripe",
    status: "needs-review",
  },
];
