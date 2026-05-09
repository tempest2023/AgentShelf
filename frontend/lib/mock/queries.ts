import { QuerySimulation } from "../types";

const querySimulations: QuerySimulation[] = [
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
    query: "waterproof hiking backpack for day trips",
    matches: [
      { productId: "out-001", matchScore: 95, reason: "30L capacity, IPX4 waterproof, lightweight", missingSignals: ["No trail-specific descriptions", "Missing FAQ"] },
      { productId: "out-002", matchScore: 72, reason: "50L capacity, IPX5 waterproof", missingSignals: ["May be too large for day trips"] },
    ],
    agentPreviewAnswer: "For day hikes, the Waterproof Hiking Backpack 30L is the ideal choice. It offers IPX4 water resistance to protect your gear in light rain, weighs only 1.2kg, and has enough space for a full day of hiking. At $89, it's also great value. If you need more capacity for overnight trips, the 50L version at $129 is worth considering.",
  },
  {
    query: "best dog leash for large dogs that pull",
    matches: [
      { productId: "pet-001", matchScore: 94, reason: "200lb capacity, padded handle, reflective", missingSignals: ["No breed-specific recommendations", "Missing FAQ"] },
    ],
    agentPreviewAnswer: "The Heavy Duty Dog Leash for Large Dogs is built specifically for strong pullers. With a 200lb weight capacity, 1\" wide nylon webbing, and a padded neoprene handle, it provides comfortable control during walks. The reflective stitching adds visibility for early morning or evening walks. At $29, it's a great investment for owners of German Shepherds, Labs, and Pit Bulls.",
  },
  {
    query: "omega 3 fish oil supplement benefits",
    matches: [
      { productId: "hlth-001", matchScore: 90, reason: "Triple strength EPA/DHA, no fishy aftertaste", missingSignals: ["No third-party certifications listed", "Missing dosage guidelines"] },
    ],
    agentPreviewAnswer: "The Omega-3 Fish Oil Capsules from VitaPure deliver triple-strength EPA 600mg and DHA 400mg per serving. These support heart health, brain function, and joint mobility. The molecular distillation process removes heavy metals, and the lemon-flavored enteric coating eliminates fishy aftertaste. At $24 for 120 capsules, it's excellent value for a high-potency fish oil.",
  },
];

export function simulateQuery(query: string): QuerySimulation {
  const lower = query.toLowerCase();
  const match = querySimulations.find(q =>
    lower.includes("headphone") || lower.includes("noise") || lower.includes("commut")
      ? q.query.includes("noise") || q.query.includes("commut")
      : lower.includes("laptop") || lower.includes("develop")
      ? q.query.includes("laptop") || q.query.includes("develop")
      : lower.includes("backpack") || lower.includes("hik")
      ? q.query.includes("backpack") || q.query.includes("hik")
      : lower.includes("leash") || lower.includes("dog")
      ? q.query.includes("leash") || q.query.includes("dog")
      : lower.includes("fish oil") || lower.includes("omega")
      ? q.query.includes("fish") || q.query.includes("omega")
      : false
  );

  if (match) return match;

  // Default simulation
  return {
    query,
    matches: [
      { productId: "elec-001", matchScore: 65, reason: "General product match", missingSignals: ["May need more specific targeting"] },
    ],
    agentPreviewAnswer: `Based on the query "${query}", I'd recommend checking our top-rated products in the matching category. Our AI analysis suggests these products have the best potential for visibility in AI-powered shopping results.`,
  };
}
