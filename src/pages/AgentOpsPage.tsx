import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Bot, Layers, AlertTriangle, CalendarDays, Target, Rocket, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HealthcareFooter } from "@/components/HealthcareFooter";
import { LeadCapture } from "@/components/LeadCapture";
import { agentWorkflows, autonomyLevels, curriculum, gccPhases } from "@/data/agentops-data";
import { useSeo, routeSeo } from "@/lib/seo";

const riskLabel = (t: number) => (t <= 1 ? "Low" : t === 2 ? "Moderate" : t === 3 ? "Elevated" : t === 4 ? "High" : "Critical");
const riskTone = (t: number) => (t <= 1 ? "text-teal" : t === 2 ? "text-teal" : t === 3 ? "text-gold" : "text-coral");

const AgentOpsPage = () => {
  useSeo(routeSeo.agentops);
  const [selected, setSelected] = useState<string[]>(["eligibility", "claim-status"]);
  const [target, setTarget] = useState(4);
  const [showPlan, setShowPlan] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const toggle = useCallback((id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    setShowPlan(false);
  }, []);

  const plan = useMemo(() => {
    const wfs = agentWorkflows.filter((w) => selected.includes(w.id));
    if (!wfs.length) return null;

    // Autonomy is capped per workflow by its risk tier — this is the core rule.
    const assignments = wfs.map((w) => {
      const granted = Math.min(target, w.maxAutonomy);
      return { w, granted, capped: granted < target };
    });
    const capped = assignments.filter((a) => a.capped);
    const kpis = Array.from(new Set(wfs.flatMap((w) => w.goLiveKpis)));
    const exceptions = wfs.flatMap((w) => w.exceptions.map((e) => ({ wf: w.name, e })));

    const summaryText = [
      `AgentOps GCC Launch plan — ${wfs.length} workflow${wfs.length !== 1 ? "s" : ""}, target autonomy L${target} (${autonomyLevels.find((a) => a.level === target)?.name})`,
      "",
      "Workflows & granted autonomy:",
      ...assignments.map((a) => `- ${a.w.name}: L${a.granted} ${autonomyLevels.find((x) => x.level === a.granted)?.name}${a.capped ? ` (capped from L${target} by risk tier ${a.w.riskTier})` : ""}`),
      "",
      `Go-live KPIs: ${kpis.join(", ")}`,
      "",
      `Exceptions to design for: ${exceptions.length}`,
    ].join("\n");

    return { wfs, assignments, capped, kpis, exceptions, summaryText };
  }, [selected, target]);

  const build = useCallback(() => {
    if (!selected.length) return;
    setShowPlan(true);
    requestAnimationFrame(() => headingRef.current?.focus());
  }, [selected]);

  return (
    <div className={`min-h-screen flex flex-col bg-background ${showPlan ? "print-report-page" : ""}`}>
      <header className="header-glass sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-mono">
              <ArrowLeft className="w-4 h-4" /> Back to Handbook
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-bold text-foreground hidden sm:inline">AgentOps GCC Launch</span>
              <span className="font-display text-sm font-bold text-foreground sm:hidden">AgentOps</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="gradient-hero py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <Rocket className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">Workflows → PDD → 5-day enablement → go-live</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            AgentOps <span className="gradient-text">GCC Launch</span>
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Pick the RCM workflows to automate and the autonomy you want. Get a launch plan: risk-capped autonomy per workflow, a Process Definition Document outline, the exception register, a five-day enablement schedule, and the KPIs to hold yourself to.
          </p>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4 flex-1 max-w-4xl">
        <div role="status" aria-live="polite" className="sr-only">
          {showPlan && plan ? `Launch plan ready for ${plan.wfs.length} workflows. ${plan.capped.length} capped by risk tier.` : ""}
        </div>

        {/* 1 · workflows */}
        <h2 className="font-display text-lg font-bold text-foreground mb-1">1 · Select workflows</h2>
        <p className="font-body text-xs text-muted-foreground mb-4">Each carries a risk tier that caps how much autonomy it may be granted.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
          {agentWorkflows.map((w) => {
            const on = selected.includes(w.id);
            return (
              <label key={w.id} className={`card-pharma cursor-pointer flex gap-3 items-start transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${on ? "border-primary bg-primary/5" : ""}`}>
                <input type="checkbox" checked={on} onChange={() => toggle(w.id)} className="mt-1 accent-current text-primary" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-display text-sm font-semibold text-foreground">{w.name}</span>
                    <span className={`font-mono text-[9px] ${riskTone(w.riskTier)}`}>Tier {w.riskTier} · {riskLabel(w.riskTier)}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{w.description}</p>
                  <p className="font-mono text-[9px] text-muted-foreground mt-1">{w.tower} · ceiling {w.automationCeiling}</p>
                </div>
              </label>
            );
          })}
        </div>

        {/* 2 · autonomy */}
        <h2 className="font-display text-lg font-bold text-foreground mb-1">2 · Target autonomy</h2>
        <p className="font-body text-xs text-muted-foreground mb-4">The plan will cap this per workflow where the risk tier requires it.</p>
        <fieldset className="space-y-1.5 mb-8 border-0 p-0">
          <legend className="sr-only">Target autonomy level</legend>
          {autonomyLevels.map((a) => (
            <label key={a.level} className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary ${target === a.level ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
              <input type="radio" name="autonomy" value={a.level} checked={target === a.level} onChange={() => { setTarget(a.level); setShowPlan(false); }} className="sr-only" />
              <span className={`font-mono text-[10px] font-bold w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${target === a.level ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>L{a.level}</span>
              <span className="min-w-0">
                <span className="font-display text-xs font-semibold text-foreground">{a.name}</span>
                <span className="font-body text-xs text-muted-foreground"> — {a.description}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="flex justify-center mb-10">
          <button onClick={build} disabled={!selected.length} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
            <Layers className="w-4 h-4" /> Build my launch plan
          </button>
        </div>

        <AnimatePresence>
          {showPlan && plan && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 print-area">
              <h2 ref={headingRef} tabIndex={-1} className="font-display text-lg font-bold text-foreground outline-none">Your launch plan</h2>

              {/* autonomy assignment */}
              <div className="card-pharma">
                <h3 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Granted autonomy (risk-capped)</h3>
                <div className="space-y-2">
                  {plan.assignments.map(({ w, granted, capped }) => (
                    <div key={w.id} className="flex items-center justify-between gap-3 py-1.5 border-b border-border last:border-0">
                      <div className="min-w-0">
                        <div className="font-body text-xs text-foreground">{w.name}</div>
                        <div className="font-mono text-[9px] text-muted-foreground">Tier {w.riskTier} · {w.benchmark}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-mono text-xs font-bold text-primary">L{granted} {autonomyLevels.find((a) => a.level === granted)?.name}</span>
                        {capped && <div className="font-mono text-[9px] text-gold">capped from L{target}</div>}
                      </div>
                    </div>
                  ))}
                </div>
                {plan.capped.length > 0 && (
                  <p className="font-body text-xs text-muted-foreground mt-3">
                    {plan.capped.length} workflow{plan.capped.length !== 1 ? "s were" : " was"} capped below your target because the risk tier makes unsupervised operation indefensible — these touch clinical judgement or are hard to reverse.
                  </p>
                )}
              </div>

              {/* PDD outline */}
              <div className="card-pharma">
                <h3 className="font-display text-sm font-bold text-foreground mb-3">Process Definition Document — outline per workflow</h3>
                <div className="space-y-3">
                  {plan.wfs.map((w) => (
                    <div key={w.id} className="border-l-2 border-l-primary pl-3">
                      <div className="font-display text-xs font-semibold text-foreground">{w.name}</div>
                      <ul className="font-body text-xs text-muted-foreground mt-1 space-y-0.5">
                        <li>· Trigger &amp; volume driver: {w.volumeDriver}</li>
                        <li>· Systems touched, data sources, and the happy path</li>
                        <li>· Decision points and the rules that govern each</li>
                        <li>· Automation ceiling: {w.automationCeiling}</li>
                        <li>· Exception routing (below) and named owner</li>
                        <li>· Rollback trigger and acceptance criteria</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* exception register */}
              <div className="card-pharma">
                <h3 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-gold" /> Exception register ({plan.exceptions.length})</h3>
                <div className="space-y-1.5">
                  {plan.exceptions.map((x, i) => (
                    <div key={i} className="flex gap-2 font-body text-xs">
                      <span className="font-mono text-[10px] text-primary flex-shrink-0 w-40 truncate">{x.wf}</span>
                      <span className="text-muted-foreground">{x.e}</span>
                    </div>
                  ))}
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mt-3">Every exception needs a named human owner and a response SLA before go-live.</p>
              </div>

              {/* 5-day curriculum */}
              <div className="card-pharma">
                <h3 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary" /> Five-day enablement</h3>
                <div className="space-y-3">
                  {curriculum.map((d) => (
                    <div key={d.day} className="flex gap-3">
                      <span className="font-mono text-[10px] font-bold text-primary-foreground bg-primary w-6 h-6 rounded flex items-center justify-center flex-shrink-0">D{d.day}</span>
                      <div>
                        <div className="font-display text-xs font-semibold text-foreground">{d.title} — <span className="font-body font-normal text-muted-foreground">{d.focus}</span></div>
                        <ul className="font-body text-xs text-muted-foreground mt-0.5 space-y-0.5">
                          {d.activities.map((a) => <li key={a}>· {a}</li>)}
                        </ul>
                        <div className="font-mono text-[9px] text-primary mt-1">Deliverable: {d.deliverable}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPIs + phases */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card-pharma">
                  <h3 className="font-display text-sm font-bold text-foreground mb-2 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Go-live KPIs</h3>
                  <ul className="space-y-1">
                    {plan.kpis.map((k) => <li key={k} className="font-body text-xs text-muted-foreground flex gap-2"><span className="text-primary">·</span>{k}</li>)}
                  </ul>
                </div>
                <div className="card-pharma">
                  <h3 className="font-display text-sm font-bold text-foreground mb-2">GCC scaling path</h3>
                  <div className="space-y-2">
                    {gccPhases.map((p) => (
                      <div key={p.phase}>
                        <div className="font-mono text-[9px] text-primary uppercase tracking-wider">{p.phase} · {p.label}</div>
                        <p className="font-body text-xs text-muted-foreground">{p.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="font-mono text-[10px] text-muted-foreground">
                  Pair this with the <Link to="/ai-assurance" className="text-primary hover:underline">ACUITAS™ assurance gates</Link> — autonomy above L2 should not go live without traceability and a rollback trigger in place.
                </p>
              </div>

              <LeadCapture tool="AgentOps GCC Launch Plan" summary={plan.summaryText} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <HealthcareFooter />
    </div>
  );
};

export default AgentOpsPage;
