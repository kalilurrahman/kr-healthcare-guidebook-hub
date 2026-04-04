export interface GccMetric {
  metric: string;
  dimension: string;
  description: string;
  matureBenchmark: string;
  largeBenchmark: string;
  novartisInsight: string;
  source: string;
}

export const gccDimensions = [
  "Strategic Alignment to HQ",
  "Governance & Empowerment",
  "Service Portfolio",
  "Depth of Capability",
  "Digital Maturity",
  "Future-Ready Workforce",
  "Risk & Resilience",
  "Value & Cost",
  "Cross-Cutting",
] as const;

export const gccDimensionColors: Record<string, string> = {
  "Strategic Alignment to HQ": "teal",
  "Governance & Empowerment": "indigo",
  "Service Portfolio": "violet",
  "Depth of Capability": "gold",
  "Digital Maturity": "coral",
  "Future-Ready Workforce": "teal",
  "Risk & Resilience": "indigo",
  "Value & Cost": "gold",
  "Cross-Cutting": "violet",
};

export const gccMetrics: GccMetric[] = [
  { metric: "Strategic Alignment Score", dimension: "Strategic Alignment to HQ", description: "Degree of integration with corporate OKRs and planning", matureBenchmark: "Co-creates strategy; India leaders on global committees (>80% alignment)", largeBenchmark: "70–85% OKR contribution", novartisInsight: "Contributes to core clinical operations; supports global drug development and care delivery as 'HQ Twin'", source: "Zinnov / KPMG / Playbook" },
  { metric: "Enterprise Strategy Co-Creation Index", dimension: "Strategic Alignment to HQ", description: "Frequency and depth of GCC input into HQ roadmaps", matureBenchmark: "Annual 3-year GCC plan integrated; standing committee seats", largeBenchmark: "Quarterly strategic reviews", novartisInsight: "Deep embedding in RCM workflows and operational strategy", source: "BCG / Zinnov" },
  { metric: "Cross-BU Collaboration Rate", dimension: "Strategic Alignment to HQ", description: "% of initiatives spanning multiple business units", matureBenchmark: ">70%", largeBenchmark: "50–65%", novartisInsight: "High across RCM, clinical operations, and analytics", source: "Industry benchmarks" },
  { metric: "Governance Maturity Index", dimension: "Governance & Empowerment", description: "Presence of GCC Charter, Leadership Council, autonomy tiers", matureBenchmark: "Two-Approval-Layer Rule; global P&L elements owned", largeBenchmark: "Formal council with defined escalation", novartisInsight: "High autonomy in clinical operations and innovation", source: "Playbook Levers / BCG" },
  { metric: "Decision Velocity", dimension: "Governance & Empowerment", description: "Average time from proposal to approval (days)", matureBenchmark: "Comparable to HQ (<7–14 days for mid-tier)", largeBenchmark: "10–21 days", novartisInsight: "Supports rapid claims processing and care delivery execution", source: "BCG" },
  { metric: "Autonomy Tier Coverage", dimension: "Governance & Empowerment", description: "% of decisions made locally", matureBenchmark: ">75%", largeBenchmark: "50–70%", novartisInsight: "High in RCM and operational workflows", source: "KPMG" },
  { metric: "Service Portfolio Breadth", dimension: "Service Portfolio", description: "Number of functions with end-to-end ownership", matureBenchmark: "Enterprise-wide + 2–4 global mandates", largeBenchmark: "8–12+ functions", novartisInsight: "RCM, clinical operations, analytics, coding, credentialing, population health, finance, HR (~9 functions)", source: "ANSR / Zinnov" },
  { metric: "Global Mandate Ownership", dimension: "Service Portfolio", description: "Number of enterprise-global processes owned", matureBenchmark: "2–4 domains", largeBenchmark: "1–3", novartisInsight: "Multiple in RCM and clinical documentation", source: "Playbook" },
  { metric: "Portfolio Optimization Rate", dimension: "Service Portfolio", description: "Annual sunset/sunrise reviews completed (%)", matureBenchmark: "100% with automation of low-value work", largeBenchmark: "80–90%", novartisInsight: "Ongoing evolution from support to innovation-driven operations", source: "BCG" },
  { metric: "Capability Depth Score", dimension: "Depth of Capability", description: "Expertise level and 'best-in-enterprise' recognition", matureBenchmark: "Patents filed; institutional knowledge repository", largeBenchmark: "Multiple CoEs", novartisInsight: "RCM analytics, CDI excellence, advanced population health modeling", source: "Zinnov" },
  { metric: "IP Generation Rate", dimension: "Depth of Capability", description: "Patents/process innovations per year", matureBenchmark: "5+ enterprise-contributing", largeBenchmark: "1–5", novartisInsight: "AI-driven denial prevention, ambient documentation, predictive diagnostics", source: "Industry reports" },
  { metric: "Domain Expertise Coverage", dimension: "Depth of Capability", description: "% of critical roles with advanced certification", matureBenchmark: ">80%", largeBenchmark: "60–75%", novartisInsight: "Strong in clinical coding, CDI, and compliance", source: "Deloitte" },
  { metric: "Cloud Adoption Rate", dimension: "Digital Maturity", description: "% of workloads on cloud", matureBenchmark: "≥70%", largeBenchmark: "60–80%", novartisInsight: "High; enables digital platforms for RCM and analytics", source: "BCG" },
  { metric: "Automation Penetration", dimension: "Digital Maturity", description: "% of processes automated (RPA+AI)", matureBenchmark: ">60–70%", largeBenchmark: "40–60%", novartisInsight: "High efficiency and automation in claims processing and billing", source: "Industry statements" },
  { metric: "AI-Native Index", dimension: "Digital Maturity", description: "% of AI initiatives reaching production", matureBenchmark: ">40%; AI agents in core processes", largeBenchmark: "25–40%", novartisInsight: "AI-driven denial prevention and ambient clinical documentation (e.g., 40% faster claim resolution)", source: "BCG / ZS" },
  { metric: "Digital Maturity Score", dimension: "Digital Maturity", description: "Overall technology enablement level (1–5 scale)", matureBenchmark: "4.5–5.0 (proprietary assets)", largeBenchmark: "3.5–4.5", novartisInsight: "Advanced in analytics, RCM automation, and digital health", source: "ANSR" },
  { metric: "Attrition Rate", dimension: "Future-Ready Workforce", description: "Annual voluntary turnover (%)", matureBenchmark: "<12–15%", largeBenchmark: "12–18%", novartisInsight: "Focus on talent pipeline and retention in specialized healthcare roles", source: "Standard benchmarks" },
  { metric: "eNPS / Engagement Score", dimension: "Future-Ready Workforce", description: "Net Promoter Score for employees", matureBenchmark: ">60", largeBenchmark: "50–65", novartisInsight: "Leadership-ready talent hub with strong engagement scores", source: "Industry reports" },
  { metric: "Internal/Global Mobility Rate", dimension: "Future-Ready Workforce", description: "% of employees moving roles/locations annually", matureBenchmark: ">20%", largeBenchmark: "15–25%", novartisInsight: "Talent development emphasized across GCC operations", source: "Zinnov" },
  { metric: "L&D Investment per Employee", dimension: "Future-Ready Workforce", description: "Annual spend (INR)", matureBenchmark: ">₹50,000", largeBenchmark: "₹30,000–50,000", novartisInsight: "Skills in AI, clinical coding, and digital health", source: "Playbook" },
  { metric: "Time-to-Productivity", dimension: "Future-Ready Workforce", description: "Months for new hires to full output", matureBenchmark: "<3 months", largeBenchmark: "3–6 months", novartisInsight: "Structured for complex RCM and clinical roles", source: "Qatalys" },
  { metric: "AI Literacy Coverage", dimension: "Future-Ready Workforce", description: "% of workforce with forward-looking skills assessment", matureBenchmark: "2–3 year forecast; >70% AI-literate baseline", largeBenchmark: "Annual assessment", novartisInsight: "High in data science, analytics, and AI-driven RCM teams", source: "BCG" },
  { metric: "BCP/DR Success Rate", dimension: "Risk & Resilience", description: "% of tests meeting targets", matureBenchmark: ">99%", largeBenchmark: "95–99%", novartisInsight: "Robust for global healthcare operations and claims processing", source: "Standard" },
  { metric: "Audit/Compliance Score", dimension: "Risk & Resilience", description: "Overall regulatory and internal audit rating (%)", matureBenchmark: ">95%", largeBenchmark: "90–95%", novartisInsight: "High in CDI, compliance, and HIPAA adherence", source: "KPMG" },
  { metric: "Risk Horizon Coverage", dimension: "Risk & Resilience", description: "Months of proactive scanning (5 domains)", matureBenchmark: "12–24 months; scenario planning", largeBenchmark: "6–12 months", novartisInsight: "Supports payer rule changes and regulatory shifts", source: "Playbook" },
  { metric: "Cost Savings vs Onshore", dimension: "Value & Cost", description: "% reduction in equivalent roles", matureBenchmark: "30–45%+ with productivity uplift", largeBenchmark: "35–50%", novartisInsight: "Significant scale efficiencies with 40% cost reduction for India-based operations", source: "Industry" },
  { metric: "ROI on AI/Digital Initiatives", dimension: "Value & Cost", description: "Multiple of return", matureBenchmark: "3.5×+", largeBenchmark: "2.5–4×", novartisInsight: "Demonstrated in claims acceleration and denial prevention", source: "BCG / Industry" },
  { metric: "Value Delivered Index", dimension: "Value & Cost", description: "Quantified business impact (revenue influence, TTM)", matureBenchmark: "Three-layer KPI dashboard to board", largeBenchmark: "Mix of operational + outcomes", novartisInsight: "Powers innovation; faster claims resolution and AR reduction", source: "ZS / Qatalys" },
  { metric: "Time-to-Market Acceleration", dimension: "Value & Cost", description: "% reduction in development cycles", matureBenchmark: "20–40%", largeBenchmark: "15–30%", novartisInsight: "AI-driven processes achieved 40% faster claim resolution in key programs", source: "Industry example" },
  { metric: "Innovation Contribution", dimension: "Value & Cost", description: "% of enterprise innovation pipeline supported", matureBenchmark: ">30–50%", largeBenchmark: "20–40%", novartisInsight: "Contributes to almost every operational efficiency initiative", source: "ANSR / Zinnov" },
  { metric: "Operational Excellence Metrics", dimension: "Value & Cost", description: "Composite: speed, accuracy, consistency, efficiency, automation", matureBenchmark: "Industry-leading (>95% first-time-right)", largeBenchmark: "High benchmarks in RCM operations", novartisInsight: "Explicitly tracked in RCM and clinical documentation functions", source: "ZS Interview" },
  { metric: "Overall Maturity Index", dimension: "Cross-Cutting", description: "Aggregate score across dimensions", matureBenchmark: "24/24 (100%) – Full Wave 4", largeBenchmark: "75–90% typical for scaled centers", novartisInsight: "Advanced Wave 4 characteristics (innovation engine)", source: "KPMG / Zinnov" },
  { metric: "Headcount Scale Efficiency", dimension: "Cross-Cutting", description: "Value per FTE (innovation output)", matureBenchmark: "High strategic leverage", largeBenchmark: "High at 1,000–10,000+ scale", novartisInsight: "India GCC FTEs deliver global mandates across RCM, analytics, and clinical operations", source: "Industry Reports" },
  { metric: "Sustainability/ESG Integration", dimension: "Cross-Cutting", description: "Alignment with corporate ESG targets", matureBenchmark: "97%+ compliance", largeBenchmark: "On track for 2025–2030 targets", novartisInsight: "Strong operational and supplier ESG metrics", source: "Industry Nonfinancial Reports" },
];

export const gccHighlightStats = [
  { value: "37", label: "Metrics Tracked" },
  { value: "9", label: "Dimensions" },
  { value: "500+", label: "Target GCC FTEs" },
  { value: "1,600+", label: "GCCs in India" },
  { value: "-40%", label: "Cost Reduction" },
  { value: "40%", label: "Faster Claims Resolution" },
];
