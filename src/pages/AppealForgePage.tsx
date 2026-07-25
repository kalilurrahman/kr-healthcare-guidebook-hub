import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft, FileText, Copy, Check, Download, Target, ShieldAlert, Paperclip, Lightbulb, Wand2,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HealthcareFooter } from "@/components/HealthcareFooter";
import { payers, appealLevels, denialTypes } from "@/data/appealforge-data";
import { useSeo, routeSeo } from "@/lib/seo";

interface ClaimFields {
  patient: string;
  memberId: string;
  claimNo: string;
  dos: string;
  service: string;
  provider: string;
  npi: string;
  practice: string;
  contact: string;
  extra: string;
}

const emptyFields: ClaimFields = {
  patient: "", memberId: "", claimNo: "", dos: "", service: "",
  provider: "", npi: "", practice: "", contact: "", extra: "",
};

function orToken(value: string, token: string) {
  return value.trim() ? value.trim() : `[${token}]`;
}

const AppealForgePage = () => {
  useSeo(routeSeo.appealForge);
  const [payerId, setPayerId] = useState(payers[0].id);
  const [denialId, setDenialId] = useState(denialTypes[0].id);
  const [levelId, setLevelId] = useState(appealLevels[0].id);
  const [carc, setCarc] = useState(denialTypes[0].carc);
  const [fields, setFields] = useState<ClaimFields>(emptyFields);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");

  const payer = payers.find((p) => p.id === payerId)!;
  const denial = denialTypes.find((d) => d.id === denialId)!;
  const level = appealLevels.find((l) => l.id === levelId)!;

  const onDenialChange = useCallback((id: string) => {
    setDenialId(id);
    const d = denialTypes.find((x) => x.id === id);
    if (d) setCarc(d.carc);
  }, []);

  const setField = useCallback((k: keyof ClaimFields, v: string) => {
    setFields((prev) => ({ ...prev, [k]: v }));
  }, []);

  const letter = useMemo(() => {
    const argumentBlock = denial.argument.map((a) => `  •  ${a}`).join("\n");
    const attachBlock = denial.attachments.map((a) => `  •  ${a}`).join("\n");
    const extra = fields.extra.trim()
      ? `\nAdditional context:\n${fields.extra.trim()}\n`
      : "";

    return `${orToken(fields.practice, "Practice / Provider letterhead")}
${orToken(fields.contact, "Address · Phone · Fax")}

[Date]

${payer.name}
Attn: Appeals Department

RE: ${level.label} — Appeal of Claim Denial

Patient:            ${orToken(fields.patient, "Patient initials")}
Member ID:          ${orToken(fields.memberId, "Member ID")}
Claim #:            ${orToken(fields.claimNo, "Claim number")}
Date(s) of Service: ${orToken(fields.dos, "MM/DD/YYYY")}
Procedure/Service:  ${orToken(fields.service, "CPT / service description")}
Rendering Provider: ${orToken(fields.provider, "Provider name")} (NPI ${orToken(fields.npi, "NPI")})
Denial Code:        ${carc.trim() || "[CARC]"} — ${denial.label}

To Whom It May Concern:

We are formally appealing the denial of the above-referenced claim, which was denied as "${denial.label}" (${carc.trim() || "[CARC]"}). We respectfully request reconsideration and payment for the reasons set out below.

${denial.strategy}

Specifically:
${argumentBlock}
${extra}
Enclosed in support of this appeal:
${attachBlock}

${level.closer} We request that ${payer.name} process this claim within the timeframe required under the applicable plan, state, ERISA, or Medicare appeal rules. Please direct any questions to the undersigned.

Sincerely,

${orToken(fields.provider, "Provider / Authorized representative")}
${orToken(fields.practice, "Practice name")}
${orToken(fields.contact, "Phone · Email")}

— Prepared with AppealForge. Payer note: ${payer.note}`;
  }, [payer, denial, level, carc, fields]);

  const copy = useCallback(async () => {
    try {
      // navigator.clipboard is undefined on non-secure origins; without a
      // failure state this button silently did nothing.
      await navigator.clipboard.writeText(letter);
      setCopyState("ok");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("fail");
    }
  }, [letter]);

  const download = useCallback(() => {
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // Strip anything that isn't filename-safe; a blank claim number would
    // otherwise yield a trailing-dash name.
    const safe = (fields.claimNo || "").replace(/[^A-Za-z0-9._-]/g, "").slice(0, 40) || "draft";
    a.download = `appeal-${denial.id}-${safe}.txt`;
    // Attach + defer revoke: WebKit/Gecko can abort a download whose object
    // URL is revoked in the same task, or whose anchor is detached.
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }, [letter, denial.id, fields.claimNo]);

  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40";
  const labelCls = "font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block";

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-bold text-foreground">AppealForge</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <Wand2 className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">Denial code → appeal letter · in seconds</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Appeal<span className="gradient-text">Forge</span>
          </h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Pick the payer and denial reason, add the claim details, and get a payer-specific, clinically-argued appeal letter built on the handbook's codified appeal strategies. Everything runs in your browser — no PHI is transmitted.
          </p>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4 flex-1 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ---------- LEFT: inputs ---------- */}
          <div className="space-y-5">
            <div className="card-pharma space-y-4">
              <h2 className="font-display text-sm font-bold text-foreground">1 · The denial</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} htmlFor="payer">Payer</label>
                  <select id="payer" className={inputCls} value={payerId} onChange={(e) => setPayerId(e.target.value)}>
                    {payers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="level">Appeal level</label>
                  <select id="level" className={inputCls} value={levelId} onChange={(e) => setLevelId(e.target.value)}>
                    {appealLevels.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="denial">Denial reason</label>
                  <select id="denial" className={inputCls} value={denialId} onChange={(e) => onDenialChange(e.target.value)}>
                    {denialTypes.map((d) => <option key={d.id} value={d.id}>{d.label} ({d.category})</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="carc">CARC / RARC code</label>
                  <input id="carc" className={inputCls} value={carc} onChange={(e) => setCarc(e.target.value)} placeholder="e.g. CARC 50" />
                </div>
              </div>
            </div>

            <div className="card-pharma space-y-4">
              <h2 className="font-display text-sm font-bold text-foreground">2 · Claim details <span className="font-mono text-[10px] text-muted-foreground font-normal">(optional — blanks become fill-in tokens)</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className={labelCls} htmlFor="patient">Patient (initials only)</label><input id="patient" className={inputCls} value={fields.patient} onChange={(e) => setField("patient", e.target.value)} placeholder="J.D." /></div>
                <div><label className={labelCls} htmlFor="memberId">Member ID</label><input id="memberId" className={inputCls} value={fields.memberId} onChange={(e) => setField("memberId", e.target.value)} /></div>
                <div><label className={labelCls} htmlFor="claimNo">Claim #</label><input id="claimNo" className={inputCls} value={fields.claimNo} onChange={(e) => setField("claimNo", e.target.value)} /></div>
                <div><label className={labelCls} htmlFor="dos">Date(s) of service</label><input id="dos" className={inputCls} value={fields.dos} onChange={(e) => setField("dos", e.target.value)} placeholder="MM/DD/YYYY" /></div>
                <div><label className={labelCls} htmlFor="service">Procedure / service</label><input id="service" className={inputCls} value={fields.service} onChange={(e) => setField("service", e.target.value)} placeholder="CPT + description" /></div>
                <div><label className={labelCls} htmlFor="provider">Rendering provider</label><input id="provider" className={inputCls} value={fields.provider} onChange={(e) => setField("provider", e.target.value)} /></div>
                <div><label className={labelCls} htmlFor="npi">NPI</label><input id="npi" className={inputCls} value={fields.npi} onChange={(e) => setField("npi", e.target.value)} /></div>
                <div><label className={labelCls} htmlFor="practice">Practice name</label><input id="practice" className={inputCls} value={fields.practice} onChange={(e) => setField("practice", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={labelCls} htmlFor="contact">Contact (address · phone · email)</label><input id="contact" className={inputCls} value={fields.contact} onChange={(e) => setField("contact", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={labelCls} htmlFor="extra">Additional context (optional)</label><textarea id="extra" rows={2} className={inputCls} value={fields.extra} onChange={(e) => setField("extra", e.target.value)} placeholder="e.g. auth #, emergent presentation, prior conservative treatment…" /></div>
              </div>
            </div>

            {/* Strategy panel */}
            <div className="card-pharma space-y-4">
              <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Why this works</h2>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Root cause</div>
                <p className="font-body text-xs text-muted-foreground">{denial.rootCause}</p>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5"><Paperclip className="w-3 h-3" /> Attach to maximize overturn</div>
                <ul className="space-y-1">
                  {denial.attachments.map((a) => (
                    <li key={a} className="font-body text-xs text-muted-foreground flex gap-2"><span className="text-primary">✓</span> {a}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                <div className="font-mono text-[9px] uppercase tracking-wider text-primary mb-1 flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" /> Overturn insight</div>
                <p className="font-body text-xs text-foreground">{denial.overturnNote}</p>
              </div>
              <div className="rounded-lg bg-muted/40 border border-border p-3">
                <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5"><Lightbulb className="w-3 h-3" /> Prevent it upstream</div>
                <p className="font-body text-xs text-muted-foreground">{denial.prevention}</p>
              </div>
            </div>
          </div>

          {/* ---------- RIGHT: generated letter ---------- */}
          <div className="lg:sticky lg:top-20 self-start">
            <div className="card-pharma p-0 overflow-hidden">
              <div className="flex items-center justify-between gap-3 p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h2 className="font-display text-sm font-bold text-foreground">Appeal letter</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={copy} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-mono text-[11px] font-bold hover:opacity-90 transition-opacity">
                    {copyState === "ok" ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                  <button
                    onClick={download}
                    aria-label="Download appeal letter as a .txt file"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground font-mono text-[11px] hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> .txt
                  </button>
                </div>
              </div>
              <motion.pre
                key={`${payerId}-${denialId}-${levelId}`}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="p-4 text-[11.5px] leading-relaxed text-foreground font-mono whitespace-pre-wrap break-words max-h-[70vh] overflow-y-auto"
              >
                {letter}
              </motion.pre>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground mt-3 px-1">
              Draft only — review, verify against the medical record, and have an authorized representative sign before sending. The production tier adds LLM-drafted clinical argumentation behind a BAA plus payer-specific formatting.
            </p>
          </div>
        </div>
      </main>

      <HealthcareFooter />
    </div>
  );
};

export default AppealForgePage;
