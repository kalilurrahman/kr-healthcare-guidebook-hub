import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, FileText, Copy, Check, Download, Target, CalendarClock, Paperclip, Lightbulb, AlertTriangle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HealthcareFooter } from "@/components/HealthcareFooter";
import { LeadCapture } from "@/components/LeadCapture";
import { paServiceCategories, paReadinessGates, paComplianceDates, paBenchmarks } from "@/data/pa-accelerate-data";
import { payers } from "@/data/appealforge-data";
import { useSeo, routeSeo } from "@/lib/seo";

type Tab = "readiness" | "packet";

const scrutinyTone: Record<string, string> = {
  standard: "text-teal", elevated: "text-gold", high: "text-coral",
};

function orToken(v: string, t: string) {
  return v.trim() ? v.trim() : `[${t}]`;
}

const PaAcceleratePage = () => {
  useSeo(routeSeo.paAccelerate);
  const [tab, setTab] = useState<Tab>("readiness");

  // --- readiness ---
  const [met, setMet] = useState<Record<string, boolean>>({});
  const [scored, setScored] = useState(false);
  const readyRef = useRef<HTMLHeadingElement>(null);

  const readiness = useMemo(() => {
    const total = paReadinessGates.length;
    const done = paReadinessGates.filter((g) => met[g.id]).length;
    const pct = Math.round((done / total) * 100);
    const gaps = paReadinessGates.filter((g) => !met[g.id]);
    const apiGaps = gaps.filter((g) => g.mapsTo);
    const band = pct >= 85 ? "Ready" : pct >= 60 ? "On track" : pct >= 35 ? "Behind" : "At risk";
    const summaryText = [
      `PA readiness: ${band} — ${done}/${total} controls in place (${pct}%)`,
      "",
      ...(gaps.length ? ["Gaps:", ...gaps.map((g) => `- [${g.area}] ${g.question}`)] : ["No gaps."]),
      ...(apiGaps.length ? ["", `CMS-0057-F exposure: ${apiGaps.length} gap(s) tied to a dated obligation.`] : []),
    ].join("\n");
    return { total, done, pct, gaps, apiGaps, band, summaryText };
  }, [met]);

  const scoreReadiness = useCallback(() => {
    setScored(true);
    requestAnimationFrame(() => readyRef.current?.focus());
  }, []);

  // --- packet ---
  const [catId, setCatId] = useState(paServiceCategories[0].id);
  const [payerId, setPayerId] = useState(payers[0].id);
  const [f, setF] = useState({ patient: "", memberId: "", service: "", cpt: "", dx: "", provider: "", npi: "", practice: "", clinical: "" });
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");

  const cat = paServiceCategories.find((c) => c.id === catId)!;
  const payer = payers.find((p) => p.id === payerId)!;
  const setField = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const letter = useMemo(() => {
    const elements = cat.medicalNecessityElements.map((e) => `  •  ${e}`).join("\n");
    const docs = cat.documentation.map((d) => `  •  ${d}`).join("\n");
    const clinical = f.clinical.trim() ? `\nClinical summary:\n${f.clinical.trim()}\n` : "";
    return `${orToken(f.practice, "Practice / Provider letterhead")}

[Date]

${payer.name}
Attn: Utilization Management — Prior Authorization

RE: Prior Authorization Request — ${cat.name}

Patient:            ${orToken(f.patient, "Patient initials")}
Member ID:          ${orToken(f.memberId, "Member ID")}
Requested Service:  ${orToken(f.service, "Service / procedure")}
CPT/HCPCS:          ${orToken(f.cpt, "Code")}
Diagnosis (ICD-10): ${orToken(f.dx, "Code + description")}
Ordering Provider:  ${orToken(f.provider, "Provider name")} (NPI ${orToken(f.npi, "NPI")})

To the Utilization Management Reviewer:

We request prior authorization for the service above. The clinical record supports medical necessity against your published criteria as follows.
${clinical}
Medical-necessity elements addressed in the enclosed documentation:
${elements}

Enclosed:
${docs}

We request a determination within the timeframe required under the applicable plan, state, or CMS rules, and ask that any adverse determination specify the exact criterion not met so it can be addressed on reconsideration.

Sincerely,

${orToken(f.provider, "Ordering provider")}
${orToken(f.practice, "Practice name")}

— Prepared with PA-Accelerate. Payer note: ${payer.note}`;
  }, [cat, payer, f]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopyState("ok");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch { setCopyState("fail"); }
  }, [letter]);

  const download = useCallback(() => {
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safe = (f.memberId || "").replace(/[^A-Za-z0-9._-]/g, "").slice(0, 40) || "draft";
    a.download = `pa-request-${cat.id}-${safe}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }, [letter, cat.id, f.memberId]);

  const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40";
  const labelCls = "font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block";

  return (
    <div className={`min-h-screen flex flex-col bg-background ${scored && tab === "readiness" ? "print-report-page" : ""}`}>
      <header className="header-glass sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-mono">
              <ArrowLeft className="w-4 h-4" /> Back to Handbook
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <CalendarClock className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-bold text-foreground">PA-Accelerate</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="gradient-hero py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">CMS-0057-F readiness · PA packet builder</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            PA-<span className="gradient-text">Accelerate</span>
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Prior authorization is being rebuilt by regulation. Check where you stand against the CMS-0057-F obligations, then generate a payer-ready request packet that addresses medical necessity the way reviewers actually assess it.
          </p>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4 flex-1 max-w-5xl">
        <div role="status" aria-live="polite" className="sr-only">
          {scored ? `PA readiness ${readiness.band}, ${readiness.done} of ${readiness.total} controls in place.` : ""}
        </div>

        {/* compliance strip */}
        <div className="card-pharma mb-6 no-print">
          <div className="font-mono text-[10px] uppercase tracking-wider text-primary mb-2">CMS-0057-F timeline</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {paComplianceDates.map((d) => (
              <div key={d.date} className="flex gap-2">
                <span className={`font-mono text-[11px] font-bold flex-shrink-0 ${d.status === "upcoming" ? "text-primary" : "text-muted-foreground"}`}>{d.date}</span>
                <span className="font-body text-xs text-muted-foreground">{d.what}</span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] text-muted-foreground mt-2">
            Dates mirror the <Link to="/regulatory" className="text-primary hover:underline">Regulatory Calendar</Link>.
          </p>
        </div>

        {/* tabs */}
        <div className="flex items-center gap-2 mb-6 no-print">
          <button onClick={() => setTab("readiness")} className={`nav-pill text-xs ${tab === "readiness" ? "active" : ""}`}>1 · Readiness check</button>
          <button onClick={() => setTab("packet")} className={`nav-pill text-xs ${tab === "packet" ? "active" : ""}`}>2 · Request packet</button>
        </div>

        {tab === "readiness" ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 no-print">
              {paBenchmarks.map((b) => (
                <div key={b.label} className="card-pharma">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">{b.label}</div>
                  <div className="font-display text-sm font-bold text-primary">{b.bestInClass}</div>
                  <div className="font-mono text-[9px] text-muted-foreground">typical {b.typical}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6 no-print">
              {(["Intake", "Determination", "Submission", "Tracking", "Interoperability"] as const).map((area) => {
                const gs = paReadinessGates.filter((g) => g.area === area);
                return (
                  <div key={area} className="card-pharma">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-primary mb-2">{area}</div>
                    <div className="space-y-1.5">
                      {gs.map((g) => (
                        <label key={g.id} className="flex items-start gap-3 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-muted/40 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary">
                          <input type="checkbox" checked={!!met[g.id]} onChange={() => { setMet((m) => ({ ...m, [g.id]: !m[g.id] })); setScored(false); }} className="mt-0.5 accent-current text-primary" />
                          <span className="min-w-0">
                            <span className="font-body text-xs text-muted-foreground">{g.question}</span>
                            {g.mapsTo && <span className="font-mono text-[9px] text-primary block mt-0.5">↳ {g.mapsTo}</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mb-8 no-print">
              <button onClick={scoreReadiness} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm font-bold hover:opacity-90 transition-opacity">
                <Target className="w-4 h-4" /> Score my readiness
              </button>
            </div>

            <AnimatePresence>
              {scored && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 print-area">
                  <h2 ref={readyRef} tabIndex={-1} className="font-display text-lg font-bold text-foreground outline-none">Your PA readiness</h2>
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
                      <span className="font-display text-3xl font-bold text-primary">{readiness.band}</span>
                      <span className="font-mono text-sm text-muted-foreground">{readiness.done}/{readiness.total} controls · {readiness.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${readiness.pct}%` }} />
                    </div>
                  </div>

                  {readiness.apiGaps.length > 0 && (
                    <div className="rounded-xl border border-gold/40 bg-gold/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-gold" />
                        <h3 className="font-display text-sm font-bold text-gold">{readiness.apiGaps.length} gap{readiness.apiGaps.length !== 1 ? "s" : ""} tied to a dated CMS-0057-F obligation</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {readiness.apiGaps.map((g) => (
                          <li key={g.id} className="font-body text-xs text-foreground">{g.question} <span className="font-mono text-[10px] text-muted-foreground block">↳ {g.mapsTo}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {readiness.gaps.length > 0 && (
                    <div className="card-pharma">
                      <h3 className="font-display text-sm font-bold text-foreground mb-3">Close these</h3>
                      <div className="space-y-3">
                        {readiness.gaps.map((g) => (
                          <div key={g.id} className="border-l-2 border-l-primary pl-3">
                            <div className="font-display text-xs font-semibold text-foreground">{g.area} · {g.question}</div>
                            <p className="font-body text-xs text-muted-foreground mt-0.5">{g.gap}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <LeadCapture tool="PA-Accelerate Readiness Review" summary={readiness.summaryText} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="card-pharma space-y-4">
                <h2 className="font-display text-sm font-bold text-foreground">Request details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls} htmlFor="cat">Service category</label>
                    <select id="cat" className={inputCls} value={catId} onChange={(e) => setCatId(e.target.value)}>
                      {paServiceCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="pa-payer">Payer</label>
                    <select id="pa-payer" className={inputCls} value={payerId} onChange={(e) => setPayerId(e.target.value)}>
                      {payers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls} htmlFor="pa-patient">Patient (initials)</label><input id="pa-patient" className={inputCls} value={f.patient} onChange={(e) => setField("patient", e.target.value)} /></div>
                  <div><label className={labelCls} htmlFor="pa-member">Member ID</label><input id="pa-member" className={inputCls} value={f.memberId} onChange={(e) => setField("memberId", e.target.value)} /></div>
                  <div><label className={labelCls} htmlFor="pa-service">Requested service</label><input id="pa-service" className={inputCls} value={f.service} onChange={(e) => setField("service", e.target.value)} /></div>
                  <div><label className={labelCls} htmlFor="pa-cpt">CPT / HCPCS</label><input id="pa-cpt" className={inputCls} value={f.cpt} onChange={(e) => setField("cpt", e.target.value)} /></div>
                  <div><label className={labelCls} htmlFor="pa-dx">Diagnosis (ICD-10)</label><input id="pa-dx" className={inputCls} value={f.dx} onChange={(e) => setField("dx", e.target.value)} /></div>
                  <div><label className={labelCls} htmlFor="pa-prov">Ordering provider</label><input id="pa-prov" className={inputCls} value={f.provider} onChange={(e) => setField("provider", e.target.value)} /></div>
                  <div><label className={labelCls} htmlFor="pa-npi">NPI</label><input id="pa-npi" className={inputCls} value={f.npi} onChange={(e) => setField("npi", e.target.value)} /></div>
                  <div><label className={labelCls} htmlFor="pa-practice">Practice</label><input id="pa-practice" className={inputCls} value={f.practice} onChange={(e) => setField("practice", e.target.value)} /></div>
                  <div className="sm:col-span-2"><label className={labelCls} htmlFor="pa-clinical">Clinical summary (optional)</label><textarea id="pa-clinical" rows={3} className={inputCls} value={f.clinical} onChange={(e) => setField("clinical", e.target.value)} placeholder="Symptoms, duration, conservative therapy tried and outcome…" /></div>
                </div>
              </div>

              <div className="card-pharma space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-sm font-bold text-foreground">How this category is assessed</h2>
                  <span className={`font-mono text-[9px] uppercase ${scrutinyTone[cat.scrutiny]}`}>{cat.scrutiny} scrutiny</span>
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5"><Paperclip className="w-3 h-3" /> Documentation to attach</div>
                  <ul className="space-y-1">{cat.documentation.map((d) => <li key={d} className="font-body text-xs text-muted-foreground flex gap-2"><span className="text-primary">✓</span>{d}</li>)}</ul>
                </div>
                <div className="rounded-lg bg-coral/5 border border-coral/20 p-3">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-coral mb-1">Why these get denied</div>
                  <ul className="space-y-0.5">{cat.commonDenialReasons.map((r) => <li key={r} className="font-body text-xs text-foreground">· {r}</li>)}</ul>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/15 p-3">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-primary mb-1 flex items-center gap-1.5"><Lightbulb className="w-3 h-3" /> Gold-carding angle</div>
                  <p className="font-body text-xs text-foreground">{cat.goldCardingNote}</p>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-20 self-start">
              <div className="card-pharma p-0 overflow-hidden">
                <div className="flex items-center justify-between gap-3 p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /><h2 className="font-display text-sm font-bold text-foreground">PA request</h2></div>
                  <div className="flex items-center gap-2">
                    <button onClick={copy} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-mono text-[11px] font-bold hover:opacity-90 transition-opacity">
                      {copyState === "ok" ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </button>
                    <button onClick={download} aria-label="Download prior authorization request as a .txt file" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground font-mono text-[11px] hover:text-primary hover:border-primary/40 transition-colors">
                      <Download className="w-3.5 h-3.5" /> .txt
                    </button>
                  </div>
                </div>
                <pre className="p-4 text-[11.5px] leading-relaxed text-foreground font-mono whitespace-pre-wrap break-words max-h-[70vh] overflow-y-auto">{letter}</pre>
              </div>
              <div role="status" aria-live="polite" className={copyState === "fail" ? "mt-2" : "sr-only"}>
                {copyState === "fail" && <span className="font-mono text-[11px] text-coral">Copy failed — your browser blocks clipboard access on insecure pages. Use the .txt download instead.</span>}
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-3 px-1">
                Draft only — verify against the payer's current medical policy and the medical record before submitting.
              </p>
            </div>
          </div>
        )}
      </main>

      <HealthcareFooter />
    </div>
  );
};

export default PaAcceleratePage;
