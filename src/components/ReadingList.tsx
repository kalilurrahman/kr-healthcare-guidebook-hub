import { ExternalLink } from "lucide-react";

interface Reading {
  publisher: string;
  title: string;
  why: string;
  cadence: string;
  url: string;
}

// Curated primary-source reading list — the shortlist a healthcare DX leader should track.
const readings: Reading[] = [
  {
    publisher: "CMS",
    title: "National Health Expenditure Data",
    why: "The authoritative denominator for every US healthcare spend argument you will make.",
    cadence: "Annual · projections mid-year",
    url: "https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data",
  },
  {
    publisher: "Kaufman Hall",
    title: "National Hospital Flash Report",
    why: "Fastest read on operating margin, labour expense and length-of-stay direction.",
    cadence: "Monthly",
    url: "https://www.kaufmanhall.com/insights/research-report",
  },
  {
    publisher: "KFF",
    title: "Employer Health Benefits Survey",
    why: "Premium and cost-sharing trends that set the commercial pricing envelope.",
    cadence: "Annual · autumn",
    url: "https://www.kff.org/health-costs/report/employer-health-benefits-survey/",
  },
  {
    publisher: "HFMA",
    title: "MAP Keys — Revenue Cycle Metrics",
    why: "Consensus KPI definitions; use these before inventing internal metric variants.",
    cadence: "Continuous",
    url: "https://www.hfma.org/finance-and-business-strategy/map-keys/",
  },
  {
    publisher: "Rock Health",
    title: "Digital Health Funding Reports",
    why: "Where capital is flowing tells you which vendor categories will consolidate next.",
    cadence: "Quarterly",
    url: "https://rockhealth.com/insights/",
  },
  {
    publisher: "NASSCOM",
    title: "GCC Landscape Reports",
    why: "The reference dataset on India GCC headcount, maturity and talent economics.",
    cadence: "Annual",
    url: "https://nasscom.in/knowledge-center",
  },
  {
    publisher: "ASTP / ONC",
    title: "TEFCA & Certification Program Updates",
    why: "Interoperability obligations arrive here months before they hit your EHR roadmap.",
    cadence: "Rolling",
    url: "https://www.healthit.gov/topic/interoperability/policy/trusted-exchange-framework-and-common-agreement-tefca",
  },
  {
    publisher: "NIST",
    title: "AI Risk Management Framework",
    why: "The governance vocabulary regulators and auditors are converging on for clinical AI.",
    cadence: "Versioned",
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
  },
  {
    publisher: "AAMC",
    title: "Physician Workforce Projections",
    why: "Grounds the workforce-shortage case in modelled supply and demand, not anecdote.",
    cadence: "Annual",
    url: "https://www.aamc.org/data-reports/workforce",
  },
];

export function ReadingList() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Primary-Source Reading List</h2>
        <p className="font-body text-sm text-muted-foreground max-w-3xl">
          Nine sources worth a standing calendar slot. Track these directly and you will rarely be surprised by a
          consultant deck.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {readings.map((r) => (
          <a
            key={r.title}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-pharma group flex flex-col gap-2 no-underline hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-primary">{r.publisher}</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
            </div>
            <h3 className="font-display text-sm font-bold text-foreground leading-snug">{r.title}</h3>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">{r.why}</p>
            <div className="mt-auto pt-2 font-mono text-[9px] text-muted-foreground/70 uppercase tracking-wider">{r.cadence}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
