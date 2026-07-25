// AI Assurance — the ACUITAS™ framework applied to healthcare agentic AI.
//
// PROVENANCE: the seven pillars, their letters and their core definitions are
// Kalilur Rahman's proprietary ACUITAS framework, as authored in the Pharma DX
// Handbook ("AI-driven Continuous Understanding and Integrated Testing
// Architecture System"). They are reproduced here verbatim in `corePrinciple`.
// The `healthcareApplication`, `agenticRisk`, controls and regulatory mappings
// are the healthcare/RCM adaptation layer built on top of them.

export interface AcuitasPillar {
  letter: string;
  id: string;
  title: string;
  /** KR's original ACUITAS definition — do not paraphrase. */
  corePrinciple: string;
  /** How the pillar lands in a healthcare / RCM agentic context. */
  healthcareApplication: string;
  /** What goes wrong when this pillar is missing once agents act autonomously. */
  agenticRisk: string;
  controls: string[];
  evidence: string[];
  regulatory: string[];
}

export interface AssuranceLevel {
  level: number;
  name: string;
  summary: string;
}

export const acuitasMeta = {
  name: "ACUITAS™",
  expansion: "AI-driven Continuous Understanding and Integrated Testing Architecture System",
  author: "Kalilur Rahman",
  pillarCount: 7,
  note: "A proprietary quality-engineering framework for AI-augmented, regulated environments — applied here to healthcare agentic AI.",
};

export const acuitasPillars: AcuitasPillar[] = [
  {
    letter: "A", id: "ai-driven-quality", title: "AI-Driven Quality",
    corePrinciple: "Deploying AI and ML to automate quality checks, predict defects, and optimise test coverage.",
    healthcareApplication: "Use AI to police AI: automated QA over agent output — coding accuracy, claim scrubbing, documentation completeness — rather than sampling a few charts by hand.",
    agenticRisk: "Agents scale error as fast as they scale throughput. Manual sampling that worked at 200 claims/day is statistically meaningless at 20,000.",
    controls: [
      "Automated QA scoring on 100% of agent output, not a sample",
      "Predictive denial-risk scoring before submission",
      "Drift detection on agent accuracy, by payer and by workflow",
    ],
    evidence: ["QA score distribution over time", "Per-agent accuracy vs. human baseline", "Drift alerts and their dispositions"],
    regulatory: ["NIST AI RMF — MEASURE", "ONC HTI-1 decision-support transparency"],
  },
  {
    letter: "C", id: "continuous-testing", title: "Continuous Testing",
    corePrinciple: "Integrating automated testing into every stage of the software development lifecycle.",
    healthcareApplication: "Agent behaviour is re-tested on every prompt, model, rule or payer-policy change — the regression suite covers workflows, not just code.",
    agenticRisk: "A silent model or prompt update changes claim behaviour overnight with no diff and no release note. Payer rules change monthly and nothing re-validates.",
    controls: [
      "Golden-set regression suite of representative claims and notes",
      "Re-run on every model, prompt or payer-rule change",
      "Shadow-mode runs before any autonomy increase",
    ],
    evidence: ["Regression pass rate per release", "Shadow-vs-production divergence reports"],
    regulatory: ["NIST AI RMF — MANAGE", "EU AI Act Art. 15 (accuracy & robustness)"],
  },
  {
    letter: "U", id: "user-centric-design", title: "User-Centric Design",
    corePrinciple: "Designing systems with the end user — scientist, clinician, regulator, or patient — at the centre.",
    healthcareApplication: "The coder, biller and clinician supervising agents must be able to see why an agent acted, and override it without friction. Design for the overseer, not the demo.",
    agenticRisk: "Automation complacency: when the interface makes accepting easier than checking, human review becomes a rubber stamp and the 'human in the loop' is theatre.",
    controls: [
      "Every agent action carries a plain-language rationale",
      "One-click override with a captured reason code",
      "Escalation queues designed around exception load, not volume",
    ],
    evidence: ["Override rate and reason-code mix", "Time-on-review per exception", "Reviewer fatigue / throughput metrics"],
    regulatory: ["EU AI Act Art. 14 (human oversight)", "ONC HTI-1 source attributes"],
  },
  {
    letter: "I", id: "integrated-validation", title: "Integrated Validation",
    corePrinciple: "GAMP 5-aligned CSV methodology for all regulated systems.",
    healthcareApplication: "Risk-based validation of agent workflows before they touch live claims or the record — the healthcare analogue of CSV/CSA, scaled to the risk each workflow carries.",
    agenticRisk: "Agents are deployed as 'just a tool' with no validation gate, then quietly become the system of record for coding decisions.",
    controls: [
      "Documented validation plan per agent workflow, risk-tiered",
      "Formal go-live gate with named accountable owner",
      "Revalidation triggers on material change",
    ],
    evidence: ["Validation packages per workflow", "Go-live sign-off records"],
    regulatory: ["FDA CSA (risk-based assurance)", "HIPAA Security Rule §164.308(a)(8) evaluation"],
  },
  {
    letter: "T", id: "traceability", title: "Traceability",
    corePrinciple: "End-to-end Requirements Traceability Matrix linking requirements to test results.",
    healthcareApplication: "Every autonomous action is reconstructable: which agent, which version, which policy, which inputs, which human reviewed it. An auditor must be able to walk a single claim end-to-end.",
    agenticRisk: "A payer audit or OIG inquiry lands and the organisation cannot explain why a code was assigned eighteen months ago — the model has since changed twice.",
    controls: [
      "Immutable action log: agent ID, version, inputs, output, reviewer",
      "Policy and prompt versioning tied to each decision",
      "Retention aligned to payer audit and record-retention windows",
    ],
    evidence: ["Single-claim end-to-end trace on demand", "Version history for prompts, models and rules"],
    regulatory: ["HIPAA §164.312(b) audit controls", "EU AI Act Art. 12 (record-keeping)", "Payer audit / OIG readiness"],
  },
  {
    letter: "A₂", id: "adaptive-risk", title: "Adaptive Risk Management",
    corePrinciple: "ICH Q9-aligned pharmaceutical quality risk management with dynamic updates.",
    healthcareApplication: "Autonomy is earned per workflow and continuously re-scored. Risk tiering drives how much a given agent may do unsupervised — and that tier moves with observed performance.",
    agenticRisk: "Blanket autonomy: a agent trusted on eligibility checks is given the same latitude on clinical-validation appeals, where being wrong is a patient-safety and compliance event.",
    controls: [
      "Risk tier per workflow (financial exposure × clinical impact × reversibility)",
      "Autonomy graduated by tier, re-scored on a fixed cadence",
      "Automatic autonomy rollback on threshold breach",
    ],
    evidence: ["Risk register by workflow", "Autonomy-change log with justification"],
    regulatory: ["NIST AI RMF — GOVERN/MAP", "EU AI Act Art. 9 (risk management system)"],
  },
  {
    letter: "S", id: "system-intelligence", title: "System Intelligence",
    corePrinciple: "Real-time quality dashboards aggregating KPIs across all GCC functions and sites.",
    healthcareApplication: "One board-grade view of the agent estate: what is running, at what autonomy, at what accuracy, with what exception backlog — across every GCC site and workflow.",
    agenticRisk: "Nobody owns the aggregate. Each workflow looks fine in isolation while total exception backlog and blended accuracy quietly degrade.",
    controls: [
      "Single agent-estate dashboard across sites and workflows",
      "Exception backlog and ageing as first-class metrics",
      "Board-level reporting cadence on AI performance and incidents",
    ],
    evidence: ["Estate dashboard", "Board reporting pack", "Incident log and post-incident reviews"],
    regulatory: ["NIST AI RMF — GOVERN", "Enterprise AI governance committee charter"],
  },
];

export const assuranceLevels: AssuranceLevel[] = [
  { level: 1, name: "Ad Hoc", summary: "AI is used without governance. No validation gate, no audit trail, no owner. Any autonomous deployment is an unmanaged compliance exposure." },
  { level: 2, name: "Documented", summary: "A written AI policy exists and major workflows have some review, but controls are inconsistent and evidence is assembled reactively." },
  { level: 3, name: "Controlled", summary: "Risk-tiered validation, human-in-the-loop on material decisions, and a working audit trail. Defensible for most payer scrutiny." },
  { level: 4, name: "Assured", summary: "Continuous automated QA, regression on every change, graduated autonomy with rollback, and board-grade estate visibility. Audit-ready by construction." },
  { level: 5, name: "Self-Improving", summary: "Assurance is itself instrumented — drift, override patterns and incidents feed back into agent design. Governance is a competitive asset, not a cost." },
];

/** Yes/no gates used by the readiness self-check, mapped to pillars. */
export interface AssuranceGate {
  id: string;
  pillar: string; // pillar id
  question: string;
  weight: number;
}

export const assuranceGates: AssuranceGate[] = [
  { id: "g1", pillar: "ai-driven-quality", question: "Is agent output QA-scored automatically on 100% of volume (not sampled by hand)?", weight: 1 },
  { id: "g2", pillar: "ai-driven-quality", question: "Do you detect accuracy drift by payer and workflow, with alerting?", weight: 1 },
  { id: "g3", pillar: "continuous-testing", question: "Is there a golden-set regression suite re-run on every model, prompt or payer-rule change?", weight: 1 },
  { id: "g4", pillar: "continuous-testing", question: "Does every autonomy increase run in shadow mode before going live?", weight: 1 },
  { id: "g5", pillar: "user-centric-design", question: "Does every agent action carry a plain-language rationale the reviewer can see?", weight: 1 },
  { id: "g6", pillar: "user-centric-design", question: "Do you measure override rate and review time to detect rubber-stamping?", weight: 1 },
  { id: "g7", pillar: "integrated-validation", question: "Is there a documented, risk-tiered validation package per agent workflow?", weight: 1 },
  { id: "g8", pillar: "integrated-validation", question: "Is there a formal go-live gate with a named accountable owner?", weight: 1 },
  { id: "g9", pillar: "traceability", question: "Can you reconstruct a single claim end-to-end — agent, version, inputs, reviewer — on demand?", weight: 1 },
  { id: "g10", pillar: "traceability", question: "Are prompts, models and rules versioned and tied to each decision?", weight: 1 },
  { id: "g11", pillar: "adaptive-risk", question: "Is autonomy graduated per workflow by a documented risk tier?", weight: 1 },
  { id: "g12", pillar: "adaptive-risk", question: "Does autonomy roll back automatically when accuracy breaches a threshold?", weight: 1 },
  { id: "g13", pillar: "system-intelligence", question: "Is there one dashboard covering the whole agent estate across sites?", weight: 1 },
  { id: "g14", pillar: "system-intelligence", question: "Does the board receive a regular AI performance and incident report?", weight: 1 },
];
