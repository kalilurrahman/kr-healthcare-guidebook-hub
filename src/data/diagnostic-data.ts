// RCM & GCC Maturity Diagnostic — assessment model.
// Grounded in the handbook's KPI benchmark bands (reader Ch5/Ch23) and the
// 5-level GCC Maturity Model (reader Ch12). A self-scoring instrument that
// converts the handbook's proprietary benchmark IP into a lead-generating tool.
// 100% client-side — no answers leave the browser.

export interface MaturityLevel {
  level: number;
  name: string;
  summary: string;
}

export interface DiagnosticOption {
  level: number; // 1..5
  text: string;
}

export interface DiagnosticQuestion {
  id: string;
  section: string; // section id
  dimension: string; // short label shown on the results chart
  prompt: string;
  benchmark: string; // best-in-class target, from the handbook
  options: DiagnosticOption[]; // exactly 5, level 1..5 ascending
  /** Prioritized action surfaced on the roadmap when the answer scores at or below 3. */
  lowRec: string;
  reference: string; // handbook pointer
}

export interface DiagnosticSection {
  id: string;
  label: string;
  blurb: string;
}

// 5-level maturity model (reader Ch12) — the overall verdict band.
export const maturityLevels: MaturityLevel[] = [
  { level: 1, name: "Transactional", summary: "Manual, cost-arbitrage operations. Work is processed, not measured. The priority is stabilizing the core and instrumenting basic KPIs." },
  { level: 2, name: "Rules-Based", summary: "Standardized workflows and some automation, but performance still trails benchmarks. The priority is closing the denial/AR gap and scaling RPA." },
  { level: 3, name: "Knowledge Ops", summary: "Benchmarked, analytics-informed operations with root-cause discipline. The priority is shifting from remediation to prevention and deploying AI in core workflows." },
  { level: 4, name: "Analytical Intelligence", summary: "Prevention-first, AI-assisted operations beating most benchmarks. The priority is agentic automation at scale with governance and board-grade visibility." },
  { level: 5, name: "Strategic Hub", summary: "AI-native operating model at best-in-class KPIs, owning global mandates and generating IP. The priority is compounding the moat and productizing capability." },
];

export const diagnosticSections: DiagnosticSection[] = [
  { id: "rcm", label: "Revenue Cycle Performance", blurb: "How the core financial engine performs against best-in-class KPIs." },
  { id: "ai", label: "AI & Automation Maturity", blurb: "How deeply AI and autonomous agents are embedded — and governed." },
  { id: "gcc", label: "GCC & Operating Model", blurb: "How the capability center is positioned, empowered, and measured." },
];

export const diagnosticQuestions: DiagnosticQuestion[] = [
  // ---------- Revenue Cycle ----------
  {
    id: "denial-rate", section: "rcm", dimension: "Denial Rate",
    prompt: "What is your initial (first-pass) claim denial rate?",
    benchmark: "Best-in-class: < 5% · Average: 10–12%",
    reference: "Reader Ch5 · Denial Prevention",
    options: [
      { level: 1, text: "Above 12% — we don't systematically track or analyze denials" },
      { level: 2, text: "10–12% — tracked, but worked reactively after they occur" },
      { level: 3, text: "7–9% — some root-cause analysis feeding back upstream" },
      { level: 4, text: "5–7% — a formal denial-prevention program is in place" },
      { level: 5, text: "Below 5% — AI flags denial risk before submission" },
    ],
    lowRec: "Stand up root-cause denial analytics and move from denials management to upstream prevention (fix documentation/eligibility at the source). This is the single highest-ROI RCM lever.",
  },
  {
    id: "clean-claim", section: "rcm", dimension: "Clean Claim Rate",
    prompt: "What share of claims pass payer edits on first submission (clean claim rate)?",
    benchmark: "Best-in-class: ≥ 97% · Average: 92–94%",
    reference: "Reader Ch8 · Claims Adjudication",
    options: [
      { level: 1, text: "Below 90% — heavy manual rework on most batches" },
      { level: 2, text: "90–93% — generic scrubber, few payer-specific rules" },
      { level: 3, text: "94–96% — payer rules maintained for top payers" },
      { level: 4, text: "97–98% — automated, payer-specific scrubbing" },
      { level: 5, text: "Above 98% — continuously tuned, near-zero manual touch" },
    ],
    lowRec: "Update claim scrubbers with payer-specific edit rules and monitor first-pass acceptance by payer weekly. Clean-claim submission is the fastest way to compress the cycle.",
  },
  {
    id: "ar-days", section: "rcm", dimension: "Days in A/R",
    prompt: "What is your median total days in accounts receivable?",
    benchmark: "Best-in-class: < 35 days · Average: 42–50",
    reference: "Reader Ch23 · Financial KPIs",
    options: [
      { level: 1, text: "Over 55 days" },
      { level: 2, text: "45–55 days" },
      { level: 3, text: "40–45 days" },
      { level: 4, text: "35–40 days" },
      { level: 5, text: "Under 35 days" },
    ],
    lowRec: "Build an executive A/R-aging dashboard segmented by payer and drive a worklist-prioritization program; sub-35-day A/R is achievable through automation, not headcount.",
  },
  {
    id: "auto-adjudication", section: "rcm", dimension: "Touchless Claims",
    prompt: "What share of claims are processed touchlessly (auto-adjudicated / no manual intervention)?",
    benchmark: "Best-in-class: > 92% · Average: 80–88%",
    reference: "Reader Ch8 · Auto-Adjudication",
    options: [
      { level: 1, text: "Below 60% — most claims need a human touch" },
      { level: 2, text: "60–79%" },
      { level: 3, text: "80–88%" },
      { level: 4, text: "89–92%" },
      { level: 5, text: "Above 92% — exception-only human review" },
    ],
    lowRec: "Map every manual touchpoint and route rules-clear claims to straight-through processing; reserve staff for genuine exceptions.",
  },
  {
    id: "prior-auth", section: "rcm", dimension: "Prior-Auth Turnaround",
    prompt: "What is your typical prior-authorization turnaround time?",
    benchmark: "Best-in-class: < 24h for 90%+ · CMS-0057 FHIR PA mandate live 2026–27",
    reference: "Reader Ch6 · Prior Authorization",
    options: [
      { level: 1, text: "Over 5 days — fully manual, phone/fax driven" },
      { level: 2, text: "3–5 days — portal-based, still manual" },
      { level: 3, text: "1.5–3 days — partial automation, some gold-carding" },
      { level: 4, text: "Under 1.5 days — automated determination + assembly" },
      { level: 5, text: "Under 24h for 90%+ — FHIR APIs + gold-carding at scale" },
    ],
    lowRec: "Adopt a FHIR-based PA reference architecture and gold-carding ahead of the CMS-0057 mandate; automate packet assembly and request-letter drafting.",
  },
  {
    id: "eligibility", section: "rcm", dimension: "Eligibility Accuracy",
    prompt: "How accurate and timely is your patient eligibility verification?",
    benchmark: "Best-in-class: > 98% real-time · Average: 88–94%",
    reference: "Reader Ch6 · Patient Access",
    options: [
      { level: 1, text: "Below 88% — frequent front-end errors drive downstream denials" },
      { level: 2, text: "88–93% — batch checks, gaps at point of service" },
      { level: 3, text: "94–96% — real-time checks for most encounters" },
      { level: 4, text: "97–98% — automated, integrated at scheduling" },
      { level: 5, text: "Above 98% — real-time, self-service, AI-assisted" },
    ],
    lowRec: "Automate real-time eligibility at scheduling and link it to pre-auth status; front-end accuracy prevents ~15% of denials at the source.",
  },
  // ---------- AI & Automation ----------
  {
    id: "ai-ops", section: "ai", dimension: "AI in Operations",
    prompt: "How embedded is AI / automation in your core operational workflows?",
    benchmark: "AI-first target: ~70% automation, staff shift to exception management",
    reference: "Reader Ch11 · GenAI at Scale",
    options: [
      { level: 1, text: "None — fully manual processing" },
      { level: 2, text: "Early pilots, nothing in production" },
      { level: 3, text: "RPA live in a few high-volume workflows" },
      { level: 4, text: "Autonomous agents in core RCM (>40% automation)" },
      { level: 5, text: "AI-first operating model — staff manage exceptions only" },
    ],
    lowRec: "Define autonomous-agent workflows for high-volume, rules-based tasks (claims creation, status, eligibility) using a PDD-based exception-escalation model.",
  },
  {
    id: "clinical-doc", section: "ai", dimension: "Documentation & CDI",
    prompt: "How is clinical documentation and CDI supported?",
    benchmark: "Ambient AI saves ~2h/shift; AI-assisted CDI with QA is best practice",
    reference: "Reader Ch7 · Coding & CDI",
    options: [
      { level: 1, text: "Manual dictation / typing, retrospective CDI" },
      { level: 2, text: "Templates and basic transcription" },
      { level: 3, text: "Speech recognition; concurrent CDI on some units" },
      { level: 4, text: "Ambient AI scribe piloted; AI-assisted CDI queries" },
      { level: 5, text: "Ambient AI at scale + AI CDI with independent QA" },
    ],
    lowRec: "Pilot an ambient AI scribe in high-volume clinics and add an independent QA rubric on its output; measure documentation-time reduction and query yield.",
  },
  {
    id: "ai-governance", section: "ai", dimension: "AI Governance",
    prompt: "How mature is your AI governance and assurance?",
    benchmark: "Best practice: bias audits, human-in-the-loop, audit trails, EU AI Act / ONC alignment",
    reference: "Recommended: ACUITAS™ AI Assurance chapter",
    options: [
      { level: 1, text: "None — AI used ad hoc, no oversight" },
      { level: 2, text: "Informal review, no written policy" },
      { level: 3, text: "A documented AI policy exists" },
      { level: 4, text: "Bias audits + human-in-the-loop on key models" },
      { level: 5, text: "Formal assurance framework, audit trails, regulatory mapping" },
    ],
    lowRec: "Establish an AI governance framework (ACUITAS™-style): guardrails, human-in-the-loop escalation, audit trails, and mapping to EU AI Act / ONC HTI rules before scaling agents.",
  },
  // ---------- GCC & Operating Model ----------
  {
    id: "gcc-maturity", section: "gcc", dimension: "GCC Maturity",
    prompt: "Where does your capability center (or outsourced ops) sit on the maturity curve?",
    benchmark: "Target: L4 Analytical Intelligence → L5 Strategic Hub",
    reference: "Reader Ch12 · GCC Maturity Model",
    options: [
      { level: 1, text: "Transactional — cost arbitrage, basic processing" },
      { level: 2, text: "Rules-based — standardized workflows, some automation" },
      { level: 3, text: "Knowledge ops — analytics and domain depth" },
      { level: 4, text: "Analytical intelligence — owns outcomes, drives improvement" },
      { level: 5, text: "Strategic hub — global mandates, IP generation, AI factory" },
    ],
    lowRec: "Define a maturity roadmap moving the center up-stack from processing to analytics and outcome ownership; recruit hybrid talent that spans US billing and data science.",
  },
  {
    id: "gcc-governance", section: "gcc", dimension: "Governance & Autonomy",
    prompt: "How much decision autonomy and global mandate does the center hold?",
    benchmark: "Mature: >75% decisions made locally; owns 2–4 global mandates",
    reference: "Reader Ch12 · Governance",
    options: [
      { level: 1, text: "None — fully HQ-controlled, execution only" },
      { level: 2, text: "Limited — escalates most decisions to HQ" },
      { level: 3, text: "Formal council; owns some end-to-end processes" },
      { level: 4, text: "High local autonomy; owns 1–2 global mandates" },
      { level: 5, text: "Co-creates strategy; owns multiple global mandates" },
    ],
    lowRec: "Establish a GCC charter and leadership council with defined autonomy tiers and a two-approval-layer rule; move from cost tool to capability hub.",
  },
  {
    id: "board-visibility", section: "gcc", dimension: "Analytics & Board Visibility",
    prompt: "How is operational performance surfaced to leadership?",
    benchmark: "Best practice: real-time performance hub, three-layer KPI dashboard to the board",
    reference: "Reader Ch23 · Analytics Hub",
    options: [
      { level: 1, text: "Retrospective, manual monthly reports" },
      { level: 2, text: "Periodic dashboards, lagging by weeks" },
      { level: 3, text: "Recurring dashboards with benchmark bands" },
      { level: 4, text: "Near-real-time hub; leaders self-serve" },
      { level: 5, text: "Real-time three-layer KPI dashboard to the board" },
    ],
    lowRec: "Deploy a real-time performance hub with tri-band KPI targets (best-in-class / average / warning) so leaders can pivot before financial drift compounds.",
  },
];

// Board questions to bring to leadership, surfaced with the results.
export const boardQuestions: string[] = [
  "Is our GCC positioned as a capability hub, or still treated as a cost tool?",
  "If our denial rate is above 8%, what data-quality problem is it masking upstream?",
  "What percentage of our RCM workflows could run exception-only with autonomous agents?",
  "Do we govern our AI (bias audits, human-in-the-loop, audit trails) before we scale it?",
  "Which two global mandates could our capability center own within 12 months?",
];
