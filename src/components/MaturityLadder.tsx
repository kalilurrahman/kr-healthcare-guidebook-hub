import { motion } from "framer-motion";

interface Stage {
  level: string;
  name: string;
  share: string;
  colour: string;
  traits: string[];
  unlock: string;
}

// Five-stage maturity ladder for healthcare GCC / digital operating models.
// Distribution estimates are directional, drawn from published GCC maturity surveys.
const stages: Stage[] = [
  {
    level: "L1",
    name: "Arbitrage",
    share: "~18% of centres",
    colour: "text-muted-foreground",
    traits: ["Cost-per-FTE is the only scorecard", "Transactional queues, onshore owns the outcome", "Attrition above 30%"],
    unlock: "Publish an outcome metric the centre is accountable for — not a productivity metric.",
  },
  {
    level: "L2",
    name: "Standardisation",
    share: "~27% of centres",
    colour: "text-coral",
    traits: ["Documented SOPs and quality sampling", "SLAs on turnaround and accuracy", "First automation pilots in claims and eligibility"],
    unlock: "Move from SLA compliance to variance reduction; measure the tail, not the median.",
  },
  {
    level: "L3",
    name: "Optimisation",
    share: "~31% of centres",
    colour: "text-gold",
    traits: ["Process mining on end-to-end revenue cycle", "Automation covers 30–50% of transaction volume", "Certified coders and CDI capability in-centre"],
    unlock: "Give the centre design authority over the process it runs, not just execution rights.",
  },
  {
    level: "L4",
    name: "Capability Centre",
    share: "~17% of centres",
    colour: "text-teal",
    traits: ["Product-aligned pods with onshore two-in-a-box leadership", "Engineering, data science and clinical ops co-located", "Owns P&L-relevant KPIs end to end"],
    unlock: "Fund a build backlog owned by the centre; capability without a roadmap decays back to L3.",
  },
  {
    level: "L5",
    name: "Innovation Engine",
    share: "~7% of centres",
    colour: "text-primary",
    traits: ["Agentic workflows with governed autonomy tiers", "Model registry, drift monitoring and assurance reporting", "Centre originates enterprise strategy, not just delivery"],
    unlock: "Institutionalise assurance — at L5 the constraint is trust and governance, not talent or tooling.",
  },
];

export function MaturityLadder() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-2">The GCC Maturity Ladder</h2>
        <p className="font-body text-sm text-muted-foreground max-w-3xl">
          Most healthcare capability centres stall between standardisation and optimisation. Each rung has a specific
          unlock — the thing that must change before the next stage becomes reachable.
        </p>
      </div>
      <ol className="space-y-3">
        {stages.map((s, i) => (
          <motion.li
            key={s.level}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card-pharma grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-start"
          >
            <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-1 md:w-40">
              <span className={`font-display text-2xl font-bold ${s.colour}`}>{s.level}</span>
              <div>
                <div className="font-display text-sm font-bold text-foreground">{s.name}</div>
                <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{s.share}</div>
              </div>
            </div>
            <div>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                {s.traits.map((t) => (
                  <li key={t} className="font-body text-xs text-muted-foreground leading-relaxed rounded-lg bg-muted/25 border border-border p-2">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="font-body text-xs text-foreground/90 leading-relaxed">
                <span className="font-mono text-[9px] uppercase tracking-wider text-gold mr-1">Unlock</span>
                {s.unlock}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
