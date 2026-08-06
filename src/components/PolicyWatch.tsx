import { motion } from "framer-motion";
import { Citation } from "@/components/Citation";
import { CalendarClock, Gavel, ShieldAlert, Network, FileSearch } from "lucide-react";

interface PolicyItem {
  icon: React.ElementType;
  rule: string;
  effective: string;
  who: string;
  impact: string;
  action: string;
  source: string;
}

// Curated from public rule texts and agency fact sheets (CMS, ONC/ASTP, HHS OCR, EU).
const items: PolicyItem[] = [
  {
    icon: CalendarClock,
    rule: "CMS-0057-F · Interoperability & Prior Authorization",
    effective: "1 Jan 2026 (decision timelines) · 2027 (APIs)",
    who: "MA, Medicaid, CHIP, QHP issuers",
    impact: "72-hour expedited / 7-day standard PA decisions, public denial-rate reporting, mandated Patient, Provider and Payer-to-Payer FHIR APIs.",
    action: "Instrument PA turnaround telemetry now; a 2027 API build with no 2026 baseline data is unauditable.",
    source: "CMS Final Rule, Jan 2024",
  },
  {
    icon: Network,
    rule: "TEFCA · QHIN Exchange at Scale",
    effective: "Rolling — 8+ designated QHINs",
    who: "Health systems, payers, HIEs",
    impact: "Nationwide query-based exchange moves from voluntary pilots to the default path for treatment, payment and individual access.",
    action: "Decide QHIN affiliation and retire point-to-point interfaces that duplicate TEFCA flows.",
    source: "ASTP/ONC",
  },
  {
    icon: ShieldAlert,
    rule: "HIPAA Security Rule NPRM (proposed modernization)",
    effective: "Proposed Jan 2025 · finalization pending",
    who: "All covered entities & business associates",
    impact: "Removes 'addressable' safeguards — MFA, encryption at rest/in transit, asset inventory and 72-hour restoration become mandatory.",
    action: "Treat the NPRM as the floor: close MFA and asset-inventory gaps before enforcement, not after.",
    source: "HHS OCR",
  },
  {
    icon: Gavel,
    rule: "HTI-1 / HTI-2 · Algorithm Transparency (DSI)",
    effective: "DSI source attributes live since 2025",
    who: "Certified EHR developers and their customers",
    impact: "31 source attributes must be surfaced for predictive Decision Support Interventions — provenance, validation, fairness and intended use.",
    action: "Maintain a model registry per deployed algorithm; your EHR vendor will ask for it, and so will your board.",
    source: "ASTP/ONC HTI rules",
  },
  {
    icon: FileSearch,
    rule: "EU AI Act · High-Risk Obligations",
    effective: "Phased through Aug 2026–2027",
    who: "Anyone placing AI on the EU market, incl. GCC-built models",
    impact: "Most clinical and triage AI lands in the high-risk tier: risk management, data governance, logging, human oversight and post-market monitoring.",
    action: "GCCs building models for EU entities inherit provider obligations — map roles contractually before go-live.",
    source: "Regulation (EU) 2024/1689",
  },
];

export function PolicyWatch() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Policy &amp; Regulatory Watch</h2>
        <p className="font-body text-sm text-muted-foreground max-w-2xl">
          Five rules that reshape healthcare operating models through 2027 — what each mandates, who it binds, and the move to make before the deadline.
        </p>
      </div>
      <div className="space-y-3">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <motion.div
              key={it.rule}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-pharma border-l-[3px] border-l-gold flex flex-col sm:flex-row gap-4"
            >
              <div className="flex sm:flex-col items-center gap-2 sm:w-32 shrink-0">
                <div className="p-2 rounded-xl bg-gold/10"><Icon className="w-5 h-5 text-gold" /></div>
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider sm:text-center leading-tight">{it.effective}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-sm font-bold text-foreground">{it.rule}</h3>
                <div className="font-mono text-[10px] text-primary uppercase tracking-wider mt-0.5 mb-2">Applies to · {it.who}</div>
                <p className="font-body text-xs text-muted-foreground leading-relaxed mb-2">{it.impact}</p>
                <p className="font-body text-xs text-teal leading-relaxed">
                  <span className="font-mono text-[10px] uppercase tracking-wider">Do now · </span>{it.action}
                </p>
                <span className="font-mono text-[10px] text-muted-foreground/70 block mt-2">Source · <Citation source={it.source} /></span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
