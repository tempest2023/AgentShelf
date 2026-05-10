import { ChatGPTCommercialPack, GoogleAIModeChecklist } from "../types";
import { deterministicInteger } from "./utils";

export const chatgptPacks: Record<string, ChatGPTCommercialPack> = {
  "elec-001": {
    productId: "elec-001",
    primaryIntents: [
      "best laptop for software development 2026",
      "MacBook Pro vs ThinkPad for programming",
      "professional laptop for video editing under $2000",
      "best laptop for machine learning development",
    ],
    sponsoredMessage: "MacBook Pro 14\" M3 delivers desktop-class performance in a portable form factor. With 18GB unified memory and the Liquid Retina XDR display, it's built for developers and creators who need power on the go.",
    adSafeSummary: "Apple MacBook Pro 14\" with M3 chip - professional-grade laptop featuring 18GB RAM, Liquid Retina XDR display, and up to 22-hour battery life. Starting at $1,999.",
    riskWarnings: [
      'Avoid claiming "fastest laptop" without benchmark references',
      "Do not compare battery life without citing specific test conditions",
      'Price claims must include "starting at" qualifier',
    ],
    comparisonClaims: [
      { competitor: "ThinkPad X1 Carbon", claim: "22h vs 15h battery life; Liquid Retina XDR vs 2.8K OLED display" },
      { competitor: "Dell XPS 15", claim: "M3 chip unified memory architecture vs discrete GPU approach" },
    ],
    requiredFixes: [
      "Add software development use case with specific IDEs",
      "Add comparison table with ThinkPad X1 Carbon",
      "Add FAQ for developer workflows",
      "Add pricing tiers and configuration options",
    ],
  },
  "elec-004": {
    productId: "elec-004",
    primaryIntents: [
      "best noise cancelling earbuds for commuting",
      "AirPods Pro 2 vs AirPods Max for work",
      "wireless earbuds with best ANC under $300",
      "earbuds for work from home calls",
    ],
    sponsoredMessage: "AirPods Pro 2 feature Active Noise Cancellation that adapts to your environment in real time. With 30 hours of total battery life and Spatial Audio, they're designed for commuters and remote workers who demand premium sound.",
    adSafeSummary: "Apple AirPods Pro 2 - Active Noise Cancelling earbuds with Adaptive Audio, Spatial Audio, and 30-hour total battery life. USB-C charging. $249.",
    riskWarnings: [
      'Avoid "best noise cancellation" claims without test standard references',
      "Do not overstate water resistance - IP54 is splash-proof, not submersible",
      "Battery claims must specify ANC on/off conditions",
    ],
    comparisonClaims: [
      { competitor: "AirPods Max", claim: "In-ear portability at $249 vs over-ear at $549; 30h vs 20h battery" },
      { competitor: "Bose QC Ultra Earbuds", claim: "Apple ecosystem integration; Spatial Audio with head tracking" },
    ],
    requiredFixes: [
      "Add commute and work-from-home use cases",
      "Add comparison table with AirPods Max and Bose QC Ultra",
      "Add FAQ for ANC performance in different environments",
      "Add shipping and return policy",
    ],
  },
};

export const googleChecklists: Record<string, GoogleAIModeChecklist> = {
  "elec-001": {
    productId: "elec-001",
    score: 66,
    items: [
      { label: "Product Title Quality", status: "warn", detail: "Title lacks key specifications and use cases" },
      { label: "Description Completeness", status: "warn", detail: "Description too brief, missing detailed features" },
      { label: "GTIN / SKU / Brand / Category", status: "pass", detail: "All identifiers present" },
      { label: "Price and Availability", status: "pass", detail: "Price and stock status available" },
      { label: "Product Images", status: "pass", detail: "High-quality images available" },
      { label: "Shipping Policy", status: "fail", detail: "Missing structured shipping policy" },
      { label: "Return Policy", status: "fail", detail: "Missing structured return policy" },
      { label: "Reviews and Rating", status: "pass", detail: "4.8 rating with 12,450 reviews" },
      { label: "Product Structured Data", status: "fail", detail: "No JSON-LD Product schema found" },
      { label: "Merchant Center Feed", status: "warn", detail: "Feed compatible but missing optional attributes" },
    ],
    feedPatch: {
      title: "Apple MacBook Pro 14\" M3 - Professional Laptop for Developers & Creators | 18GB RAM, Liquid Retina XDR",
      brand: "Apple",
      price: "1999.00 USD",
      availability: "in_stock",
      condition: "new",
      product_type: "Electronics > Computers > Laptops > MacBook Pro",
      description: "Professional-grade laptop with M3 chip, 14.2-inch Liquid Retina XDR display with ProMotion, 18GB unified memory, 512GB SSD storage. Up to 22-hour battery life. Ideal for software development, video editing, and creative workflows.",
      shipping: "Free 2-day shipping",
      return_policy: "14-day returns",
      gtin: "194252057832",
    },
  },
  "elec-004": {
    productId: "elec-004",
    score: 58,
    items: [
      { label: "Product Title Quality", status: "fail", detail: "Title too generic, missing key features" },
      { label: "Description Completeness", status: "fail", detail: "Description lacks detail and use cases" },
      { label: "GTIN / SKU / Brand / Category", status: "pass", detail: "All identifiers present" },
      { label: "Price and Availability", status: "pass", detail: "Price and stock status available" },
      { label: "Product Images", status: "pass", detail: "Product images available" },
      { label: "Shipping Policy", status: "warn", detail: "Basic shipping info only" },
      { label: "Return Policy", status: "warn", detail: "Basic return policy only" },
      { label: "Reviews and Rating", status: "pass", detail: "4.6 rating with 52,100 reviews" },
      { label: "Product Structured Data", status: "fail", detail: "No JSON-LD Product schema found" },
      { label: "Merchant Center Feed", status: "warn", detail: "Feed compatible but needs enrichment" },
    ],
    feedPatch: {
      title: "Apple AirPods Pro 2 - Active Noise Cancelling Earbuds for Commuting & Work | USB-C, 30h Battery, Spatial Audio",
      brand: "Apple",
      price: "249.00 USD",
      availability: "in_stock",
      condition: "new",
      product_type: "Electronics > Audio > Headphones > In-Ear",
      description: "Active Noise Cancelling earbuds with Adaptive Audio, Personalized Spatial Audio with head tracking, and up to 30 hours total battery life. USB-C charging case with built-in speaker and lanyard loop. IP54 water and dust resistant.",
      shipping: "Free shipping over $35",
      return_policy: "14-day returns",
      gtin: "194252057200",
    },
  },
};

export function getChatgptPack(productId: string): ChatGPTCommercialPack {
  if (chatgptPacks[productId]) return chatgptPacks[productId];
  return {
    productId,
    primaryIntents: [
      "best product in category",
      "product vs competitor comparison",
      "affordable option with premium features",
    ],
    sponsoredMessage: "Premium quality product with key features designed for target audience. Trusted by thousands of verified buyers.",
    adSafeSummary: "Quality product with verified reviews and competitive pricing. Available with free shipping.",
    riskWarnings: [
      "Avoid unsubstantiated superlative claims",
      "Include specific product dimensions and specs",
      "Price claims must be current and accurate",
    ],
    comparisonClaims: [
      { competitor: "Market leader", claim: "Better value for the feature set" },
    ],
    requiredFixes: [
      "Add detailed use-case descriptions",
      "Add comparison table",
      "Add FAQ section",
      "Add shipping and return policy details",
    ],
  };
}

export function getGoogleChecklist(productId: string): GoogleAIModeChecklist {
  if (googleChecklists[productId]) return googleChecklists[productId];
  return {
    productId,
    score: deterministicInteger(`${productId}:google-score`, 55, 74),
    items: [
      { label: "Product Title Quality", status: "warn", detail: "Title could be more descriptive" },
      { label: "Description Completeness", status: "warn", detail: "Description needs more detail" },
      { label: "GTIN / SKU / Brand / Category", status: "pass" },
      { label: "Price and Availability", status: "pass" },
      { label: "Product Images", status: "pass" },
      { label: "Shipping Policy", status: "fail", detail: "Missing structured shipping info" },
      { label: "Return Policy", status: "fail", detail: "Missing structured return policy" },
      { label: "Reviews and Rating", status: "pass" },
      { label: "Product Structured Data", status: "fail", detail: "No JSON-LD found" },
      { label: "Merchant Center Feed", status: "warn", detail: "Feed needs enrichment" },
    ],
    feedPatch: {
      title: "Optimized product title with key features",
      description: "Enhanced description with full feature set and use cases",
      shipping: "Standard shipping available",
      return_policy: "30-day returns",
    },
  };
}
