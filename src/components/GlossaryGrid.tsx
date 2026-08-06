import { useState, useMemo } from "react";
import { Search } from "lucide-react";

interface Term {
  term: string;
  expansion: string;
  definition: string;
  group: "RCM" | "Clinical" | "Payer" | "Data & AI" | "GCC";
}

// Curated working definitions — how these terms are actually used in operating reviews.
const terms: Term[] = [
  { term: "A/R Days", expansion: "Days in Accounts Receivable", definition: "Average days between service and cash collection. Top quartile sits below 35; every extra day is working capital parked in a payer queue.", group: "RCM" },
  { term: "CDI", expansion: "Clinical Documentation Integrity", definition: "The discipline of making documentation specific enough to justify acuity, severity and reimbursement. Ambient AI raises volume — CDI decides whether it raises quality.", group: "Clinical" },
  { term: "DNFB", expansion: "Discharged Not Final Billed", definition: "Accounts discharged but not yet billed. The clearest single indicator of coding capacity or documentation bottlenecks.", group: "RCM" },
  { term: "HCC", expansion: "Hierarchical Condition Category", definition: "Risk-adjustment coding model driving Medicare Advantage payment. Under-capture understates risk; over-capture invites RADV audit exposure.", group: "Payer" },
  { term: "MLR", expansion: "Medical Loss Ratio", definition: "Share of premium spent on care. Regulated floors (80/85%) mean payer margin improvement must come from admin efficiency, not underwriting alone.", group: "Payer" },
  { term: "TEFCA", expansion: "Trusted Exchange Framework and Common Agreement", definition: "The national floor for health information exchange, operationalised through designated QHINs.", group: "Data & AI" },
  { term: "USCDI", expansion: "United States Core Data for Interoperability", definition: "The standardised minimum data set every certified system must exchange; each version adds classes that widen analytics coverage.", group: "Data & AI" },
  { term: "DSI", expansion: "Decision Support Intervention", definition: "Any algorithm-driven prompt in a certified EHR. Predictive DSIs carry transparency obligations under HTI-1.", group: "Data & AI" },
  { term: "PA", expansion: "Prior Authorization", definition: "Payer pre-approval for services. CMS-0057-F compresses decisions to 72 hours expedited and 7 days standard from 2026.", group: "Payer" },
  { term: "VBC", expansion: "Value-Based Care", definition: "Payment tied to outcomes and total cost rather than volume. Roughly 42% of US spend now flows through some value-based arrangement.", group: "Payer" },
  { term: "ACO", expansion: "Accountable Care Organization", definition: "Provider group accountable for cost and quality of a defined population, typically under MSSP or a commercial equivalent.", group: "Payer" },
  { term: "GCC", expansion: "Global Capability Center", definition: "Wholly-owned offshore centre. Mature ones own outcomes and capabilities; immature ones own tickets.", group: "GCC" },
  { term: "FTE Leverage", expansion: "Full-Time-Equivalent Leverage", definition: "Ratio of automated to manual work in a process. The honest measure of automation ROI once licence and oversight cost are netted out.", group: "GCC" },
  { term: "Autonomous Coding", expansion: "—", definition: "Coding assigned and submitted with no human touch, gated by confidence thresholds. Measured by direct-to-bill rate, not accuracy alone.", group: "Clinical" },
  { term: "Clean Claim Rate", expansion: "—", definition: "Share of claims accepted on first submission without edit or rejection. Below 95% and denial spend becomes structural.", group: "RCM" },
  { term: "Cost to Collect", expansion: "—", definition: "Total revenue-cycle cost as a percentage of net patient revenue. The single number that survives every RCM business case review.", group: "RCM" },
];

const groups = ["All", "RCM", "Clinical", "Payer", "Data & AI", "GCC"] as const;

const groupColor: Record<Term["group"], string> = {
  RCM: "text-primary bg-primary/10",
  Clinical: "text-violet bg-violet/10",
  Payer: "text-indigo bg-indigo/10",
  "Data & AI": "text-teal bg-teal/10",
  GCC: "text-coral bg-coral/10",
};

export function GlossaryGrid() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof groups)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return terms.filter(
      (t) =>
        (group === "All" || t.group === group) &&
        (!q || t.term.toLowerCase().includes(q) || t.expansion.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
    );
  }, [query, group]);

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Working Glossary</h2>
        <p className="font-body text-sm text-muted-foreground max-w-2xl">
          Sixteen terms that recur in every healthcare transformation review — defined the way operators use them, not the way textbooks do.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            aria-label="Search glossary terms"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/30 border border-border text-xs font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider border transition-colors ${
              group === g ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((t) => (
          <div key={t.term} className="card-pharma">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display text-sm font-bold text-foreground">{t.term}</h3>
              <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider shrink-0 ${groupColor[t.group]}`}>{t.group}</span>
            </div>
            {t.expansion !== "—" && (
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{t.expansion}</div>
            )}
            <p className="font-body text-xs text-muted-foreground leading-relaxed">{t.definition}</p>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="font-body text-sm text-muted-foreground py-8 text-center">No terms match that search.</p>
      )}
    </div>
  );
}
