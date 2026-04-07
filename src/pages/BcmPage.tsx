import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronRight, Building2, Layers, Cpu, Users, Shield, Cog, HeartPulse, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HealthcareFooter } from "@/components/HealthcareFooter";
import { bcmCapabilities, bcmDomains, bcmStats, type BcmCapability } from "@/data/bcm-data";

const domainIcons: Record<string, React.ReactNode> = {
  "Patient Access & Experience": <Users className="w-5 h-5" />,
  "Clinical Care Delivery": <HeartPulse className="w-5 h-5" />,
  "Clinical Support Services": <Layers className="w-5 h-5" />,
  "Population Health & Care Management": <Building2 className="w-5 h-5" />,
  "Health Information Management": <Shield className="w-5 h-5" />,
  "Operations & Facilities Management": <Cog className="w-5 h-5" />,
  "Enabling & Support Functions": <Cpu className="w-5 h-5" />,
};

const domainColors: Record<string, string> = {
  "Patient Access & Experience": "border-l-primary",
  "Clinical Care Delivery": "border-l-indigo",
  "Clinical Support Services": "border-l-violet",
  "Population Health & Care Management": "border-l-gold",
  "Health Information Management": "border-l-coral",
  "Operations & Facilities Management": "border-l-teal",
  "Enabling & Support Functions": "border-l-indigo",
};

function CapabilityCard({ cap }: { cap: BcmCapability }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className={`card-pharma border-l-4 ${domainColors[cap.domain] || "border-l-primary"} cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[10px] text-primary uppercase tracking-wider">{cap.domain}</span>
          <h3 className="font-display text-sm font-bold text-foreground mt-1">{cap.process}</h3>
          <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{cap.description}</p>
        </div>
        <div className="flex-shrink-0 pt-1">
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      <div className="flex gap-3 mt-3 flex-wrap">
        <span className="text-[10px] font-mono" title="Maturity H1">H1: {cap.maturityH1}</span>
        <span className="text-[10px] font-mono" title="Maturity H2">H2: {cap.maturityH2}</span>
        <span className="text-[10px] font-mono" title="Maturity H3">H3: {cap.maturityH3}</span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3 overflow-hidden"
          >
            <div>
              <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Tools & Technologies</span>
              <p className="font-body text-xs text-foreground mt-1">{cap.tools}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] text-coral uppercase tracking-wider">Challenges</span>
              <p className="font-body text-xs text-muted-foreground mt-1">{cap.challenges}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] text-teal uppercase tracking-wider">Opportunities</span>
              <p className="font-body text-xs text-muted-foreground mt-1">{cap.opportunities}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {[
                { label: "Enterprise", value: cap.largePlayers },
                { label: "Mid-Size", value: cap.midPlayers },
                { label: "Niche", value: cap.nichePlayers },
                { label: "Payer / Health Plan", value: cap.payerPlayers },
                { label: "Emerging / Digital-First", value: cap.emergingPlayers },
              ].map((seg) => (
                <div key={seg.label} className="p-2 rounded-lg bg-muted/50">
                  <span className="font-mono text-[9px] text-primary uppercase tracking-wider">{seg.label}</span>
                  <p className="font-body text-[11px] text-foreground mt-0.5 leading-relaxed">{seg.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BcmPage() {
  const [search, setSearch] = useState("");
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let caps = bcmCapabilities;
    if (activeDomain) caps = caps.filter((c) => c.domain === activeDomain);
    if (search.trim()) {
      const q = search.toLowerCase();
      caps = caps.filter(
        (c) =>
          c.process.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tools.toLowerCase().includes(q) ||
          c.largePlayers.toLowerCase().includes(q) ||
          c.emergingPlayers.toLowerCase().includes(q)
      );
    }
    return caps;
  }, [search, activeDomain]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="header-glass sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-xs hidden sm:inline">Home</span>
            </Link>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <h1 className="font-display text-sm font-bold text-foreground">Healthcare Business Capability Map</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <section className="gradient-hero py-16 px-6">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <span className="font-mono text-xs text-primary tracking-wider uppercase">BCM v3 · Full Edition</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Healthcare <span className="gradient-text">Business Capability Map</span>
          </h2>
          <p className="font-body text-muted-foreground mb-8">
            Comprehensive capability matrix spanning 7 domains, 36 business processes, maturity ratings, technology players, and competitive landscape across enterprise, mid-size, niche, payer, and emerging segments.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden glass-card max-w-xl mx-auto">
            {bcmStats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="p-4 text-center bg-background/5">
                <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4 flex-1">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search capabilities, tools, players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input-pharma pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveDomain(null)}
            className={`nav-pill text-xs ${!activeDomain ? "active" : ""}`}
          >
            All Domains
          </button>
          {bcmDomains.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(activeDomain === d ? null : d)}
              className={`nav-pill text-xs flex items-center gap-1.5 ${activeDomain === d ? "active" : ""}`}
            >
              {domainIcons[d]}
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-6 font-mono">
          {filtered.length} capabilit{filtered.length !== 1 ? "ies" : "y"}{activeDomain ? ` in ${activeDomain}` : ""}{search ? ` matching "${search}"` : ""}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((cap) => (
            <CapabilityCard key={cap.process} cap={cap} />
          ))}
        </div>
      </main>

      <HealthcareFooter />
    </div>
  );
}
