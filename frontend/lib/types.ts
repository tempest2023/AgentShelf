export interface Product {
  id: string;
  title: string;
  category: Category;
  price: number;
  description: string;
  brand: string;
  gtin?: string;
  sku?: string;
  ingredients?: string[];
  targetAudience?: string[];
  attributes?: Record<string, string>;
  reviews?: { rating: number; count: number; summary: string };
  images?: string[];
  shippingPolicy?: string;
  returnPolicy?: string;
}

export type Category =
  | "electronics"
  | "outdoor"
  | "pets"
  | "health";

export interface ProductAudit {
  productId: string;
  aiReadinessScore: number;
  discoverabilityScore: number;
  clarityScore: number;
  schemaScore: number;
  missingSignals: string[];
  recommendedFixes: GeoFix[];
}

export interface GeoFix {
  type: "title" | "description" | "faq" | "comparison" | "schema";
  currentValue?: string;
  suggestedValue: string;
  reasoning: string;
}

export interface QuerySimulation {
  query: string;
  matches: {
    productId: string;
    matchScore: number;
    reason: string;
    missingSignals: string[];
  }[];
  agentPreviewAnswer: string;
}

export type AIRunStatusMode = "live" | "fallback" | "unavailable";

export interface AIRunStatus {
  mode: AIRunStatusMode;
  configured: boolean;
  model: string;
  message: string;
  error?: string;
  updatedAt: string;
}

export interface AuditResponsePayload {
  audit: ProductAudit;
  status: AIRunStatus;
}

export interface SimulationResponsePayload {
  simulation: QuerySimulation;
  status: AIRunStatus;
}

export interface SeoGeoComparison {
  productId: string;
  category: Category;
  seoMetrics: {
    estimatedMonthlyTraffic: number;
    conversionRate: number;
    cac: number;
    channelCoverage: string;
  };
  geoMetrics: {
    estimatedMonthlyTraffic: number;
    conversionRate: number;
    cac: number;
    channelCoverage: string[];
  };
  improvementPercent: {
    traffic: number;
    conversion: number;
    cacReduction: number;
  };
}

export interface ChatGPTCommercialPack {
  productId: string;
  primaryIntents: string[];
  sponsoredMessage: string;
  adSafeSummary: string;
  riskWarnings: string[];
  comparisonClaims: { competitor: string; claim: string }[];
  requiredFixes: string[];
}

export interface GoogleAIModeChecklist {
  productId: string;
  score: number;
  items: { label: string; status: "pass" | "fail" | "warn"; detail?: string }[];
  feedPatch: Record<string, string>;
}

export interface LaunchChecklistItem {
  id: string;
  task: string;
  channel: string;
  status: "done" | "needs-review" | "missing";
}
