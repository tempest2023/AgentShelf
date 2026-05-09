import { QuerySimulation, Category } from "../types";

const querySimulations: QuerySimulation[] = [
  // Electronics
  {
    query: "best noise cancelling headphones for commuting",
    matches: [
      { productId: "elec-004", matchScore: 92, reason: "Strong ANC, compact form factor, 30h battery", missingSignals: ["No commute-specific use case", "Missing FAQ"] },
      { productId: "elec-005", matchScore: 78, reason: "Premium ANC, high-fidelity audio", missingSignals: ["Over-ear less portable for commuting", "No commute use case"] },
    ],
    agentPreviewAnswer: "For commuting, I'd recommend the AirPods Pro 2. They offer excellent Active Noise Cancellation that adapts to your environment, 30 hours of total battery life with the charging case, and a compact design that fits easily in your pocket. At $249, they're also significantly more portable than over-ear alternatives like the AirPods Max ($549).",
  },
  {
    query: "best laptop for software development under $2000",
    matches: [
      { productId: "elec-001", matchScore: 88, reason: "M3 chip, 18GB RAM, excellent battery, Xcode support", missingSignals: ["No developer-specific use case", "Missing IDE benchmarks"] },
      { productId: "elec-006", matchScore: 82, reason: "Intel i7, 16GB RAM, excellent keyboard, Linux support", missingSignals: ["No developer workflow description"] },
    ],
    agentPreviewAnswer: "For software development under $2000, the MacBook Pro 14\" M3 at $1,999 is an excellent choice. The M3 chip with 18GB unified memory handles Xcode, Docker, and multiple IDEs simultaneously, while the 22-hour battery life means you can code all day without charging. If you prefer Windows/Linux, the ThinkPad X1 Carbon Gen 11 at $1,449 offers a fantastic keyboard and runs Linux natively.",
  },
  {
    query: "wireless earbuds with long battery life",
    matches: [
      { productId: "elec-004", matchScore: 90, reason: "30h total battery with case, ANC, compact design", missingSignals: ["No battery life comparison chart"] },
      { productId: "elec-005", matchScore: 75, reason: "Premium audio, 24h battery", missingSignals: ["Over-ear form factor"] },
    ],
    agentPreviewAnswer: "For wireless earbuds with long battery life, the AirPods Pro 2 stand out with 30 hours of total battery life (6h per charge + 24h from the case). They also feature Active Noise Cancellation and a compact design. At $249, they offer the best balance of battery life, sound quality, and portability.",
  },
  {
    query: "4k monitor for photo editing",
    matches: [
      { productId: "elec-003", matchScore: 85, reason: "4K resolution, color accuracy, USB-C connectivity", missingSignals: ["No color gamut specs listed", "Missing calibration details"] },
    ],
    agentPreviewAnswer: "For photo editing, a 4K monitor with accurate color reproduction is essential. The ProArt Display offers 4K resolution with 99% AdobeRGB coverage and hardware calibration support. At $699, it's a solid choice for photographers and designers who need reliable color accuracy.",
  },
  // Outdoor
  {
    query: "waterproof hiking backpack for day trips",
    matches: [
      { productId: "out-001", matchScore: 95, reason: "30L capacity, IPX4 waterproof, lightweight", missingSignals: ["No trail-specific descriptions", "Missing FAQ"] },
      { productId: "out-002", matchScore: 72, reason: "50L capacity, IPX5 waterproof", missingSignals: ["May be too large for day trips"] },
    ],
    agentPreviewAnswer: "For day hikes, the Waterproof Hiking Backpack 30L is the ideal choice. It offers IPX4 water resistance to protect your gear in light rain, weighs only 1.2kg, and has enough space for a full day of hiking. At $89, it's also great value. If you need more capacity for overnight trips, the 50L version at $129 is worth considering.",
  },
  {
    query: "lightweight tent for solo camping",
    matches: [
      { productId: "out-003", matchScore: 88, reason: "Ultralight 1.5kg, 2-season, easy setup", missingSignals: ["No wind resistance rating", "Missing packed size info"] },
      { productId: "out-004", matchScore: 74, reason: "3-season versatility, vestibule storage", missingSignals: ["Heavier at 2.8kg"] },
    ],
    agentPreviewAnswer: "For solo camping, the Ultralight Camping Tent at 1.5kg is hard to beat. It pitches in under 5 minutes and packs down to the size of a water bottle. At $159, it's perfect for backpackers who count every gram. If you camp in cooler conditions, the 3-Season Pro at $229 adds a vestibule and better wind resistance.",
  },
  {
    query: "best running shoes for trails",
    matches: [
      { productId: "out-005", matchScore: 91, reason: "Vibram sole, waterproof, ankle support", missingSignals: ["No sizing guide", "Missing break-in period info"] },
    ],
    agentPreviewAnswer: "For trail running, the Trail Runner Pro offers Vibram outsole traction, waterproof membrane, and reinforced ankle support. At $134, they're built for technical terrain while remaining lightweight enough for speed. The gusseted tongue keeps debris out on dusty trails.",
  },
  // Pets
  {
    query: "best dog leash for large dogs that pull",
    matches: [
      { productId: "pet-001", matchScore: 94, reason: "200lb capacity, padded handle, reflective", missingSignals: ["No breed-specific recommendations", "Missing FAQ"] },
    ],
    agentPreviewAnswer: "The Heavy Duty Dog Leash for Large Dogs is built specifically for strong pullers. With a 200lb weight capacity, 1\" wide nylon webbing, and a padded neoprene handle, it provides comfortable control during walks. The reflective stitching adds visibility for early morning or evening walks. At $29, it's a great investment for owners of German Shepherds, Labs, and Pit Bulls.",
  },
  {
    query: "interactive cat toys for indoor cats",
    matches: [
      { productId: "pet-003", matchScore: 89, reason: "Automated movement, rechargeable, multiple play modes", missingSignals: ["No noise level info", "Missing battery life specs"] },
      { productId: "pet-004", matchScore: 76, reason: "Feather wand, manual interaction", missingSignals: ["Requires human participation"] },
    ],
    agentPreviewAnswer: "For indoor cats, the Interactive Laser Toy is a top pick. It features automated random patterns that keep cats engaged, USB-C rechargeable battery lasting 7 days, and 3 play modes. At $24, it's an affordable way to keep your cat active and entertained while you're busy.",
  },
  {
    query: "orthopedic dog bed for large breeds",
    matches: [
      { productId: "pet-002", matchScore: 92, reason: "Memory foam, waterproof liner, machine washable", missingSignals: ["No size chart for breeds", "Missing foam density specs"] },
    ],
    agentPreviewAnswer: "For large breed dogs, the Orthopedic Memory Foam Dog Bed provides joint relief with 4\" of high-density foam. The waterproof inner liner protects against accidents, and the removable cover is machine washable. At $79, it's veterinarian-recommended for dogs with arthritis or hip dysplasia.",
  },
  // Health
  {
    query: "omega 3 fish oil supplement benefits",
    matches: [
      { productId: "hlth-001", matchScore: 90, reason: "Triple strength EPA/DHA, no fishy aftertaste", missingSignals: ["No third-party certifications listed", "Missing dosage guidelines"] },
    ],
    agentPreviewAnswer: "The Omega-3 Fish Oil Capsules from VitaPure deliver triple-strength EPA 600mg and DHA 400mg per serving. These support heart health, brain function, and joint mobility. The molecular distillation process removes heavy metals, and the lemon-flavored enteric coating eliminates fishy aftertaste. At $24 for 120 capsules, it's excellent value for a high-potency fish oil.",
  },
  {
    query: "best probiotic for gut health",
    matches: [
      { productId: "hlth-003", matchScore: 87, reason: "50 billion CFU, 12 strains, delayed-release", missingSignals: ["No clinical study references", "Missing storage instructions"] },
      { productId: "hlth-004", matchScore: 73, reason: "Prebiotic + probiotic blend", missingSignals: ["Lower CFU count"] },
    ],
    agentPreviewAnswer: "For gut health, the Advanced Probiotic Complex delivers 50 billion CFU across 12 clinically studied strains. The delayed-release capsules survive stomach acid to reach the intestines. At $34 for 60 capsules, it's a premium option with Lactobacillus and Bifidobacterium strains backed by research.",
  },
  {
    query: "vitamin d3 supplement for immune support",
    matches: [
      { productId: "hlth-002", matchScore: 86, reason: "5000 IU D3, added K2, easy-swallow softgels", missingSignals: ["No blood level testing guidance"] },
    ],
    agentPreviewAnswer: "The Vitamin D3 + K2 Softgels provide 5000 IU of D3 with added K2 for calcium absorption. The combination supports immune function, bone health, and mood regulation. At $18 for 120 softgels, it's a cost-effective daily supplement. Take with a fat-containing meal for best absorption.",
  },
];

const categoryKeywords: Record<Category, string[][]> = {
  electronics: [
    ["headphone", "noise", "commut", "earbuds", "anc"],
    ["laptop", "develop", "code", "programming", "macbook"],
    ["monitor", "display", "screen", "4k"],
    ["earbuds", "wireless", "battery", "bluetooth"],
    ["phone", "smartphone", "mobile"],
    ["tablet", "ipad"],
    ["camera", "photo", "video"],
    ["speaker", "bluetooth", "audio"],
  ],
  outdoor: [
    ["backpack", "hik", "trail", "rucksack"],
    ["tent", "camp", "shelter"],
    ["shoe", "run", "trail", "boot"],
    ["jacket", "waterproof", "rain", "shell"],
    ["sleeping", "bag", "pad"],
    ["cook", "stove", "portable"],
    ["lamp", "flashlight", "headlamp", "light"],
    ["water", "bottle", "filter", "hydration"],
  ],
  pets: [
    ["leash", "dog", "lead", "collar"],
    ["toy", "cat", "interactive", "play"],
    ["bed", "orthopedic", "cushion", "mat"],
    ["food", "feed", "kibble", "treat"],
    ["groom", "brush", "shampoo"],
    ["carrier", "crate", "crate"],
    ["bowl", "dish", "feeder"],
    ["health", "vitamin", "supplement"],
  ],
  health: [
    ["fish oil", "omega", "epa", "dha"],
    ["probiotic", "gut", "digestive", "bacteria"],
    ["vitamin", "d3", "immune", "supplement"],
    ["protein", "whey", "muscle", "recovery"],
    ["collagen", "skin", "joint", "hair"],
    ["melatonin", "sleep", "rest"],
    ["magnesium", "mineral", "calm"],
    ["multivitamin", "daily", "comprehensive"],
  ],
};

const categoryDefaults: Record<Category, QuerySimulation> = {
  electronics: {
    query: "",
    matches: [
      { productId: "elec-001", matchScore: 70, reason: "General electronics match", missingSignals: ["May need more specific targeting"] },
    ],
    agentPreviewAnswer: "Based on your query, I'd recommend checking our top-rated electronics. Our AI analysis suggests these products have strong potential for visibility in AI-powered shopping results.",
  },
  outdoor: {
    query: "",
    matches: [
      { productId: "out-001", matchScore: 70, reason: "General outdoor match", missingSignals: ["May need more specific targeting"] },
    ],
    agentPreviewAnswer: "Based on your query, I'd recommend checking our top-rated outdoor gear. Our AI analysis suggests these products have strong potential for visibility in AI-powered shopping results.",
  },
  pets: {
    query: "",
    matches: [
      { productId: "pet-001", matchScore: 70, reason: "General pet supplies match", missingSignals: ["May need more specific targeting"] },
    ],
    agentPreviewAnswer: "Based on your query, I'd recommend checking our top-rated pet supplies. Our AI analysis suggests these products have strong potential for visibility in AI-powered shopping results.",
  },
  health: {
    query: "",
    matches: [
      { productId: "hlth-001", matchScore: 70, reason: "General health supplement match", missingSignals: ["May need more specific targeting"] },
    ],
    agentPreviewAnswer: "Based on your query, I'd recommend checking our top-rated health supplements. Our AI analysis suggests these products have strong potential for visibility in AI-powered shopping results.",
  },
};

const categoryPrefixes: Record<Category, string> = {
  electronics: "elec-",
  outdoor: "out-",
  pets: "pet-",
  health: "hlth-",
};

export function simulateQuery(query: string, category?: Category): QuerySimulation {
  const lower = query.toLowerCase();

  // If category is provided, filter simulations to that category's products
  const prefix = category ? categoryPrefixes[category] : null;
  const categorySims = prefix
    ? querySimulations.filter((q) => q.matches.some((m) => m.productId.startsWith(prefix)))
    : querySimulations;

  // Try to find a matching simulation within the category
  const keywords = category ? categoryKeywords[category] : [];
  for (const group of keywords) {
    if (group.some((kw) => lower.includes(kw))) {
      const match = categorySims.find((q) =>
        group.some((kw) => q.query.toLowerCase().includes(kw))
      );
      if (match) return { ...match, query };
    }
  }

  // Fallback: try all simulations
  const match = querySimulations.find((q) => {
    const allKeywords = Object.values(categoryKeywords).flat(1);
    return allKeywords.some(
      (group) =>
        group.some((kw) => lower.includes(kw)) &&
        group.some((kw) => q.query.toLowerCase().includes(kw))
    );
  });

  if (match) return { ...match, query };

  // Category-specific default
  if (category) {
    return { ...categoryDefaults[category], query };
  }

  // Generic default
  return {
    query,
    matches: [
      { productId: "elec-001", matchScore: 65, reason: "General product match", missingSignals: ["May need more specific targeting"] },
    ],
    agentPreviewAnswer: `Based on the query "${query}", I'd recommend checking our top-rated products in the matching category. Our AI analysis suggests these products have the best potential for visibility in AI-powered shopping results.`,
  };
}
