import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface TickerItem {
  label: string;
  value: string;
  trend?: "up" | "down" | "flat";
  source: string;
  /** Data vintage — REQUIRED so no signal is ever shown without a "as of" marker. */
  asOf: string;
}

// Curated industry signals — sourced from CMS NHE, CBO, McKinsey, Deloitte,
// KFF, Rock Health, HIMSS, WHO, and NASSCOM public reports (2023–2026).
// Values are curated literals, not a live feed; every item carries its vintage.
const signals: TickerItem[] = [
  { label: "US NHE 2024", value: "$5.3T", trend: "up", source: "CMS OACT", asOf: "2024" },
  { label: "NHE Growth CAGR", value: "5.6%", trend: "up", source: "CMS OACT", asOf: "2024–33" },
  { label: "NHE % of GDP", value: "18.0%", trend: "up", source: "CMS", asOf: "2024" },
  { label: "Global Health Market", value: "$12.8T", trend: "up", source: "WHO", asOf: "2023" },
  { label: "Hospital Op Margin", value: "3.9%", trend: "up", source: "Kaufman Hall", asOf: "2024" },
  { label: "EBITDA % of NHE", value: "8.9%", trend: "down", source: "McKinsey", asOf: "2024" },
  { label: "Medicare Advantage", value: "54%", trend: "up", source: "KFF", asOf: "2025" },
  { label: "VBC Spend Share", value: "42%", trend: "up", source: "HCPLAN", asOf: "2023" },
  { label: "MSSP ACOs Active", value: "476", trend: "up", source: "CMS", asOf: "2025" },
  { label: "Medicare ACO Lives", value: "11.2M", trend: "up", source: "CMS MSSP", asOf: "2025" },
  { label: "Denial Rate (Avg)", value: "11.8%", trend: "up", source: "Optum", asOf: "2024" },
  { label: "Prior-Auth Denials", value: "7.4%", trend: "up", source: "KFF MA", asOf: "2023" },
  { label: "Days in AR (Median)", value: "42.1", trend: "flat", source: "HFMA", asOf: "2024" },
  { label: "Digital Health VC", value: "$10.1B", trend: "down", source: "Rock Health", asOf: "2024" },
  { label: "AI in Health CAGR", value: "38.5%", trend: "up", source: "Grand View", asOf: "2024" },
  { label: "GenAI Adoption", value: "63%", trend: "up", source: "Deloitte", asOf: "2025" },
  { label: "Ambient AI Time Saved", value: "2h/shift", trend: "up", source: "Peer-review", asOf: "2024" },
  { label: "RN Vacancy Rate", value: "9.9%", trend: "down", source: "NSI", asOf: "2025" },
  { label: "Physician Shortage 2036", value: "86K", trend: "up", source: "AAMC", asOf: "2024" },
  { label: "Cybersecurity Breaches", value: "725", trend: "up", source: "HHS OCR", asOf: "2024" },
  { label: "Avg Breach Cost", value: "$7.42M", trend: "down", source: "IBM", asOf: "2025" },
  { label: "India GCC Headcount", value: "1.9M", trend: "up", source: "NASSCOM", asOf: "FY24" },
  { label: "HC GCCs in India", value: "180+", trend: "up", source: "NASSCOM", asOf: "FY24" },
  { label: "Telehealth CAGR", value: "24.3%", trend: "up", source: "M&M", asOf: "2024" },
  { label: "Hospital-at-Home Sites", value: "380+", trend: "up", source: "CMS Waiver", asOf: "2024" },
];

function TrendIcon({ trend }: { trend?: "up" | "down" | "flat" }) {
  if (trend === "up") return <TrendingUp className="w-3 h-3 text-primary" />;
  if (trend === "down") return <TrendingDown className="w-3 h-3 text-coral" />;
  return <Activity className="w-3 h-3 text-muted-foreground" />;
}

export function IndustryTicker() {
  const items = [...signals, ...signals];
  return (
    <div
      className="border-y border-border bg-muted/30 overflow-hidden relative"
      role="marquee"
      aria-label="Curated healthcare industry signals"
    >
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="flex items-center py-2 animate-marquee whitespace-nowrap w-max">
        {items.map((it, i) => (
          <div key={`${it.label}-${i}`} className="flex items-center gap-2 px-5 border-r border-border/50">
            <TrendIcon trend={it.trend} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{it.label}</span>
            <span className="font-display text-xs font-bold text-foreground">{it.value}</span>
            <span className="font-mono text-[9px] text-primary/70">· {it.source} · {it.asOf}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
