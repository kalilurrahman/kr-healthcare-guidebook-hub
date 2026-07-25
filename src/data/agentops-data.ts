// AgentOps GCC Launch — planner model.
// Productizes the handbook's 5-day AI-agent enablement curriculum (Vol 3) and
// the GCC operating model into a concrete launch plan: pick the RCM workflows,
// pick the autonomy level, get a Process Definition Document (PDD) outline,
// an exception-escalation design, a 5-day enablement schedule and go-live KPIs.
// Fully client-side — the output is a plan, not a deployment.

export interface AgentWorkflow {
  id: string;
  name: string;
  tower: "Patient Access" | "Coding & CDI" | "Claims" | "Denials" | "Payer Ops";
  description: string;
  /** 1 = rules-clear and reversible, 5 = clinical judgement / hard to reverse. */
  riskTier: number;
  volumeDriver: string;
  automationCeiling: string;
  benchmark: string;
  exceptions: string[];
  goLiveKpis: string[];
  /** Highest autonomy this workflow should reach, given its risk. */
  maxAutonomy: number;
}

export interface AutonomyLevel {
  level: number;
  name: string;
  description: string;
  humanRole: string;
}

export interface CurriculumDay {
  day: number;
  title: string;
  focus: string;
  activities: string[];
  deliverable: string;
}

export const autonomyLevels: AutonomyLevel[] = [
  { level: 1, name: "Assist", description: "The agent drafts or suggests; a human performs every action.", humanRole: "Does the work, uses the agent as a co-pilot." },
  { level: 2, name: "Review-All", description: "The agent completes the task; a human reviews 100% before release.", humanRole: "Reviews every item." },
  { level: 3, name: "Review-Sample", description: "The agent completes and releases; a human QA-samples a defined percentage.", humanRole: "Audits a statistically meaningful sample." },
  { level: 4, name: "Exception-Only", description: "The agent runs unsupervised; humans handle only escalated exceptions.", humanRole: "Works the exception queue." },
  { level: 5, name: "Self-Optimising", description: "The agent runs unsupervised and tunes its own rules within guardrails.", humanRole: "Governs thresholds and reviews drift." },
];

export const agentWorkflows: AgentWorkflow[] = [
  {
    id: "eligibility", name: "Eligibility Verification", tower: "Patient Access",
    description: "Real-time coverage and benefit verification at scheduling and registration.",
    riskTier: 1, maxAutonomy: 5,
    volumeDriver: "Every scheduled encounter",
    automationCeiling: "90–95% touchless",
    benchmark: "Best-in-class: >98% accuracy",
    exceptions: ["Payer portal returns ambiguous or partial coverage", "Member not found / demographic mismatch", "Coordination-of-benefits conflict"],
    goLiveKpis: ["Eligibility accuracy %", "Touchless verification rate", "Front-end denial rate attributable to eligibility"],
  },
  {
    id: "prior-auth", name: "Prior Authorization", tower: "Patient Access",
    description: "Determine PA requirement, assemble the packet, submit and track to determination.",
    riskTier: 3, maxAutonomy: 4,
    volumeDriver: "PA-required services",
    automationCeiling: "60–75% touchless",
    benchmark: "Best-in-class: <24h for 90%+ of requests",
    exceptions: ["Payer requires clinical narrative or peer-to-peer", "Policy ambiguity on medical necessity", "Urgent/emergent pathway"],
    goLiveKpis: ["PA turnaround time", "PA approval rate", "% touchless PA determinations"],
  },
  {
    id: "claim-status", name: "Claim Status Follow-Up", tower: "Claims",
    description: "Poll payer systems for claim status and route actionable states to worklists.",
    riskTier: 1, maxAutonomy: 5,
    volumeDriver: "Open A/R inventory",
    automationCeiling: "95%+ touchless",
    benchmark: "Best-in-class: A/R days <35",
    exceptions: ["Payer system unavailable", "Status code with no mapped action"],
    goLiveKpis: ["Days in A/R", "Touchless status-check rate", "Claims worked per FTE"],
  },
  {
    id: "claim-scrub", name: "Claim Scrubbing & Submission", tower: "Claims",
    description: "Apply payer-specific edits pre-submission and release clean claims.",
    riskTier: 2, maxAutonomy: 4,
    volumeDriver: "All outbound claims",
    automationCeiling: "85–92% touchless",
    benchmark: "Best-in-class: clean claim rate ≥97%",
    exceptions: ["Edit conflict requiring coder judgement", "New or changed payer rule", "High-dollar claim above review threshold"],
    goLiveKpis: ["Clean claim rate", "First-pass acceptance", "Cost to collect"],
  },
  {
    id: "denial-triage", name: "Denial Triage & Routing", tower: "Denials",
    description: "Classify denials by CARC/RARC and root cause, then route to the right work queue.",
    riskTier: 2, maxAutonomy: 4,
    volumeDriver: "Denied claim volume",
    automationCeiling: "80–90% touchless",
    benchmark: "Best-in-class: first-pass denial <5%",
    exceptions: ["Novel or unmapped denial reason", "Denial spanning multiple root causes"],
    goLiveKpis: ["Denial rate", "Time-to-first-action on denials", "Root-cause coverage %"],
  },
  {
    id: "appeal-draft", name: "Appeal Letter Drafting", tower: "Denials",
    description: "Generate a payer-specific, clinically-argued appeal from the denial and record.",
    riskTier: 4, maxAutonomy: 3,
    volumeDriver: "Appealable denials",
    automationCeiling: "70% drafted, human-signed",
    benchmark: "Best-in-class: overturn rate >65%",
    exceptions: ["Clinical-validation denial requiring physician input", "Novel policy argument", "Any letter leaving the organisation unsigned"],
    goLiveKpis: ["Overturn rate", "Appeal cycle time", "Appeals per FTE"],
  },
  {
    id: "coding-suggest", name: "Coding Suggestion & Rationale", tower: "Coding & CDI",
    description: "Suggest ICD-10/CPT codes with cited rationale for coder confirmation.",
    riskTier: 4, maxAutonomy: 3,
    volumeDriver: "Encounter volume",
    automationCeiling: "Autonomous only on low-complexity, high-volume encounters",
    benchmark: "Best-in-class: coding accuracy >97%",
    exceptions: ["Complex or high-acuity encounter", "Documentation insufficient to code", "Any HCC-affecting code"],
    goLiveKpis: ["Coding accuracy", "Coder productivity (charts/FTE/day)", "DNFB days"],
  },
  {
    id: "cdi-query", name: "CDI Query Drafting", tower: "Coding & CDI",
    description: "Draft compliant, non-leading physician queries where documentation lacks specificity.",
    riskTier: 4, maxAutonomy: 2,
    volumeDriver: "Charts failing specificity checks",
    automationCeiling: "Drafted, always CDI-reviewed before sending",
    benchmark: "Best-in-class: query response rate >90%",
    exceptions: ["Any query risking a leading question", "Physician escalation", "Query affecting risk adjustment"],
    goLiveKpis: ["Query rate and response rate", "Case Mix Index movement", "Query agreement rate"],
  },
  {
    id: "payment-posting", name: "Payment Posting & Reconciliation", tower: "Payer Ops",
    description: "Post 835 remittances, reconcile to expected reimbursement, flag variances.",
    riskTier: 2, maxAutonomy: 4,
    volumeDriver: "Remittance volume",
    automationCeiling: "90%+ touchless",
    benchmark: "Best-in-class: net collection rate >98%",
    exceptions: ["Underpayment beyond tolerance", "Unmatched remittance", "Takeback / recoupment"],
    goLiveKpis: ["Net collection rate", "Posting lag", "Underpayment recovery"],
  },
  {
    id: "credentialing", name: "Provider Enrollment & Credentialing", tower: "Payer Ops",
    description: "Primary-source verification and payer enrollment tracking for new clinicians.",
    riskTier: 3, maxAutonomy: 3,
    volumeDriver: "New and re-credentialing providers",
    automationCeiling: "60–70% touchless",
    benchmark: "Best-in-class: 30% cycle-time reduction",
    exceptions: ["PSV discrepancy or adverse finding", "Payer-specific manual process"],
    goLiveKpis: ["Credentialing cycle time", "Time-to-first-bill for new providers", "Enrollment backlog"],
  },
];

export const curriculum: CurriculumDay[] = [
  {
    day: 1, title: "Fundamentals", focus: "Agent capabilities and the operating-model shift",
    activities: ["Map what agents can and cannot do in each selected workflow", "Set the staff narrative: processor → exception manager", "Baseline current KPIs for every chosen workflow"],
    deliverable: "Capability audit + KPI baseline",
  },
  {
    day: 2, title: "Workflow Mapping (PDD)", focus: "Turn current process into a Process Definition Document",
    activities: ["Screen-level walkthrough of each workflow", "Document the happy path, decision points and data sources", "Enumerate exception cases and who owns each"],
    deliverable: "Draft PDD per workflow, with exception register",
  },
  {
    day: 3, title: "Monitoring & QA", focus: "The new supervisory role",
    activities: ["Train staff on the agent dashboard and exception queue", "Define QA sampling and override reason codes", "Set escalation protocols and response SLAs"],
    deliverable: "QA protocol + escalation matrix",
  },
  {
    day: 4, title: "Integration & Optimisation", focus: "Connect, tune, and shadow-run",
    activities: ["EHR / clearinghouse integration checks", "Load payer-specific rules and thresholds", "Shadow-mode run: agent output compared to human, no release"],
    deliverable: "Shadow-run divergence report",
  },
  {
    day: 5, title: "Go-Live", focus: "Controlled production rollout",
    activities: ["Go/no-go against the shadow-run acceptance criteria", "Phased volume ramp with rollback trigger", "Stand up the KPI dashboard and reporting cadence"],
    deliverable: "Signed go-live checklist + live KPI dashboard",
  },
];

export const gccPhases = [
  { phase: "Phase 1 · Months 1–3", label: "Stabilise", detail: "Baseline KPIs, select low-risk workflows, run the 5-day enablement, ship one workflow to Exception-Only." },
  { phase: "Phase 2 · Months 4–8", label: "Scale", detail: "Extend to the remaining Tier 1–2 workflows; stand up the agent-estate dashboard and assurance gates." },
  { phase: "Phase 3 · Months 9–12", label: "Own Outcomes", detail: "Move the centre up-stack: analytics and outcome ownership, graduated autonomy on Tier 3 workflows, global mandate candidates." },
];
