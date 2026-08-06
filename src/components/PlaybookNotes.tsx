import { motion } from "framer-motion";

interface Note {
  number: string;
  title: string;
  body: string;
  proof: string;
}

// Curated operating-model heuristics distilled from the handbook and public benchmark literature.
const notes: Note[] = [
  {
    number: "01",
    title: "Denials are a front-end disease treated in the back office",
    body: "Roughly two-thirds of initial denials trace to registration, eligibility and authorization defects created before the patient is seen. Every dollar of appeal capacity you add without fixing intake buys you a more expensive version of the same problem.",
    proof: "Rework costs ~$25 per professional claim and ~$181 per facility claim.",
  },
  {
    number: "02",
    title: "Automate the decision, not just the keystroke",
    body: "Screen-scraping bots plateau near 30% of the effort because the expensive part is judgement, not typing. Value shifts the moment a model can classify a denial, select an argument and cite the clinical evidence — with a human approving, not authoring.",
    proof: "Autonomous coding covers 17% of eligible volume; ambient scribes 22% — both roughly tripled year over year.",
  },
  {
    number: "03",
    title: "GCC maturity is measured in decisions owned, not FTEs seated",
    body: "The credible maturity ladder runs: execution → process ownership → outcome ownership → capability ownership. Headcount growth without a matching transfer of decision rights produces a costly offshore queue, not a capability centre.",
    proof: "India hosts 180+ healthcare GCCs; the top quartile owns P&L-linked KPIs, not SLAs.",
  },
  {
    number: "04",
    title: "Interoperability spend only pays back when it is workflow-adjacent",
    body: "FHIR endpoints that no clinician or adjudicator touches are compliance theatre. The endpoints that pay back are the ones sitting inside prior auth, referral, and payer-to-payer record pulls — where a data call removes a phone call.",
    proof: "72% of certified systems expose live FHIR endpoints; a minority are wired into revenue-bearing workflows.",
  },
  {
    number: "05",
    title: "Assume every AI output will be litigated, audited, or appealed",
    body: "Model registry, prompt and version logging, human-override capture and drift monitoring are not governance overhead — they are the evidence pack. Build them on day one; retrofitting provenance after a year of production traffic is not possible.",
    proof: "HTI-1 requires 31 source attributes for predictive decision support.",
  },
  {
    number: "06",
    title: "Cyber resilience is a revenue-cycle metric",
    body: "The 2024 clearinghouse outage showed that a single upstream failure can halt cash for weeks. Recovery time objective, payer-route redundancy and offline claim capture belong on the CFO dashboard beside days in A/R.",
    proof: "Median ransomware downtime 12.4 days; average healthcare breach cost $7.42M.",
  },
];

export function PlaybookNotes() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Operating Notes for the Board</h2>
        <p className="font-body text-sm text-muted-foreground max-w-2xl">
          Six hard-won principles that separate transformation programmes that compound from those that stall — each with the number that makes the case.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((n, i) => (
          <motion.article
            key={n.number}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-pharma flex gap-4"
          >
            <span className="font-display text-3xl font-bold text-primary/25 leading-none shrink-0">{n.number}</span>
            <div>
              <h3 className="font-display text-sm font-bold text-foreground mb-1.5">{n.title}</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">{n.body}</p>
              <p className="font-mono text-[10px] text-teal mt-3 pt-2 border-t border-border leading-relaxed">{n.proof}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
