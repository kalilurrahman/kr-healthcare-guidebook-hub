import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Gauge, ClipboardCheck, RotateCcw, ArrowRight,
  Target, CheckCircle2, ListChecks, Activity,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HealthcareFooter } from "@/components/HealthcareFooter";
import { LeadCapture } from "@/components/LeadCapture";
import {
  diagnosticQuestions, diagnosticSections, maturityLevels, boardQuestions,
} from "@/data/diagnostic-data";

type Answers = Record<string, number>;

const bandStyles: Record<number, { text: string; chip: string; fill: string }> = {
  1: { text: "text-coral", chip: "bg-coral/10 border-coral/30 text-coral", fill: "bg-coral" },
  2: { text: "text-gold", chip: "bg-gold/10 border-gold/30 text-gold", fill: "bg-gold" },
  3: { text: "text-indigo", chip: "bg-indigo/10 border-indigo/30 text-indigo", fill: "bg-indigo" },
  4: { text: "text-teal", chip: "bg-teal/10 border-teal/30 text-teal", fill: "bg-teal" },
  5: { text: "text-primary", chip: "bg-primary/10 border-primary/30 text-primary", fill: "bg-primary" },
};

function levelBand(score: number): number {
  if (score < 1.5) return 1;
  if (score < 2.5) return 2;
  if (score < 3.5) return 3;
  if (score < 4.3) return 4;
  return 5;
}

function LevelMeter({ level, targetOnly }: { level: number; targetOnly?: boolean }) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`h-2 flex-1 rounded-sm transition-colors ${
            n <= level ? bandStyles[levelBand(level)].fill : "bg-muted"
          } ${targetOnly && n === 4 ? "ring-1 ring-primary/40" : ""}`}
        />
      ))}
    </div>
  );
}

const DiagnosticPage = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const answeredCount = Object.keys(answers).length;
  const total = diagnosticQuestions.length;

  const select = useCallback((qid: string, level: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: level }));
  }, []);

  const results = useMemo(() => {
    const answered = diagnosticQuestions.filter((q) => answers[q.id] !== undefined);
    if (answered.length === 0) return null;
    const overall = answered.reduce((s, q) => s + answers[q.id], 0) / answered.length;
    const band = levelBand(overall);

    const sectionScores = diagnosticSections.map((sec) => {
      const qs = answered.filter((q) => q.section === sec.id);
      const score = qs.length ? qs.reduce((s, q) => s + answers[q.id], 0) / qs.length : 0;
      return { ...sec, score, count: qs.length };
    });

    const dimensions = answered.map((q) => ({
      dimension: q.dimension, level: answers[q.id], section: q.section,
    }));

    const gaps = answered
      .filter((q) => answers[q.id] <= 3)
      .sort((a, b) => answers[a.id] - answers[b.id])
      .map((q) => ({ q, level: answers[q.id] }));

    const name = maturityLevels.find((l) => l.level === band)?.name ?? "";
    const summaryText = [
      `Overall maturity: L${band} ${name} (${overall.toFixed(1)}/5 · ${answered.length}/${diagnosticQuestions.length} answered)`,
      "",
      "Section scores:",
      ...sectionScores.filter((s) => s.count > 0).map((s) => `- ${s.label}: ${s.score.toFixed(1)}/5`),
      "",
      gaps.length ? "Priority roadmap:" : "No gaps below the target band.",
      ...gaps.map((g, i) => `${i + 1}. ${g.q.dimension} (L${g.level}) — ${g.q.lowRec}`),
    ].join("\n");

    return { answered, overall, band, sectionScores, dimensions, gaps, summaryText };
  }, [answers]);

  const headingRef = useRef<HTMLHeadingElement>(null);

  const generate = useCallback(() => {
    setShowResults(true);
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      // Scrolling is invisible to AT — move focus so results are announced.
      headingRef.current?.focus();
    });
  }, []);

  const reset = useCallback(() => {
    setAnswers({});
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className={`min-h-screen flex flex-col bg-background ${showResults ? "print-report-page" : ""}`}>
      {/* Header */}
      <header className="header-glass sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-mono">
              <ArrowLeft className="w-4 h-4" />
              Back to Handbook
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <Gauge className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-bold text-foreground hidden sm:inline">RCM &amp; GCC Maturity Diagnostic</span>
              <span className="font-display text-sm font-bold text-foreground sm:hidden">Diagnostic</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <ClipboardCheck className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">{total} Dimensions · Instant Roadmap · No sign-up</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            RCM &amp; GCC Maturity <span className="gradient-text">Diagnostic</span>
          </h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Score your revenue cycle, AI adoption, and operating model against best-in-class benchmarks from the handbook — and get a prioritized transformation roadmap in two minutes. Your answers stay in your browser.
          </p>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4 flex-1 max-w-3xl">
        {/* Persistent live region — stays mounted so it announces reliably. */}
        <div role="status" aria-live="polite" className="sr-only">
          {showResults && results
            ? `Results ready. Overall maturity level ${results.band}, ${results.overall.toFixed(1)} out of 5. ${results.gaps.length} gap${results.gaps.length !== 1 ? "s" : ""} to best-in-class.`
            : ""}
        </div>
        {/* Progress */}
        <div className="sticky top-14 z-40 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-sm border-b border-border mb-8">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
              {answeredCount} / {total} answered
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${(answeredCount / total) * 100}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            </div>
            <button
              onClick={generate}
              disabled={answeredCount === 0}
              className="nav-pill active text-xs whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {showResults ? "Update roadmap" : "Generate roadmap"}
            </button>
          </div>
        </div>

        {/* Assessment */}
        <div className="space-y-10">
          {diagnosticSections.map((sec) => {
            const qs = diagnosticQuestions.filter((q) => q.section === sec.id);
            return (
              <div key={sec.id}>
                <div className="mb-4">
                  <h2 className="font-display text-lg font-bold text-foreground">{sec.label}</h2>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{sec.blurb}</p>
                </div>
                <div className="space-y-4">
                  {qs.map((q) => (
                    <div key={q.id} className="card-pharma">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-display text-sm font-semibold text-foreground">{q.prompt}</h3>
                        <span className="font-mono text-[9px] text-muted-foreground whitespace-nowrap mt-1 hidden sm:inline">{q.dimension}</span>
                      </div>
                      <p className="font-mono text-[10px] text-primary mb-3 flex items-center gap-1.5">
                        <Target className="w-3 h-3 flex-shrink-0" /> {q.benchmark}
                      </p>
                      {/* Native radios: the browser supplies roving tabindex,
                          arrow-key navigation and aria-checked for free. An
                          emulated role="radio" button group gave each option its
                          own tab stop and left arrow keys dead for AT users. */}
                      <fieldset className="space-y-1.5 border-0 p-0 m-0">
                        <legend className="sr-only">{q.prompt}</legend>
                        {q.options.map((opt) => {
                          const active = answers[q.id] === opt.level;
                          return (
                            <label
                              key={opt.level}
                              className={`w-full text-left flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-background ${
                                active
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/40 hover:bg-muted/40"
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={opt.level}
                                checked={active}
                                onChange={() => select(q.id, opt.level)}
                                className="sr-only"
                              />
                              <span className={`font-mono text-[10px] font-bold w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                                active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                              }`}>
                                L{opt.level}
                              </span>
                              <span className={`font-body text-xs ${active ? "text-foreground" : "text-muted-foreground"}`}>{opt.text}</span>
                            </label>
                          );
                        })}
                      </fieldset>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Generate CTA (bottom) */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={generate}
            disabled={answeredCount === 0}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ListChecks className="w-4 h-4" />
            {showResults ? "Update my roadmap" : "Generate my roadmap"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="scroll-mt-24">
          <AnimatePresence>
            {showResults && results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-14 print-area"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px flex-1 bg-border" />
                  <h2 ref={headingRef} tabIndex={-1} className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary outline-none">Your Results</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Overall band */}
                {(() => {
                  const lvl = maturityLevels.find((l) => l.level === results.band)!;
                  const s = bandStyles[results.band];
                  return (
                    <div className="glass-card rounded-2xl p-6 mb-6">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Overall maturity</div>
                          <div className="flex items-baseline gap-3">
                            <span className={`font-display text-4xl font-bold ${s.text}`}>L{results.band}</span>
                            <span className="font-display text-2xl font-bold text-foreground">{lvl.name}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-display text-3xl font-bold ${s.text}`}>{results.overall.toFixed(1)}<span className="text-muted-foreground text-lg">/5</span></div>
                          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">mean across answered · {results.answered.length}/{total} answered</div>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <div key={n} className={`h-2.5 flex-1 rounded-sm ${n <= results.band ? s.fill : "bg-muted"}`} />
                        ))}
                      </div>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{lvl.summary}</p>
                    </div>
                  );
                })()}

                {/* Section scores */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {results.sectionScores.filter((s) => s.count > 0).map((sec) => {
                    const b = levelBand(sec.score);
                    return (
                      <div key={sec.id} className="card-pharma">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{sec.label}</div>
                        <div className={`font-display text-2xl font-bold ${bandStyles[b].text} mb-2`}>{sec.score.toFixed(1)}<span className="text-muted-foreground text-sm">/5</span></div>
                        <LevelMeter level={sec.score} />
                      </div>
                    );
                  })}
                </div>

                {/* Dimension breakdown */}
                <div className="card-pharma mb-6">
                  <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> Dimension breakdown
                  </h3>
                  <div className="space-y-3">
                    {results.dimensions.map((d) => (
                      <div key={d.dimension} className="grid grid-cols-[130px_1fr_auto] items-center gap-3">
                        <span className="font-mono text-[11px] text-muted-foreground truncate">{d.dimension}</span>
                        <LevelMeter level={d.level} targetOnly />
                        <span className={`font-mono text-[11px] font-bold ${bandStyles[d.level].text} w-6 text-right`}>L{d.level}</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-mono text-[9px] text-muted-foreground mt-3">Faint ring marks the L4 "analytical intelligence" target band.</p>
                </div>

                {/* Priority roadmap */}
                <div className="mb-6">
                  <h3 className="font-display text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-primary" /> Your priority roadmap
                  </h3>
                  <p className="font-body text-xs text-muted-foreground mb-4">
                    {results.gaps.length > 0
                      ? `${results.gaps.length} gap${results.gaps.length !== 1 ? "s" : ""} to best-in-class, ordered by urgency (lowest maturity first).`
                      : "No gaps below the target band — focus on compounding your lead."}
                  </p>

                  {results.gaps.length > 0 ? (
                    <div className="space-y-3">
                      {results.gaps.map(({ q, level }, i) => (
                        <motion.div
                          key={q.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="card-pharma border-l-4 border-l-primary flex gap-4"
                        >
                          <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
                            <span className="font-display text-lg font-bold text-primary leading-none">{i + 1}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${bandStyles[level].chip} border`}>L{level}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-display text-sm font-semibold text-foreground">{q.dimension}</h4>
                              <span className="font-mono text-[9px] text-muted-foreground">{q.reference}</span>
                            </div>
                            <p className="font-body text-xs text-muted-foreground leading-relaxed mb-1.5">{q.lowRec}</p>
                            <p className="font-mono text-[10px] text-primary/70 flex items-center gap-1.5">
                              <Target className="w-3 h-3" /> {q.benchmark}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="card-pharma flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-teal flex-shrink-0" />
                      <p className="font-body text-sm text-muted-foreground">Strong maturity across the board. Prioritize protecting your benchmarks and productizing your capability into new mandates.</p>
                    </div>
                  )}
                </div>

                {/* Board questions */}
                <div className="glass-card rounded-2xl p-6 mb-6">
                  <h3 className="font-display text-sm font-bold text-foreground mb-3">Questions to bring to leadership</h3>
                  <ul className="space-y-2">
                    {boardQuestions.map((bq) => (
                      <li key={bq} className="flex gap-2 font-body text-sm text-muted-foreground">
                        <span className="text-primary font-mono flex-shrink-0">→</span> {bq}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lead funnel + reset */}
                <LeadCapture tool="RCM & GCC Maturity Diagnostic" summary={results.summaryText} />
                <div className="no-print flex justify-center mt-4">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-muted-foreground font-mono text-xs hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Start over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <HealthcareFooter />
    </div>
  );
};

export default DiagnosticPage;
