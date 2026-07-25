import { motion } from "framer-motion";
import { ExternalLink, BookOpen, LineChart, Brain, ShieldCheck, Globe2, Hospital } from "lucide-react";

interface Insight {
  icon: React.ElementType;
  category: string;
  headline: string;
  stat: string;
  detail: string;
  source: string;
  href: string;
}

// Curated from primary/official sources. Links open publicly available briefs.
const insights: Insight[] = [
  {
    icon: LineChart,
    category: "Macro",
    headline: "National Health Expenditure — CMS OACT Projections 2024–2033",
    stat: "$8.6T by 2033",
    detail: "CMS actuaries project NHE to grow at 5.6% CAGR, outpacing GDP (4.3%), reaching 20.3% of GDP by 2033.",
    source: "CMS Office of the Actuary",
    href: "https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data/nhe-fact-sheet",
  },
  {
    icon: Hospital,
    category: "Providers",
    headline: "Kaufman Hall National Hospital Flash Report",
    stat: "3.9% median op margin",
    detail: "Operating margins stabilized in 2025 after two years of losses, but 40% of hospitals still operate below breakeven.",
    source: "Kaufman Hall 2025",
    href: "https://www.kaufmanhall.com/insights/research-report/national-hospital-flash-report",
  },
  {
    icon: Brain,
    category: "AI",
    headline: "Deloitte 2025 Health Care Outlook — GenAI at Scale",
    stat: "63% adopting GenAI",
    detail: "Ambient documentation, prior-auth automation and coding co-pilots dominate deployed use cases; ROI now measurable in FTE hours.",
    source: "Deloitte Insights 2025",
    href: "https://www2.deloitte.com/us/en/insights/industry/health-care/health-care-industry-outlook.html",
  },
  {
    icon: ShieldCheck,
    category: "Payer",
    headline: "KFF Medicare Advantage Enrollment Report",
    stat: "54% of Medicare",
    detail: "MA enrollment reached 34.1M in 2025 — more than half of eligible Medicare beneficiaries; risk-based capabilities are table stakes.",
    source: "Kaiser Family Foundation",
    href: "https://www.kff.org/medicare/issue-brief/medicare-advantage-in-2025-enrollment-update-and-key-trends/",
  },
  {
    icon: BookOpen,
    category: "Digital Health",
    headline: "Rock Health Digital Health Funding Recap",
    stat: "$10.1B in 2024",
    detail: "Funding stabilized after the 2022–23 reset. AI-native startups captured 40% of dollars; RCM automation led verticals.",
    source: "Rock Health",
    href: "https://rockhealth.com/insights/2024-year-end-market-overview-a-turning-point-in-digital-health/",
  },
  {
    icon: Globe2,
    category: "GCC",
    headline: "NASSCOM GCC Landscape — Healthcare & Life Sciences",
    stat: "180+ HC GCCs",
    detail: "India hosts 180+ healthcare-focused Global Capability Centers employing ~1.9M professionals — 24% CAGR through 2028.",
    source: "NASSCOM 2024",
    href: "https://nasscom.in/knowledge-center/publications/india-global-capability-centers-landscape-report-fy2024",
  },
];

const categoryColor: Record<string, string> = {
  Macro: "text-primary bg-primary/10",
  Providers: "text-teal bg-teal/10",
  AI: "text-violet bg-violet/10",
  Payer: "text-indigo bg-indigo/10",
  "Digital Health": "text-gold bg-gold/10",
  GCC: "text-coral bg-coral/10",
};

export function CuratedSignals() {
  return (
    <div>
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Curated Industry Signals</h2>
          <p className="font-body text-sm text-muted-foreground max-w-2xl">
            Six datapoints hand-picked from primary, non-paywalled sources — CMS, KFF, Deloitte, Kaufman Hall, Rock Health and NASSCOM — refreshed for the 2026 edition.
          </p>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Curated by Kalilur Rahman</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((it, i) => {
          const Icon = it.icon;
          return (
            <motion.a
              key={it.headline}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-pharma group no-underline flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider ${categoryColor[it.category] ?? "text-primary bg-primary/10"}`}>
                  <Icon className="w-3 h-3" /> {it.category}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="font-display text-2xl font-bold text-foreground leading-tight">{it.stat}</div>
              <h3 className="font-display text-sm font-semibold text-foreground leading-snug">{it.headline}</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">{it.detail}</p>
              <span className="font-mono text-[10px] text-primary/80 mt-auto pt-2 border-t border-border">Source · {it.source}</span>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
