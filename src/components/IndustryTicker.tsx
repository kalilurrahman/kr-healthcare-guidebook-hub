import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface TickerItem {
  label: string;
  value: string;
  trend?: "up" | "down" | "flat";
  source: string;
}

// Curated industry signals — sourced from CMS NHE, CBO, McKinsey, Deloitte,
// KFF, Rock Health, HIMSS, WHO, and NASSCOM public reports (2024–2026).
const signals: TickerItem[] = [
  { label: "US NHE 2024", value: "$5.3T", trend: "up", source: "CMS OACT" },
  { label: "NHE Growth CAGR", value: "5.6%", trend: "up", source: "CMS OACT" },
  { label: "NHE % of GDP", value: "18.0%", trend: "up", source: "CMS 2024" },
  { label: "Global Health Market", value: "$12.8T", trend: "up", source: "WHO" },
  { label: "Hospital Op Margin", value: "3.9%", trend: "up", source: "Kaufman Hall" },
  { label: "EBITDA % of NHE", value: "8.9%", trend: "down", source: "McKinsey 2024" },
  { label: "Medicare Advantage", value: "54%", trend: "up", source: "KFF" },
  { label: "VBC Spend Share", value: "42%", trend: "up", source: "HCPLAN" },
  { label: "MSSP ACOs Active", value: "476", trend: "up", source: "CMS 2025" },
  { label: "Medicare ACO Lives", value: "11.2M", trend: "up", source: "CMS MSSP 2025" },
  { label: "Denial Rate (Avg)", value: "11.8%", trend: "up", source: "Change HC" },
  { label: "Prior-Auth Denials", value: "7.4%", trend: "up", source: "KFF MA" },
  { label: "Days in AR (Median)", value: "42.1", trend: "flat", source: "HFMA" },
  { label: "Digital Health VC", value: "$10.1B", trend: "down", source: "Rock Health" },
  { label: "AI in Health CAGR", value: "38.5%", trend: "up", source: "Grand View" },
  { label: "GenAI Adoption", value: "63%", trend: "up", source: "Deloitte 2025" },
  { label: "Ambient AI Time Saved", value: "2h/shift", trend: "up", source: "Peer-review" },
  { label: "RN Vacancy Rate", value: "9.9%", trend: "down", source: "NSI 2025" },
  { label: "Physician Shortage 2036", value: "86K", trend: "up", source: "AAMC" },
  { label: "Cybersecurity Breaches", value: "725", trend: "up", source: "HHS OCR" },
  { label: "Avg Breach Cost", value: "$7.42M", trend: "down", source: "IBM 2025" },
  { label: "India GCC Headcount", value: "1.9M", trend: "up", source: "NASSCOM" },
  { label: "HC GCCs in India", value: "180+", trend: "up", source: "NASSCOM" },
  { label: "Telehealth CAGR", value: "24.3%", trend: "up", source: "MarketsandMarkets" },
  { label: "Hospital-at-Home Sites", value: "380+", trend: "up", source: "CMS Waiver" },
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
            <span className="font-mono text-[9px] text-primary/70">· {it.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
