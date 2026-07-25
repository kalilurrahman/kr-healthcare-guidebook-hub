import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ChevronDown, Scale, AlertTriangle, FileCheck2, Gavel } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HealthcareFooter } from "@/components/HealthcareFooter";
import { LeadCapture } from "@/components/LeadCapture";
import { acuitasMeta, acuitasPillars, assuranceLevels, assuranceGates } from "@/data/ai-assurance-data";
import { useSeo, routeSeo } from "@/lib/seo";

const AiAssurancePage = () => {
  useSeo(routeSeo.aiAssurance);
  const [open, setOpen] = useState<string | null>(acuitasPillars[0].id);
  const [gates, setGates] = useState<Record<string, boolean>>({});
  const [showScore, setShowScore] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const toggleGate = useCallback((id: string) => {
    setGates((g) => ({ ...g, [id]: !g[id] }));
    setShowScore(false);
  }, []);

  const result = useMemo(() => {
    const met = assuranceGates.filter((g) => gates[g.id]).length;
    const total = assuranceGates.length;
    const pct = Math.round((met / total) * 100);
    const level =
      pct >= 90 ? 5 : pct >= 72 ? 4 : pct >= 50 ? 3 : pct >= 25 ? 2 : 1;

    const byPillar = acuitasPillars.map((p) => {
      const gs = assuranceGates.filter((g) => g.pillar === p.id);
      const m = gs.filter((g) => gates[g.id]).length;
      return { pillar: p, met: m, total: gs.length };
    });
    const weakest = byPillar.filter((b) => b.met < b.total);

    const summaryText = [
      `ACUITAS Assurance: Level ${level} — ${assuranceLevels.find((l) => l.level === level)?.name} (${met}/${total} gates met, ${pct}%)`,
      "",
      "By pillar:",
      ...byPillar.map((b) => `- ${b.pillar.letter} ${b.pillar.title}: ${b.met}/${b.total}`),
      ...(weakest.length ? ["", "Close first:", ...weakest.flatMap((b) =>
        assuranceGates.filter((g) => g.pillar === b.pillar.id && !gates[g.id]).map((g) => `- ${g.question}`))] : []),
    ].join("\n");

    return { met, total, pct, level, byPillar, weakest, summaryText };
  }, [gates]);

  const score = useCallback(() => {
    setShowScore(true);
    requestAnimationFrame(() => headingRef.current?.focus());
  }, []);

  return (
    <div className={`min-h-screen flex flex-col bg-background ${showScore ? "print-report-page" : ""}`}>
      <header className="header-glass sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-mono">
              <ArrowLeft className="w-4 h-4" /> Back to Handbook
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-bold text-foreground hidden sm:inline">AI Assurance · ACUITAS™</span>
              <span className="font-display text-sm font-bold text-foreground sm:hidden">AI Assurance</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="gradient-hero py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <Gavel className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">7 Pillars · Agentic AI Governance</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Agentic AI <span className="gradient-text">Assurance</span>
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto mb-3">
            Autonomous agents in revenue cycle scale throughput — and scale error just as fast. {acuitasMeta.name} is the assurance framework that lets you grant autonomy without losing auditability.
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            {acuitasMeta.name} — {acuitasMeta.expansion} · a proprietary framework by {acuitasMeta.author}
          </p>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4 flex-1 max-w-4xl">
        <div role="status" aria-live="polite" className="sr-only">
          {showScore ? `Assurance level ${result.level}, ${result.met} of ${result.total} gates met.` : ""}
        </div>

        {/* Pillars */}
        <h2 className="font-display text-xl font-bold text-foreground mb-1">The Seven Pillars, applied to healthcare</h2>
        <p className="font-body text-sm text-muted-foreground mb-6">
          Each pillar's core principle is reproduced from the {acuitasMeta.name} framework; the healthcare application, agentic risk and controls are the adaptation for revenue-cycle and clinical agents.
        </p>

        <div className="space-y-3 mb-12">
          {acuitasPillars.map((p, i) => {
            const isOpen = open === p.id;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card-pharma p-0 overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="font-display text-lg font-bold text-primary-foreground bg-primary w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    {p.letter}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-bold text-foreground">{p.title}</h3>
                    <p className="font-body text-xs text-muted-foreground truncate">{p.corePrinciple}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                        <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
                          <div className="font-mono text-[9px] uppercase tracking-wider text-primary mb-1">Core principle · {acuitasMeta.name}</div>
                          <p className="font-body text-xs text-foreground italic">{p.corePrinciple}</p>
                        </div>
                        <div>
                          <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">In healthcare</div>
                          <p className="font-body text-xs text-muted-foreground">{p.healthcareApplication}</p>
                        </div>
                        <div className="rounded-lg bg-coral/5 border border-coral/20 p-3">
                          <div className="font-mono text-[9px] uppercase tracking-wider text-coral mb-1 flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3" /> What breaks without it
                          </div>
                          <p className="font-body text-xs text-foreground">{p.agenticRisk}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5"><Scale className="w-3 h-3" /> Controls</div>
                            <ul className="space-y-1">{p.controls.map((c) => <li key={c} className="font-body text-xs text-muted-foreground flex gap-2"><span className="text-primary">·</span>{c}</li>)}</ul>
                          </div>
                          <div>
                            <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5"><FileCheck2 className="w-3 h-3" /> Evidence to hold</div>
                            <ul className="space-y-1">{p.evidence.map((e) => <li key={e} className="font-body text-xs text-muted-foreground flex gap-2"><span className="text-primary">·</span>{e}</li>)}</ul>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.regulatory.map((r) => (
                            <span key={r} className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">{r}</span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Readiness gates */}
        <h2 className="font-display text-xl font-bold text-foreground mb-1">Assurance readiness check</h2>
        <p className="font-body text-sm text-muted-foreground mb-5">Tick every control you can evidence today. {result.met}/{result.total} selected.</p>
        <div className="space-y-2 mb-6">
          {acuitasPillars.map((p) => {
            const gs = assuranceGates.filter((g) => g.pillar === p.id);
            if (!gs.length) return null;
            return (
              <div key={p.id} className="card-pharma">
                <div className="font-mono text-[10px] uppercase tracking-wider text-primary mb-2">{p.letter} · {p.title}</div>
                <div className="space-y-1.5">
                  {gs.map((g) => (
                    <label key={g.id} className="flex items-start gap-3 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-muted/40 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary">
                      <input type="checkbox" checked={!!gates[g.id]} onChange={() => toggleGate(g.id)} className="mt-0.5 accent-current text-primary" />
                      <span className="font-body text-xs text-muted-foreground">{g.question}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mb-10">
          <button onClick={score} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm font-bold hover:opacity-90 transition-opacity">
            <ShieldCheck className="w-4 h-4" /> Score my assurance level
          </button>
        </div>

        <AnimatePresence>
          {showScore && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 print-area">
              <h2 ref={headingRef} tabIndex={-1} className="font-display text-lg font-bold text-foreground outline-none">Your assurance level</h2>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-4xl font-bold text-primary">L{result.level}</span>
                    <span className="font-display text-2xl font-bold text-foreground">{assuranceLevels.find((l) => l.level === result.level)?.name}</span>
                  </div>
                  <span className="font-mono text-sm text-muted-foreground">{result.met}/{result.total} gates · {result.pct}%</span>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((n) => <div key={n} className={`h-2.5 flex-1 rounded-sm ${n <= result.level ? "bg-primary" : "bg-muted"}`} />)}
                </div>
                <p className="font-body text-sm text-muted-foreground">{assuranceLevels.find((l) => l.level === result.level)?.summary}</p>
              </div>

              <div className="card-pharma">
                <h3 className="font-display text-sm font-bold text-foreground mb-3">Coverage by pillar</h3>
                <div className="space-y-2">
                  {result.byPillar.map((b) => (
                    <div key={b.pillar.id} className="grid grid-cols-[150px_1fr_auto] items-center gap-3">
                      <span className="font-mono text-[11px] text-muted-foreground truncate">{b.pillar.letter} · {b.pillar.title}</span>
                      <div className="flex gap-1">
                        {Array.from({ length: b.total }).map((_, i) => (
                          <div key={i} className={`h-2 flex-1 rounded-sm ${i < b.met ? "bg-teal" : "bg-muted"}`} />
                        ))}
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground">{b.met}/{b.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.weakest.length > 0 && (
                <div className="card-pharma">
                  <h3 className="font-display text-sm font-bold text-foreground mb-3">Close these first</h3>
                  <div className="space-y-3">
                    {result.weakest.map((b) => (
                      <div key={b.pillar.id} className="border-l-2 border-l-primary pl-3">
                        <div className="font-display text-xs font-semibold text-foreground mb-1">{b.pillar.letter} · {b.pillar.title}</div>
                        <ul className="space-y-1">
                          {assuranceGates.filter((g) => g.pillar === b.pillar.id && !gates[g.id]).map((g) => (
                            <li key={g.id} className="font-body text-xs text-muted-foreground">{g.question}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <LeadCapture tool="ACUITAS AI Assurance Review" summary={result.summaryText} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <HealthcareFooter />
    </div>
  );
};

export default AiAssurancePage;
