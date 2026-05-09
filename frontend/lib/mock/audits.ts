import { ProductAudit } from "../types";

export const mockAudits: Record<string, ProductAudit> = {
  "elec-001": {
    productId: "elec-001",
    aiReadinessScore: 72,
    discoverabilityScore: 68,
    clarityScore: 75,
    schemaScore: 60,
    missingSignals: [
      "No structured use-case descriptions",
      "Missing commercial-intent query mapping",
      "No comparison claims vs competitors",
      "No FAQ section",
      "Missing JSON-LD product schema",
      "No shipping/return policy in structured format",
    ],
    recommendedFixes: [
      { type: "title", currentValue: "Apple MacBook Pro 14\" M3", suggestedValue: "Apple MacBook Pro 14\" M3 - Professional Laptop for Developers & Creators | 18GB RAM, Liquid Retina XDR", reasoning: "Adding target audience and key specs improves AI discoverability" },
      { type: "description", currentValue: "Apple MacBook Pro with M3 chip, 14-inch Liquid Retina XDR display.", suggestedValue: "The MacBook Pro 14\" with M3 chip delivers desktop-class performance in a portable form factor. Ideal for software development, video editing, and 3D rendering. Features a stunning 14.2-inch Liquid Retina XDR display with ProMotion, up to 22 hours of battery life, and a comprehensive port selection including HDMI, SD card slot, and MagSafe.", reasoning: "Richer description with use cases helps AI engines recommend the product" },
      { type: "faq", suggestedValue: "Q: Is the MacBook Pro M3 good for software development?\nA: Yes, with 18GB unified memory and the M3 chip, it handles Xcode, Docker, and multiple IDEs simultaneously.\n\nQ: How does MacBook Pro compare to ThinkPad X1 Carbon?\nA: MacBook Pro offers better battery life and display quality; ThinkPad has more port variety and runs Windows/Linux natively.\n\nQ: Can the MacBook Pro M3 handle video editing?\nA: Yes, the M3 chip has hardware-accelerated ProRes encoding, making 4K video editing smooth.", reasoning: "FAQs help AI engines answer user queries directly" },
      { type: "comparison", suggestedValue: "MacBook Pro 14\" M3 vs ThinkPad X1 Carbon Gen 11:\n- Display: Liquid Retina XDR (better HDR) vs 2.8K OLED (deeper blacks)\n- Battery: 22h vs 15h\n- Ecosystem: macOS/iOS integration vs Windows/Linux flexibility\n- Price: $1999 vs $1449", reasoning: "Comparison claims help AI agents present the product in 'vs' queries" },
      { type: "schema", suggestedValue: "{\"@context\":\"https://schema.org\",\"@type\":\"Product\",\"name\":\"Apple MacBook Pro 14\\\" M3\",\"brand\":{\"@type\":\"Brand\",\"name\":\"Apple\"},\"offers\":{\"@type\":\"Offer\",\"price\":\"1999\",\"priceCurrency\":\"USD\",\"availability\":\"https://schema.org/InStock\"}}", reasoning: "JSON-LD structured data enables rich results in Google Search" },
    ],
  },
  "elec-004": {
    productId: "elec-004",
    aiReadinessScore: 64,
    discoverabilityScore: 60,
    clarityScore: 68,
    schemaScore: 55,
    missingSignals: [
      "No commute/work-from-home use case",
      "Missing comparison with AirPods Max and Bose QC Ultra",
      "No structured FAQ",
      "Missing JSON-LD product schema",
      "No shipping policy details",
      "No return policy in structured format",
      "Missing commercial-intent query mapping",
    ],
    recommendedFixes: [
      { type: "title", currentValue: "Apple AirPods Pro 2", suggestedValue: "Apple AirPods Pro 2 - Active Noise Cancelling Earbuds for Commuting & Work | USB-C, 30h Battery, Spatial Audio", reasoning: "Adding use cases and key features for AI discoverability" },
      { type: "description", currentValue: "Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio.", suggestedValue: "AirPods Pro 2 deliver industry-leading Active Noise Cancellation with Adaptive Audio that seamlessly blends ANC and Transparency mode. Perfect for daily commuters, work-from-home professionals, and fitness enthusiasts. Features Personalized Spatial Audio with dynamic head tracking, up to 30 hours total battery life with the USB-C charging case, and IP54 water and dust resistance.", reasoning: "Target use cases and key differentiators for AI recommendation" },
      { type: "faq", suggestedValue: "Q: Are AirPods Pro 2 good for commuting?\nA: Yes, the Active Noise Cancellation blocks train and bus noise effectively, and the compact case fits easily in a pocket.\n\nQ: AirPods Pro 2 vs AirPods Max - which should I buy?\nA: AirPods Pro 2 are better for portability and commuting; AirPods Max offer superior sound quality for home/office use.\n\nQ: How long do AirPods Pro 2 last on a single charge?\nA: 6 hours with ANC on, plus 24 additional hours from the charging case.", reasoning: "Direct answers for common AI shopping queries" },
      { type: "comparison", suggestedValue: "AirPods Pro 2 vs AirPods Max:\n- Portability: In-ear (pocketable) vs Over-ear (bulky)\n- ANC: Excellent vs Industry-leading\n- Battery: 30h total vs 20h\n- Price: $249 vs $549\n- Best for: Commuting/travel vs Home/office critical listening", reasoning: "Comparison data for AI vs queries" },
      { type: "schema", suggestedValue: "{\"@context\":\"https://schema.org\",\"@type\":\"Product\",\"name\":\"Apple AirPods Pro 2\",\"brand\":{\"@type\":\"Brand\",\"name\":\"Apple\"},\"offers\":{\"@type\":\"Offer\",\"price\":\"249\",\"priceCurrency\":\"USD\",\"availability\":\"https://schema.org/InStock\"}}", reasoning: "Structured data for rich search results" },
    ],
  },
  "out-001": {
    productId: "out-001",
    aiReadinessScore: 70,
    discoverabilityScore: 65,
    clarityScore: 74,
    schemaScore: 58,
    missingSignals: [
      "No trail-specific use case descriptions",
      "Missing comparison claims",
      "No FAQ section",
      "Missing JSON-LD product schema",
      "No weather-resistance specifics",
    ],
    recommendedFixes: [
      { type: "title", suggestedValue: "Waterproof Hiking Backpack 30L - Day Hiking & Trail Running Pack | IPX4, Ripstop Nylon, 1.2kg", reasoning: "Add use cases and key specs for AI discoverability" },
      { type: "description", suggestedValue: "A rugged 30L waterproof daypack built for trail hiking, commuting, and outdoor adventures. IPX4-rated water resistance protects gear in rain showers. Made from tear-resistant ripstop nylon with padded shoulder straps and ventilated back panel. Ideal for day hikes up to 10 miles, trail running, and daily commuting.", reasoning: "Use-case rich description" },
      { type: "faq", suggestedValue: "Q: Is this backpack fully waterproof?\nA: It has IPX4 water resistance, protecting against splashes and light rain. For heavy rain, use the included rain cover.\n\nQ: Can I use this for overnight hikes?\nA: It's designed for day hikes. For overnight trips, consider the 50L version.", reasoning: "Practical FAQ for outdoor buyers" },
      { type: "schema", suggestedValue: "{\"@context\":\"https://schema.org\",\"@type\":\"Product\",\"name\":\"Waterproof Hiking Backpack 30L\",\"brand\":{\"@type\":\"Brand\",\"name\":\"TrailMaster\"},\"offers\":{\"@type\":\"Offer\",\"price\":\"89\",\"priceCurrency\":\"USD\",\"availability\":\"https://schema.org/InStock\"}}", reasoning: "JSON-LD for Google rich results" },
    ],
  },
  "pet-001": {
    productId: "pet-001",
    aiReadinessScore: 75,
    discoverabilityScore: 70,
    clarityScore: 78,
    schemaScore: 62,
    missingSignals: [
      "No breed-specific recommendations",
      "Missing comparison with other leash types",
      "No FAQ section",
      "Missing JSON-LD product schema",
    ],
    recommendedFixes: [
      { type: "title", suggestedValue: "Heavy Duty Dog Leash for Large Dogs - 6ft Padded Reflective Leash | 200lb Capacity, Ideal for German Shepherds, Labs, Pit Bulls", reasoning: "Breed-specific targeting for AI search queries" },
      { type: "description", suggestedValue: "Built for large, strong dogs that pull. This 6-foot heavy-duty leash features a padded neoprene handle for comfortable grip during walks, runs, and training sessions. Reflective stitching ensures visibility in low light. Rated for dogs up to 200lbs. Ideal for German Shepherds, Labrador Retrievers, Pit Bulls, and other powerful breeds.", reasoning: "Breed targeting and use-case descriptions" },
      { type: "faq", suggestedValue: "Q: Is this leash good for dogs that pull?\nA: Yes, the 1\" wide nylon webbing and reinforced stitching handle pulling from dogs up to 200lbs.\n\nQ: Can I use this leash for running with my dog?\nA: Yes, the padded handle and 6ft length make it great for jogging together.", reasoning: "Practical pet owner FAQ" },
      { type: "schema", suggestedValue: "{\"@context\":\"https://schema.org\",\"@type\":\"Product\",\"name\":\"Heavy Duty Dog Leash - Large Dogs\",\"brand\":{\"@type\":\"Brand\",\"name\":\"PawStrong\"},\"offers\":{\"@type\":\"Offer\",\"price\":\"29\",\"priceCurrency\":\"USD\",\"availability\":\"https://schema.org/InStock\"}}", reasoning: "Structured data for search visibility" },
    ],
  },
  "hlth-001": {
    productId: "hlth-001",
    aiReadinessScore: 71,
    discoverabilityScore: 66,
    clarityScore: 73,
    schemaScore: 56,
    missingSignals: [
      "No ingredient sourcing details",
      "Missing third-party testing certifications",
      "No dosage guidelines",
      "No FAQ section",
      "Missing JSON-LD product schema",
      "No comparison with competing brands",
    ],
    recommendedFixes: [
      { type: "title", suggestedValue: "Omega-3 Fish Oil Capsules 120ct - Triple Strength EPA 600mg + DHA 400mg | Molecularly Distilled, No Fishy Aftertaste", reasoning: "Key specs and trust signals for health products" },
      { type: "description", suggestedValue: "Triple-strength fish oil delivering 600mg EPA and 400mg DHA per softgel. Sourced from wild-caught fish and molecularly distilled to remove heavy metals and contaminants. Supports heart health, brain function, and joint mobility. No fishy aftertaste thanks to lemon-flavored enteric coating. Third-party tested for purity and potency.", reasoning: "Trust signals and sourcing details for health-conscious buyers" },
      { type: "faq", suggestedValue: "Q: How much EPA and DHA is in each capsule?\nA: Each capsule contains 600mg EPA and 400mg DHA, triple the strength of standard fish oil.\n\nQ: Is this fish oil tested for mercury?\nA: Yes, it's molecularly distilled and third-party tested to ensure it's free from heavy metals.\n\nQ: When should I take fish oil?\nA: Take 1-2 capsules daily with a meal for best absorption.", reasoning: "Health product specific FAQ" },
      { type: "schema", suggestedValue: "{\"@context\":\"https://schema.org\",\"@type\":\"Product\",\"name\":\"Omega-3 Fish Oil Capsules (120ct)\",\"brand\":{\"@type\":\"Brand\",\"name\":\"VitaPure\"},\"offers\":{\"@type\":\"Offer\",\"price\":\"24\",\"priceCurrency\":\"USD\",\"availability\":\"https://schema.org/InStock\"}}", reasoning: "Structured data for rich results" },
    ],
  },
};

export function getAuditForProduct(productId: string): ProductAudit {
  if (mockAudits[productId]) return mockAudits[productId];

  // Generate a default audit for products without specific mock data
  return {
    productId,
    aiReadinessScore: 55 + Math.floor(Math.random() * 20),
    discoverabilityScore: 50 + Math.floor(Math.random() * 25),
    clarityScore: 55 + Math.floor(Math.random() * 20),
    schemaScore: 40 + Math.floor(Math.random() * 25),
    missingSignals: [
      "No structured use-case descriptions",
      "Missing FAQ section",
      "No JSON-LD product schema",
      "Missing comparison claims",
    ],
    recommendedFixes: [
      { type: "title", suggestedValue: "Optimized title with key features and use cases", reasoning: "Improve discoverability" },
      { type: "description", suggestedValue: "Enhanced description with use cases and key differentiators", reasoning: "Better AI understanding" },
      { type: "faq", suggestedValue: "Q: Who is this product for?\nA: [Target audience description]\n\nQ: What makes this product unique?\nA: [Key differentiators]", reasoning: "FAQ helps AI engines answer queries" },
      { type: "schema", suggestedValue: "{\"@context\":\"https://schema.org\",\"@type\":\"Product\"}", reasoning: "JSON-LD for search visibility" },
    ],
  };
}
