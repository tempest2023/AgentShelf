import { SeoGeoComparison, Category } from "../types";

const categoryDefaults: Record<Category, { seoConversion: number; geoConversion: number; seoTraffic: number }> = {
  electronics: { seoConversion: 2.1, geoConversion: 5.2, seoTraffic: 15000 },
  outdoor: { seoConversion: 2.5, geoConversion: 6.0, seoTraffic: 8000 },
  pets: { seoConversion: 3.0, geoConversion: 6.5, seoTraffic: 6000 },
  health: { seoConversion: 1.8, geoConversion: 4.5, seoTraffic: 12000 },
};

export const mockComparisons: Record<string, SeoGeoComparison> = {
  "elec-001": {
    productId: "elec-001",
    category: "electronics",
    seoMetrics: {
      estimatedMonthlyTraffic: 18500,
      conversionRate: 2.3,
      cac: 4.2,
      channelCoverage: "Google Search only",
    },
    geoMetrics: {
      estimatedMonthlyTraffic: 28200,
      conversionRate: 5.5,
      cac: 2.1,
      channelCoverage: ["ChatGPT", "Google AI Mode", "Perplexity"],
    },
    improvementPercent: { traffic: 52, conversion: 139, cacReduction: 50 },
  },
  "elec-004": {
    productId: "elec-004",
    category: "electronics",
    seoMetrics: {
      estimatedMonthlyTraffic: 42000,
      conversionRate: 2.1,
      cac: 3.8,
      channelCoverage: "Google Search only",
    },
    geoMetrics: {
      estimatedMonthlyTraffic: 65100,
      conversionRate: 5.2,
      cac: 1.8,
      channelCoverage: ["ChatGPT", "Google AI Mode", "Perplexity"],
    },
    improvementPercent: { traffic: 55, conversion: 148, cacReduction: 53 },
  },
  "out-001": {
    productId: "out-001",
    category: "outdoor",
    seoMetrics: {
      estimatedMonthlyTraffic: 5600,
      conversionRate: 2.8,
      cac: 2.5,
      channelCoverage: "Google Search only",
    },
    geoMetrics: {
      estimatedMonthlyTraffic: 9200,
      conversionRate: 6.2,
      cac: 1.2,
      channelCoverage: ["ChatGPT", "Google AI Mode"],
    },
    improvementPercent: { traffic: 64, conversion: 121, cacReduction: 52 },
  },
  "pet-001": {
    productId: "pet-001",
    category: "pets",
    seoMetrics: {
      estimatedMonthlyTraffic: 4200,
      conversionRate: 3.2,
      cac: 1.8,
      channelCoverage: "Google Search only",
    },
    geoMetrics: {
      estimatedMonthlyTraffic: 7100,
      conversionRate: 6.8,
      cac: 0.9,
      channelCoverage: ["ChatGPT", "Google AI Mode", "Perplexity"],
    },
    improvementPercent: { traffic: 69, conversion: 113, cacReduction: 50 },
  },
  "hlth-001": {
    productId: "hlth-001",
    category: "health",
    seoMetrics: {
      estimatedMonthlyTraffic: 9800,
      conversionRate: 1.9,
      cac: 3.2,
      channelCoverage: "Google Search only",
    },
    geoMetrics: {
      estimatedMonthlyTraffic: 15200,
      conversionRate: 4.6,
      cac: 1.5,
      channelCoverage: ["ChatGPT", "Google AI Mode", "Perplexity"],
    },
    improvementPercent: { traffic: 55, conversion: 142, cacReduction: 53 },
  },
};

export function getComparison(productId: string, category: Category): SeoGeoComparison {
  if (mockComparisons[productId]) return mockComparisons[productId];

  const defaults = categoryDefaults[category];
  const trafficMultiplier = 1.4 + Math.random() * 0.3;
  const conversionMultiplier = 2 + Math.random() * 0.8;

  return {
    productId,
    category,
    seoMetrics: {
      estimatedMonthlyTraffic: defaults.seoTraffic + Math.floor(Math.random() * 5000),
      conversionRate: defaults.seoConversion,
      cac: 2 + Math.random() * 3,
      channelCoverage: "Google Search only",
    },
    geoMetrics: {
      estimatedMonthlyTraffic: Math.floor((defaults.seoTraffic + Math.random() * 5000) * trafficMultiplier),
      conversionRate: defaults.geoConversion,
      cac: 1 + Math.random() * 1.5,
      channelCoverage: ["ChatGPT", "Google AI Mode", "Perplexity"],
    },
    improvementPercent: {
      traffic: Math.floor((trafficMultiplier - 1) * 100),
      conversion: Math.floor((conversionMultiplier - 1) * 100),
      cacReduction: 45 + Math.floor(Math.random() * 15),
    },
  };
}
