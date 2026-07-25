import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ClipboardCheck, Wand2, FileText, AlertTriangle, CheckCircle2, MinusCircle, XCircle, Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HealthcareFooter } from "@/components/HealthcareFooter";
import { LeadCapture } from "@/components/LeadCapture";
import {
  rubric, safetyFlags, sampleNote, sliceSections, matchesPattern, countPatterns, contradictionPairs,
} from "@/data/qa-scorecard-data";

type Status = "good" | "partial" | "missing";

function grade(pct: number): { letter: string; tone: "good" | "warn" | "crit" } {
  if (pct >= 90) return { letter: "A", tone: "good" };
  if (pct >= 80) return { letter: "B", tone: "good" };
  if (pct >= 70) return { letter: "C", tone: "warn" };
  if (pct >= 60) return { letter: "D", tone: "warn" };
  return { letter: "F", tone: "crit" };
}

const statusStyle: Record<Status, { icon: typeof CheckCircle2; text: string; label: string }> = {
  good: { icon: CheckCircle2, text: "text-teal", label: "Complete" },
  partial: { icon: MinusCircle, text: "text-gold", label: "Partial" },
  missing: { icon: XCircle, text: "text-coral", label: "Missing" },
};

const toneText: Record<string, string> = { good: "text-teal", warn: "text-gold", crit: "text-coral" };

const QaScorecardPage = () => {
  const [note, setNote] = useState("");
  const [scored, setScored] = useState(false);

  const results = useMemo(() => {
    const text = note.toLowerCase();
    if (!text.trim()) return null;

    const sections = sliceSections(note);

    const checks = rubric.map((c) => {
      // Section-scoped checks judge only their own section, so a rich HPI can't
      // earn CDI credit for a vague assessment. A missing section scores Missing.
      const target = c.scope ? sections[c.scope] : text;
      let status: Status;
      if (c.mode === "any") {
        status = target.trim() && c.patterns.some((p) => matchesPattern(target, p)) ? "good" : "missing";
      } else {
        const n = target.trim() ? countPatterns(target, c.patterns) : 0;
        const good = c.goodThreshold ?? 3;
        status = n >= good ? "good" : n >= 1 ? "partial" : "missing";
      }
      const earned = status === "good" ? c.weight : status === "partial" ? c.weight * 0.5 : 0;
      return { ...c, status, earned };
    });

    const totalWeight = rubric.reduce((s, c) => s + c.weight, 0);
    const earnedTotal = checks.reduce((s, c) => s + c.earned, 0);
    const pct = Math.round((earnedTotal / totalWeight) * 100);

    const flags = safetyFlags.filter((f) => {
      if (f.id === "contradiction") {
        // Fires only when BOTH sides of a pair appear — the earlier single
        // patterns could never match a real note.
        return contradictionPairs.some(([a, b]) => text.includes(a) && text.includes(b));
      }
      return f.patterns.some((p) => text.includes(p));
    });
    const gaps = checks.filter((c) => c.status !== "good");
    const g = grade(pct);

    const summaryText = [
      `Grade ${g.letter} — ${pct}/100 QA score`,
      "",
      "Rubric:",
      ...checks.map((c) => `- ${c.label}: ${c.status} (${c.earned}/${c.weight} pt)`),
      ...(flags.length ? ["", `Safety flags: ${flags.map((f) => f.label).join(", ")}`] : []),
      ...(gaps.length ? ["", `Fix first: ${gaps.map((c) => c.label).join(", ")}`] : []),
    ].join("\n");

    return { checks, pct, grade: g, flags, gaps, summaryText };
  }, [note]);

  const runScore = useCallback(() => {
    if (note.trim()) setScored(true);
  }, [note]);

  const loadSample = useCallback(() => {
    setNote(sampleNote);
    setScored(false);
  }, []);

  const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;

  return (
    <div className={`min-h-screen flex flex-col bg-background ${scored ? "print-report-page" : ""}`}>
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
                <ClipboardCheck className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-bold text-foreground hidden sm:inline">Ambient Note QA Scorecard</span>
              <span className="font-display text-sm font-bold text-foreground sm:hidden">Note QA</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">Neutral QA for ambient-scribe notes</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ambient Note <span className="gradient-text">QA Scorecard</span>
          </h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Paste an ambient-scribe or clinical note and grade it against a completeness &amp; CDI/coding rubric — with specificity gaps, safety flags, and fix-it recommendations. Independent of your scribe vendor. Nothing leaves your browser.
          </p>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4 flex-1 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="note" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Clinical note</label>
              <button onClick={loadSample} className="font-mono text-[10px] text-primary hover:underline flex items-center gap-1">
                <FileText className="w-3 h-3" /> Load sample
              </button>
            </div>
            <textarea
              id="note"
              value={note}
              onChange={(e) => { setNote(e.target.value); setScored(false); }}
              rows={20}
              placeholder="Paste a de-identified ambient-scribe or clinical note here…"
              className="w-full rounded-xl border border-border bg-background p-4 text-sm text-foreground font-body leading-relaxed focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 resize-y"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="font-mono text-[10px] text-muted-foreground">{wordCount} words · de-identify before pasting</span>
              <button
                onClick={runScore}
                disabled={!note.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Wand2 className="w-4 h-4" /> Score note
              </button>
            </div>
          </div>

          {/* Results */}
          <div>
            <AnimatePresence mode="wait">
              {scored && results ? (
                <motion.div key="res" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 print-area">
                  {/* Score */}
                  <div className="glass-card rounded-2xl p-6 flex items-center gap-6">
                    <div className="text-center flex-shrink-0">
                      <div className={`font-display text-6xl font-bold ${toneText[results.grade.tone]} leading-none`}>{results.grade.letter}</div>
                      <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Grade</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`font-display text-3xl font-bold ${toneText[results.grade.tone]}`}>{results.pct}</span>
                        <span className="font-mono text-sm text-muted-foreground">/ 100 QA score</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${results.grade.tone === "good" ? "bg-teal" : results.grade.tone === "warn" ? "bg-gold" : "bg-coral"}`} style={{ width: `${results.pct}%` }} />
                      </div>
                      <p className="font-body text-xs text-muted-foreground mt-2">
                        {results.gaps.length === 0 ? "Meets the rubric across the board." : `${results.gaps.length} element${results.gaps.length !== 1 ? "s" : ""} to strengthen.`}
                      </p>
                    </div>
                  </div>

                  {/* Safety flags */}
                  {results.flags.length > 0 && (
                    <div className="rounded-xl border border-coral/40 bg-coral/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-coral" />
                        <h3 className="font-display text-sm font-bold text-coral">Safety flags — resolve before signing</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {results.flags.map((f) => (
                          <li key={f.id} className="font-body text-xs text-foreground"><span className="font-semibold">{f.label}:</span> <span className="text-muted-foreground">{f.note}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Rubric breakdown */}
                  <div className="card-pharma">
                    <h3 className="font-display text-sm font-bold text-foreground mb-3">Rubric breakdown</h3>
                    <div className="space-y-2">
                      {results.checks.map((c) => {
                        const S = statusStyle[c.status];
                        const Icon = S.icon;
                        return (
                          <div key={c.id} className="flex items-center gap-3 py-1.5 border-b border-border last:border-0">
                            <Icon className={`w-4 h-4 flex-shrink-0 ${S.text}`} />
                            <div className="flex-1 min-w-0">
                              <div className="font-body text-xs text-foreground">{c.label}</div>
                              <div className="font-mono text-[9px] text-muted-foreground">{c.reference}</div>
                            </div>
                            <span className={`font-mono text-[10px] font-bold ${S.text}`}>{S.label}</span>
                            <span className="font-mono text-[10px] text-muted-foreground w-14 text-right">{c.earned}/{c.weight} pt</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {results.gaps.length > 0 && (
                    <div className="card-pharma">
                      <h3 className="font-display text-sm font-bold text-foreground mb-3">Fix-it recommendations</h3>
                      <div className="space-y-3">
                        {results.gaps.map((c) => (
                          <div key={c.id} className="border-l-2 border-l-primary pl-3">
                            <div className="font-display text-xs font-semibold text-foreground">{c.label}</div>
                            <p className="font-body text-xs text-muted-foreground mt-0.5">{c.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <LeadCapture tool="Ambient Note QA Scorecard" summary={results.summaryText} />
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[300px] rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center p-8">
                  <ClipboardCheck className="w-10 h-10 text-muted-foreground/40 mb-3" />
                  <p className="font-body text-sm text-muted-foreground">Paste a note and hit <span className="font-mono text-primary">Score note</span> — or load the sample — to see the grade, rubric breakdown, safety flags, and fix-it recommendations.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="font-mono text-[10px] text-muted-foreground/70 mt-6 text-center max-w-3xl mx-auto">
          v1 uses transparent keyword heuristics to prove the rubric; the production tier swaps in an LLM grader (behind a BAA) for semantic scoring and hallucination detection. Grades are advisory — a qualified professional must review every note.
        </p>
      </main>

      <HealthcareFooter />
    </div>
  );
};

export default QaScorecardPage;
