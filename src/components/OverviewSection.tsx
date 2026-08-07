import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, BarChart3, Layers, Download, TrendingUp, Users, Shield, Cpu, Gauge, FileText, ClipboardCheck, ShieldCheck, Bot, CalendarClock } from "lucide-react";
import { transformationPillars } from "@/data/healthcare-data";
import { CuratedSignals } from "@/components/CuratedSignals";
import { LeaderQuotes } from "@/components/LeaderQuotes";
import { MetricsDeepDive } from "@/components/MetricsDeepDive";
import { PolicyWatch } from "@/components/PolicyWatch";
import { PlaybookNotes } from "@/components/PlaybookNotes";
import { GlossaryGrid } from "@/components/GlossaryGrid";
import { CaseStudies } from "@/components/CaseStudies";
import { MaturityLadder } from "@/components/MaturityLadder";
import { ReadingList } from "@/components/ReadingList";

interface OverviewSectionProps {
  onChapterSelect: (chapterId: string) => void;
  onNavigateResources?: () => void;
}

interface IndustryStat {
  value: string;
  label: string;
  color: string;
  /** Data vintage — REQUIRED so the headline stat bar never shows an undated figure. */
  asOf: string;
}

const industryStats: IndustryStat[] = [
  { value: "$5.3T", label: "US NHE 2024", color: "text-primary", asOf: "CMS · 2024" },
  { value: "$12.8T", label: "Global Market", color: "text-gold", asOf: "WHO · 2023" },
  { value: "5", label: "Healthcare Domains", color: "text-violet", asOf: "Taxonomy" },
  { value: "60%", label: "AI Adoption", color: "text-coral", asOf: "Deloitte · 2025" },
  { value: "42%", label: "VBC Spending", color: "text-teal", asOf: "HCPLAN · 2023" },
  { value: "450K", label: "Workforce Gaps", color: "text-indigo", asOf: "AAMC/NSI · 2024" },
];

const domainHighlights = [
  { icon: "🏥", title: "Healthcare Providers", stat: "$1.5T US Acute Care", desc: "Hospital systems, ASCs, physician practices — consolidating into IDNs across the care continuum." },
  { icon: "🛡️", title: "Health Insurance Payers", stat: "Top 5 = 50% Market", desc: "Commercial insurers, Medicare Advantage, Medicaid — managing $4T+ in annual claims." },
  { icon: "💊", title: "PBM & Pharmacy", stat: "Top 3 = 80% Market", desc: "Pharmacy benefit managers, specialty pharmacy, formulary management driving drug cost outcomes." },
  { icon: "🤝", title: "Care Delivery Orgs", stat: "476 ACOs Active", desc: "ACOs, PCMHs, and risk-bearing entities driving value-based care adoption across 11.2M+ MSSP beneficiaries." },
  { icon: "🧠", title: "Specialized Services", stat: "28% Telehealth CAGR", desc: "Behavioral health, home health, telehealth, hospice — the fastest-growing segments." },
];

export function OverviewSection({ onChapterSelect, onNavigateResources }: OverviewSectionProps) {
  return (
    <div className="space-y-12">
      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 sm:grid-cols-6 gap-px rounded-2xl overflow-hidden glass-card"
      >
        {industryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 sm:p-5 text-center bg-background/5 backdrop-blur-sm"
          >
            <div className={`font-display text-lg sm:text-xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider leading-tight">{stat.label}</div>
            <div className="font-mono text-[7px] text-muted-foreground/60 mt-1 tracking-wide">{stat.asOf}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* AI-native interactive tools */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">New · Free</span>
          <h2 className="font-display text-base font-bold text-foreground">AI-Native Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            to="/diagnostic"
            className="group flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-colors p-5 no-underline"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10"><Gauge className="w-5 h-5 text-primary" /></div>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-foreground mb-0.5">RCM &amp; GCC Maturity Diagnostic</h3>
              <p className="font-body text-xs text-muted-foreground">Score your revenue cycle, AI &amp; operating model vs. best-in-class benchmarks — roadmap in two minutes.</p>
            </div>
          </Link>
          <Link
            to="/appeal-forge"
            className="group flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-colors p-5 no-underline"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10"><FileText className="w-5 h-5 text-primary" /></div>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-foreground mb-0.5">AppealForge</h3>
              <p className="font-body text-xs text-muted-foreground">Turn a denial code into a payer-specific, clinically-argued appeal letter in seconds — no PHI leaves your browser.</p>
            </div>
          </Link>
          <Link
            to="/note-qa"
            className="group flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-colors p-5 no-underline"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10"><ClipboardCheck className="w-5 h-5 text-primary" /></div>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-foreground mb-0.5">Ambient Note QA Scorecard</h3>
              <p className="font-body text-xs text-muted-foreground">Grade an ambient-scribe note against a CDI/coding rubric — specificity gaps, safety flags, fixes.</p>
            </div>
          </Link>
          <Link
            to="/agentops"
            className="group flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-colors p-5 no-underline"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10"><Bot className="w-5 h-5 text-primary" /></div>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-foreground mb-0.5">AgentOps GCC Launch</h3>
              <p className="font-body text-xs text-muted-foreground">Pick RCM workflows and autonomy — get a risk-capped launch plan, PDD outline, and go-live KPIs.</p>
            </div>
          </Link>
          <Link
            to="/pa-accelerate"
            className="group flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-colors p-5 no-underline"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10"><CalendarClock className="w-5 h-5 text-primary" /></div>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-foreground mb-0.5">PA-Accelerate</h3>
              <p className="font-body text-xs text-muted-foreground">Score your prior-auth operation against CMS-0057-F, and build a payer-ready PA request packet.</p>
            </div>
          </Link>
          <Link
            to="/ai-assurance"
            className="group flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-colors p-5 no-underline"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10"><ShieldCheck className="w-5 h-5 text-primary" /></div>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-foreground mb-0.5">AI Assurance · ACUITAS™</h3>
              <p className="font-body text-xs text-muted-foreground">Govern agentic AI against the 7 pillars — score your assurance level and close the gaps.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards — prominent */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Link to="/reader" className="card-pharma group flex flex-col items-center gap-3 text-center no-underline hover:border-primary/50 transition-colors p-5">
          <div className="p-3 rounded-xl bg-primary/10">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground mb-0.5">Online Reader</h3>
            <p className="font-body text-[10px] text-muted-foreground">23 Chapters · 9 Parts</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
        <Link to="/gcc-metrics" className="card-pharma group flex flex-col items-center gap-3 text-center no-underline hover:border-primary/50 transition-colors p-5">
          <div className="p-3 rounded-xl bg-gold/10">
            <BarChart3 className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground mb-0.5">GCC Metrics</h3>
            <p className="font-body text-[10px] text-muted-foreground">34 Benchmarks · 9 Dimensions</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
        <Link to="/regulatory" className="card-pharma group flex flex-col items-center gap-3 text-center no-underline hover:border-primary/50 transition-colors p-5">
          <div className="p-3 rounded-xl bg-teal/10">
            <Shield className="w-6 h-6 text-teal" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground mb-0.5">Regulatory Calendar</h3>
            <p className="font-body text-[10px] text-muted-foreground">2026–27 · 5 Rules</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
        <Link to="/bcm" className="card-pharma group flex flex-col items-center gap-3 text-center no-underline hover:border-primary/50 transition-colors p-5">
          <div className="p-3 rounded-xl bg-indigo/10">
            <Layers className="w-6 h-6 text-indigo" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground mb-0.5">Capability Map</h3>
            <p className="font-body text-[10px] text-muted-foreground">7 Domains · 30 Processes</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
        <button
          onClick={onNavigateResources}
          className="card-pharma group flex flex-col items-center gap-3 text-center hover:border-primary/50 transition-colors p-5"
        >
          <div className="p-3 rounded-xl bg-coral/10">
            <Download className="w-6 h-6 text-coral" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground mb-0.5">Resources</h3>
            <p className="font-body text-[10px] text-muted-foreground">PDF · DOCX · XLSX · HTML</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Five-Domain Healthcare Ecosystem */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">The Five-Domain Healthcare Ecosystem</h2>
        <p className="font-body text-sm text-muted-foreground mb-6">Comprehensive coverage of every major healthcare sector — from providers and payers to PBMs, care delivery organizations, and specialized services.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {domainHighlights.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card-pharma"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{d.icon}</span>
                <span className="font-mono text-[10px] text-primary tracking-wider">{d.stat}</span>
              </div>
              <h3 className="font-display text-sm font-bold text-foreground mb-1">{d.title}</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Curated Industry Signals — sourced from CMS, KFF, Deloitte, Kaufman Hall, Rock Health, NASSCOM */}
      <CuratedSignals />

      {/* Digital Transformation Pillars */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-6">Digital Transformation Pillars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {transformationPillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card-pharma"
            >
              <div className="text-2xl mb-2">{p.icon}</div>
              <h3 className="font-display text-sm font-bold text-foreground mb-1">{p.title}</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benchmarks deep-dive — curated KPIs */}
      <MetricsDeepDive />

      {/* Policy & regulatory watch */}
      <PolicyWatch />

      {/* Maturity ladder */}
      <MaturityLadder />

      {/* Operating notes for the board */}
      <PlaybookNotes />

      {/* Transformation case patterns */}
      <CaseStudies />

      {/* Curated leadership quotes */}
      <LeaderQuotes />

      {/* Working glossary */}
      <GlossaryGrid />

      {/* Primary-source reading list */}
      <ReadingList />





      {/* Key Market Dynamics — from merged content */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-2xl">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Key Market Dynamics · 2025–2026</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, label: "Consolidation", stat: "90%", desc: "of hospital markets highly concentrated (HHI >2,500)" },
            { icon: Users, label: "Value-Based Care", stat: "42%", desc: "of healthcare spending now in value-based models" },
            { icon: Cpu, label: "Digital Health", stat: "$38B+", desc: "invested globally in digital health (2024)" },
            { icon: Shield, label: "Compliance Cost", stat: "5–8%", desc: "of operating budgets spent on regulatory compliance" },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl bg-muted/30 border border-border">
              <item.icon className="w-5 h-5 text-primary mb-2" />
              <div className="font-display text-xl font-bold text-foreground">{item.stat}</div>
              <div className="font-mono text-[10px] text-primary uppercase tracking-wider mb-1">{item.label}</div>
              <p className="font-body text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Healthcare Value Chain (simplified) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-2xl overflow-x-auto">
        <h2 className="font-display text-lg font-bold text-foreground mb-4 text-center">Healthcare Digital Value Chain</h2>
        <svg viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto" style={{ minWidth: 400 }}>
          {[
            { x: 10, label: "Patient\nAccess", fill: "hsl(172,83%,32%)" },
            { x: 93, label: "Clinical\nCare", fill: "hsl(263,70%,58%)" },
            { x: 176, label: "Coding\n& CDI", fill: "hsl(244,58%,42%)" },
            { x: 259, label: "Claims\n& Billing", fill: "hsl(215,20%,65%)" },
            { x: 342, label: "Denials\nMgmt", fill: "hsl(38,90%,43%)" },
            { x: 425, label: "Payment\nPosting", fill: "hsl(346,84%,50%)" },
            { x: 508, label: "Analytics\n& AI", fill: "hsl(172,83%,32%)" },
          ].map((seg, i) => (
            <g key={i}>
              <polygon
                points={`${seg.x},10 ${seg.x + 78},10 ${seg.x + 88},45 ${seg.x + 78},80 ${seg.x},80 ${seg.x + 10},45`}
                fill={seg.fill}
                opacity={0.9}
              />
              {seg.label.split("\n").map((line, li) => (
                <text key={li} x={seg.x + 44} y={38 + li * 16} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                  {line}
                </text>
              ))}
            </g>
          ))}
          <line x1="10" y1="100" x2="590" y2="100" stroke="hsl(172,83%,32%)" strokeWidth="2.5" />
          <text x="300" y="115" textAnchor="middle" fontSize="9" fill="hsl(172,83%,32%)" fontWeight="bold">
            UNIFIED DIGITAL THREAD · END-TO-END REVENUE CYCLE &amp; CARE MANAGEMENT
          </text>
        </svg>
      </motion.div>
    </div>
  );
}