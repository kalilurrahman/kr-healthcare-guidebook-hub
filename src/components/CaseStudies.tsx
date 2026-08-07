import { motion } from "framer-motion";
import { Citation } from "@/components/Citation";
import { Building2, Activity, Landmark, Globe2, Stethoscope, ShieldCheck } from "lucide-react";

interface CaseStudy {
  icon: React.ElementType;
  archetype: string;
  setting: string;
  challenge: string;
  intervention: string;
  outcomes: { label: string; value: string }[];
  lesson: string;
  source: string;
}

// Composite, de-identified transformation patterns drawn from public case literature
// and industry benchmarking reports. Figures are directional ranges, not client data.
const cases: CaseStudy[] = [
  {
    icon: Building2,
    archetype: "Denial Prevention at an IDN",
    setting: "12-hospital integrated delivery network · $4.1B NPR",
    challenge: "Initial denial rate at 11.8%, with 34% of denials traced to eligibility and authorization defects at registration.",
    intervention: "Front-end eligibility automation, real-time authorization status checks and a payer-specific denial taxonomy feeding a weekly root-cause council.",
    outcomes: [
      { label: "Initial denial rate", value: "11.8% → 6.4%" },
      { label: "Clean claim rate", value: "88% → 96%" },
      { label: "Net revenue lift", value: "~1.4% NPR" },
    ],
    lesson: "Denials are a registration problem with a billing symptom. Fixing the back end alone caps improvement at roughly a third of the opportunity.",
    source: "HFMA",
  },
  {
    icon: Globe2,
    archetype: "GCC Stand-Up to Capability Centre",
    setting: "US payer-provider group · India GCC, 1,800 FTE",
    challenge: "Offshore centre stuck as a transactional back office — 82% of work in low-complexity queues, attrition at 31%.",
    intervention: "Capability-based operating model: clinical coding academies, product-aligned pods, and a two-in-a-box leadership pairing with onshore process owners.",
    outcomes: [
      { label: "High-complexity work", value: "18% → 47%" },
      { label: "Attrition", value: "31% → 17%" },
      { label: "Cost-to-collect", value: "3.4% → 2.6%" },
    ],
    lesson: "Retention follows career architecture, not compensation. Give the centre ownership of an outcome, not a queue.",
    source: "NASSCOM",
  },
  {
    icon: Stethoscope,
    archetype: "Ambient Documentation Rollout",
    setting: "Academic medical centre · 2,400 ambulatory clinicians",
    challenge: "Median 96 minutes of after-hours EHR time per clinician per day; burnout scores in the top quartile of national norms.",
    intervention: "Staged ambient-scribe deployment with a CDI review rubric, specialty-specific prompt templates and a monthly note-quality audit sample.",
    outcomes: [
      { label: "Pajama time", value: "−38 min/day" },
      { label: "Note turnaround", value: "< 4h for 91%" },
      { label: "Burnout index", value: "−21%" },
    ],
    lesson: "Ambient AI earns clinical trust through note quality audits, not throughput dashboards. Budget for the audit, or the pilot stalls at 30% adoption.",
    source: "KLAS",
  },
  {
    icon: Activity,
    archetype: "Value-Based Care Data Foundation",
    setting: "Risk-bearing physician group · 340K attributed lives",
    challenge: "Risk adjustment accuracy unknown; quality gap closure tracked in 14 disconnected spreadsheets across nine payer contracts.",
    intervention: "Unified attribution and gap-closure layer over claims plus clinical data, with a single prioritized worklist pushed into the point-of-care workflow.",
    outcomes: [
      { label: "Gap closure", value: "58% → 79%" },
      { label: "RAF accuracy", value: "+0.09 avg" },
      { label: "Shared savings", value: "First-year positive" },
    ],
    lesson: "Value-based economics are decided by data plumbing eighteen months before the settlement arrives.",
    source: "HCPLAN",
  },
  {
    icon: ShieldCheck,
    archetype: "Cyber Resilience After a Clearinghouse Outage",
    setting: "Regional health system · $900M NPR",
    challenge: "Six weeks of disrupted claims submission exposed a single-vendor dependency and 11 days of cash on hand.",
    intervention: "Dual-clearinghouse routing, offline eligibility fallback, a tested manual-claims runbook and treasury-linked resilience scenarios reported to the board quarterly.",
    outcomes: [
      { label: "Failover time", value: "6 weeks → 72h" },
      { label: "Days cash on hand", value: "11 → 46" },
      { label: "Tabletop cadence", value: "Quarterly" },
    ],
    lesson: "Resilience is a treasury metric. If the board only sees uptime, it is not seeing the actual exposure.",
    source: "AHA",
  },
  {
    icon: Landmark,
    archetype: "Prior Authorization Readiness for CMS-0057-F",
    setting: "Medicare Advantage plan · 1.1M members",
    challenge: "No reliable measurement of PA turnaround by service line; manual intake for 71% of requests.",
    intervention: "Electronic PA intake with FHIR-aligned data capture, gold-carding for low-variance providers and turnaround telemetry by service line and provider.",
    outcomes: [
      { label: "Standard decision", value: "9.4d → 3.1d" },
      { label: "Electronic intake", value: "29% → 84%" },
      { label: "Provider abrasion", value: "−33% calls" },
    ],
    lesson: "You cannot API your way out of an unmeasured process. Baseline telemetry is the first deliverable, not the last.",
    source: "CMS",
  },
];

export function CaseStudies() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Transformation Patterns in Practice</h2>
        <p className="font-body text-sm text-muted-foreground max-w-3xl">
          Six de-identified composite case patterns synthesised from public case literature and benchmarking reports.
          Figures are directional ranges intended for planning conversations — not audited client results.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cases.map((c, i) => (
          <motion.article
            key={c.archetype}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-pharma flex flex-col gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <c.icon className="w-4 h-4 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">{c.archetype}</h3>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{c.setting}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                <span className="font-mono text-[9px] uppercase tracking-wider text-coral mr-1">Challenge</span>
                {c.challenge}
              </p>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                <span className="font-mono text-[9px] uppercase tracking-wider text-teal mr-1">Intervention</span>
                {c.intervention}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {c.outcomes.map((o) => (
                <div key={o.label} className="rounded-lg bg-muted/30 border border-border p-2 text-center">
                  <div className="font-display text-xs font-bold text-foreground leading-tight">{o.value}</div>
                  <div className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider mt-1 leading-tight">{o.label}</div>
                </div>
              ))}
            </div>

            <p className="font-body text-xs text-foreground/90 italic leading-relaxed border-l-2 border-gold/60 pl-3">
              {c.lesson}
            </p>

            <div className="mt-auto pt-2 border-t border-border font-body text-[11px] text-muted-foreground">
              Benchmark basis: <Citation source={c.source} className="text-[11px]" />
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
