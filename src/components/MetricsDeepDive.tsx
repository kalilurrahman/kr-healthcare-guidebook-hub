import { motion } from "framer-motion";

interface MetricRow {
  label: string;
  now: string;
  prior: string;
  benchmark: string;
  source: string;
}

interface MetricBlock {
  title: string;
  subtitle: string;
  rows: MetricRow[];
}

// Curated, non-paywalled benchmarks — CMS, HFMA, NSI Nursing, KFF, Change Healthcare,
// Kaufman Hall, IBM Cost of a Breach, Deloitte, Rock Health (2024–2025 vintage).
const blocks: MetricBlock[] = [
  {
    title: "Revenue Cycle Health",
    subtitle: "Median performance vs. top-quartile — US acute care, 2024",
    rows: [
      { label: "Initial Denial Rate", now: "11.8%", prior: "10.2%", benchmark: "< 5.0%", source: "Change Healthcare" },
      { label: "Days in A/R", now: "42.1", prior: "40.8", benchmark: "< 35", source: "HFMA MAP Keys" },
      { label: "Clean Claim Rate", now: "84%", prior: "85%", benchmark: "> 95%", source: "HFMA" },
      { label: "Cost to Collect", now: "3.4%", prior: "3.1%", benchmark: "< 2.5%", source: "Advisory Board" },
      { label: "POS Cash Collections", now: "0.32%", prior: "0.29%", benchmark: "> 0.50%", source: "HFMA" },
    ],
  },
  {
    title: "Workforce & Operations",
    subtitle: "US hospital labor benchmarks",
    rows: [
      { label: "RN Vacancy Rate", now: "9.9%", prior: "10.0%", benchmark: "< 7.5%", source: "NSI 2025" },
      { label: "RN Turnover", now: "18.3%", prior: "22.7%", benchmark: "< 15%", source: "NSI 2025" },
      { label: "Contract Labor % Total", now: "5.2%", prior: "9.4%", benchmark: "< 4%", source: "Kaufman Hall" },
      { label: "Length of Stay (Adj.)", now: "5.1 days", prior: "5.3 days", benchmark: "< 4.7", source: "Kaufman Hall" },
      { label: "ED Boarding Time", now: "6.4 hr", prior: "5.9 hr", benchmark: "< 4 hr", source: "ACEP 2024" },
    ],
  },
  {
    title: "AI & Digital Adoption",
    subtitle: "Enterprise deployment maturity, 2025",
    rows: [
      { label: "GenAI in Production", now: "63%", prior: "38%", benchmark: "n/a", source: "Deloitte 2025" },
      { label: "Ambient Scribe Coverage", now: "22%", prior: "6%", benchmark: "n/a", source: "KLAS 2025" },
      { label: "Autonomous Coding Use", now: "17%", prior: "8%", benchmark: "n/a", source: "AAPC" },
      { label: "AI Prior-Auth Automation", now: "34%", prior: "19%", benchmark: "n/a", source: "AHIP 2024" },
      { label: "FHIR API Live Endpoints", now: "72%", prior: "51%", benchmark: "100%", source: "ONC" },
    ],
  },
  {
    title: "Risk, Security & Compliance",
    subtitle: "Breach cost and cyber exposure",
    rows: [
      { label: "Avg Breach Cost", now: "$10.9M", prior: "$10.1M", benchmark: "< $6M", source: "IBM 2024" },
      { label: "OCR Reported Breaches", now: "725", prior: "677", benchmark: "n/a", source: "HHS OCR" },
      { label: "Records Exposed", now: "133M", prior: "88M", benchmark: "n/a", source: "HHS OCR" },
      { label: "Ransomware Downtime", now: "12.4 days", prior: "10.1 days", benchmark: "< 3 days", source: "Sophos 2024" },
      { label: "MFA Coverage (EHR access)", now: "78%", prior: "61%", benchmark: "100%", source: "HIMSS" },
    ],
  },
];

function badge(value: string, benchmark: string) {
  if (benchmark === "n/a") return "text-muted-foreground";
  const num = parseFloat(value);
  const bench = parseFloat(benchmark.replace(/[<>~]/g, ""));
  if (isNaN(num) || isNaN(bench)) return "text-foreground";
  const goodWhenLower = benchmark.trim().startsWith("<");
  const meets = goodWhenLower ? num <= bench : num >= bench;
  return meets ? "text-teal" : "text-coral";
}

export function MetricsDeepDive() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Benchmarks Deep-Dive</h2>
        <p className="font-body text-sm text-muted-foreground max-w-2xl">
          Twenty operational KPIs across revenue cycle, workforce, AI adoption and cyber risk — with prior-year comparison, top-quartile benchmark and primary source.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {blocks.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-pharma p-0 overflow-hidden"
          >
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-display text-sm font-bold text-foreground">{b.title}</h3>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{b.subtitle}</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left font-mono text-[9px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="p-2 pl-4">Metric</th>
                  <th className="p-2 text-right">Now</th>
                  <th className="p-2 text-right hidden sm:table-cell">Prior</th>
                  <th className="p-2 text-right">Benchmark</th>
                  <th className="p-2 pr-4 text-right hidden md:table-cell">Source</th>
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, idx) => (
                  <tr key={r.label} className={idx % 2 === 0 ? "bg-transparent" : "bg-muted/10"}>
                    <td className="p-2 pl-4 font-body text-foreground">{r.label}</td>
                    <td className={`p-2 text-right font-display font-bold ${badge(r.now, r.benchmark)}`}>{r.now}</td>
                    <td className="p-2 text-right font-mono text-muted-foreground hidden sm:table-cell">{r.prior}</td>
                    <td className="p-2 text-right font-mono text-primary">{r.benchmark}</td>
                    <td className="p-2 pr-4 text-right font-mono text-[10px] text-muted-foreground hidden md:table-cell">{r.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ))}
      </div>

      <p className="font-mono text-[10px] text-muted-foreground mt-4">
        Green = meets or beats top-quartile benchmark · Coral = gap to close · Sources: HFMA MAP Keys, Change Healthcare Denials Index, Kaufman Hall Flash Report, NSI Nursing Solutions, KLAS Research, Deloitte, AHIP, ONC, HHS OCR, IBM Cost of a Data Breach, Sophos State of Ransomware.
      </p>
    </div>
  );
}
