import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Gavel, ChevronDown, CalendarDays, Building2, ExternalLink, HelpCircle, Globe2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HealthcareFooter } from "@/components/HealthcareFooter";
import { regulations, regStatusMeta, calendarEntries, verifiedAsOf, type RegStatus } from "@/data/regulatory-data";
import { useSeo, routeSeo } from "@/lib/seo";

const toneClass: Record<string, string> = {
  teal: "bg-teal/10 text-teal border-teal/30",
  gold: "bg-gold/10 text-gold border-gold/30",
  indigo: "bg-indigo/10 text-indigo border-indigo/30",
  coral: "bg-coral/10 text-coral border-coral/30",
};

const filters: { id: "all" | RegStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "in-effect", label: "In effect" },
  { id: "phasing", label: "Phasing in" },
  { id: "proposed-delayed", label: "Proposed" },
];

const RegulatoryPage = () => {
  useSeo(routeSeo.regulatory);
  const [open, setOpen] = useState<string | null>(regulations[0].id);
  const [filter, setFilter] = useState<"all" | RegStatus>("all");

  const shown = useMemo(
    () => (filter === "all" ? regulations : regulations.filter((r) => r.status === filter)),
    [filter]
  );
  const cal = useMemo(() => calendarEntries(), []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="header-glass sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-mono">
              <ArrowLeft className="w-4 h-4" /> Back to Handbook
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <Gavel className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-bold text-foreground hidden sm:inline">Regulatory Calendar 2026–2027</span>
              <span className="font-display text-sm font-bold text-foreground sm:hidden">Regulatory</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="gradient-hero py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <CalendarDays className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">{regulations.length} rules · {cal.length} dated obligations</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Regulatory <span className="gradient-text">Calendar</span>
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto mb-3">
            The rules actually binding US healthcare operations through 2027 — what each requires, what it does to the revenue cycle, where a capability centre fits, and the questions to put to your board.
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            Dates and status verified against primary sources · {verifiedAsOf}
          </p>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4 flex-1 max-w-4xl">
        {/* Timeline */}
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Timeline</h2>
        <div className="card-pharma mb-10 p-0 overflow-hidden">
          {cal.map((e, i) => {
            const past = e.iso <= "2026-07-25";
            return (
              <div key={`${e.reg.id}-${e.iso}-${i}`} className={`flex gap-4 px-4 py-3 ${i ? "border-t border-border" : ""}`}>
                <div className="flex flex-col items-center flex-shrink-0 w-24">
                  <span className={`font-mono text-[11px] font-bold ${past ? "text-muted-foreground" : "text-primary"}`}>{e.date}</span>
                  <span className={`mt-1 w-2 h-2 rounded-full ${past ? "bg-muted-foreground/40" : "bg-primary"}`} />
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-primary">{e.reg.short}</span>
                  <p className="font-body text-xs text-foreground">{e.what}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {filters.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`nav-pill text-xs ${filter === f.id ? "active" : ""}`}>
              {f.label} ({f.id === "all" ? regulations.length : regulations.filter((r) => r.status === f.id).length})
            </button>
          ))}
        </div>

        {/* Rules */}
        <div className="space-y-3">
          {shown.map((r) => {
            const isOpen = open === r.id;
            const meta = regStatusMeta[r.status];
            return (
              <div key={r.id} className="card-pharma p-0 overflow-hidden">
                <button onClick={() => setOpen(isOpen ? null : r.id)} aria-expanded={isOpen} className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${toneClass[meta.tone]}`}>{meta.label}</span>
                      <span className="font-mono text-[9px] text-muted-foreground">{r.domain}</span>
                    </div>
                    <h3 className="font-display text-sm font-bold text-foreground">{r.name}</h3>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{r.headline}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-4 border-t border-border space-y-4">
                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-wider text-primary mb-1.5">Key dates</div>
                          {r.keyDates.map((d) => (
                            <div key={d.iso} className="flex gap-3 font-body text-xs mb-1">
                              <span className="font-mono text-[11px] text-foreground w-24 flex-shrink-0">{d.date}</span>
                              <span className="text-muted-foreground">{d.what}</span>
                            </div>
                          ))}
                        </div>

                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">What it requires</div>
                          <ul className="space-y-1">
                            {r.requires.map((x) => <li key={x} className="font-body text-xs text-muted-foreground flex gap-2"><span className="text-primary">·</span>{x}</li>)}
                          </ul>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-lg bg-muted/40 border border-border p-3">
                            <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Revenue-cycle impact</div>
                            <p className="font-body text-xs text-foreground">{r.rcmImpact}</p>
                          </div>
                          <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
                            <div className="font-mono text-[9px] uppercase tracking-wider text-primary mb-1 flex items-center gap-1.5"><Globe2 className="w-3 h-3" /> GCC implication</div>
                            <p className="font-body text-xs text-foreground">{r.gccImplication}</p>
                          </div>
                        </div>

                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5"><HelpCircle className="w-3 h-3" /> Questions for the board</div>
                          <ul className="space-y-1">
                            {r.boardQuestions.map((q) => <li key={q} className="font-body text-xs text-muted-foreground flex gap-2"><span className="text-primary">→</span>{q}</li>)}
                          </ul>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {r.sources.map((s) => (
                            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-primary hover:underline inline-flex items-center gap-1">
                              {s.label} <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-xl border border-border bg-muted/30">
          <p className="font-mono text-[10px] text-muted-foreground">
            <Building2 className="w-3 h-3 inline mr-1" />
            Dates and status were verified against primary sources in {verifiedAsOf} and are provided for orientation, not legal advice. Regulatory timelines move — confirm against the cited source before acting.
          </p>
        </div>
      </main>

      <HealthcareFooter />
    </div>
  );
};

export default RegulatoryPage;
