// PA-Accelerate — prior-authorization readiness + request packet builder.
//
// Two halves, matching how the offering sells: a CMS-0057-F readiness gap check
// (the blueprint conversation) and a PA request packet generator (the fast,
// immediately useful piece). Client-side and deterministic; no PHI transmitted.
//
// Dates referenced here are the CMS-0057-F compliance dates verified in the
// Regulatory Calendar (src/data/regulatory-data.ts) — keep the two in step.

export interface PaServiceCategory {
  id: string;
  name: string;
  examples: string;
  /** Typical payer scrutiny — drives how much clinical justification is needed. */
  scrutiny: "standard" | "elevated" | "high";
  medicalNecessityElements: string[];
  commonDenialReasons: string[];
  documentation: string[];
  goldCardingNote: string;
}

export interface PaReadinessGate {
  id: string;
  area: "Intake" | "Determination" | "Submission" | "Tracking" | "Interoperability";
  question: string;
  /** Which CMS-0057-F obligation this maps to, if any. */
  mapsTo?: string;
  /** Why it matters, shown when unmet. */
  gap: string;
}

export const paComplianceDates = [
  { date: "1 Jan 2026", what: "Core PA requirements apply to MA, Medicaid/CHIP managed care and FFE QHP issuers", status: "in effect" },
  { date: "31 Mar 2026", what: "First public reporting of PA metrics (covering CY2025)", status: "in effect" },
  { date: "1 Jan 2027", what: "Prior Auth / Patient Access / Provider Access / Payer-to-Payer APIs; state Medicaid & CHIP FFS", status: "upcoming" },
];

export const paServiceCategories: PaServiceCategory[] = [
  {
    id: "advanced-imaging",
    name: "Advanced imaging (MRI / CT / PET)",
    examples: "Lumbar MRI, cardiac CT, oncology PET",
    scrutiny: "elevated",
    medicalNecessityElements: [
      "Duration and character of symptoms",
      "Conservative therapy already attempted, with dates and outcome",
      "Specific clinical question the study will answer",
      "Why a lower-cost modality is insufficient",
    ],
    commonDenialReasons: ["Conservative therapy not documented", "Study considered duplicative", "Site-of-service redirection"],
    documentation: ["Recent office notes", "Conservative-therapy history (PT, medication trials)", "Prior imaging and reports", "Ordering physician's clinical rationale"],
    goldCardingNote: "Imaging is one of the most commonly gold-carded categories — high volume and measurable approval rates make it the best first candidate to negotiate.",
  },
  {
    id: "specialty-drug",
    name: "Specialty drug / biologic",
    examples: "Biologics, infusions, high-cost injectables",
    scrutiny: "high",
    medicalNecessityElements: [
      "Confirmed diagnosis with supporting labs or imaging",
      "Step therapy: prior agents tried, duration, and reason for failure or intolerance",
      "Dosing and administration plan",
      "Baseline measures to be used for continuation review",
    ],
    commonDenialReasons: ["Step therapy not satisfied", "Diagnosis not supported by labs", "Site-of-care policy", "Non-formulary without exception request"],
    documentation: ["Diagnosis confirmation", "Complete step-therapy history", "Relevant labs / biomarkers", "Formulary exception request where applicable"],
    goldCardingNote: "Rarely gold-carded — high cost keeps payers in the loop. Optimise the packet instead, and expect continuation reviews.",
  },
  {
    id: "surgical",
    name: "Elective surgical procedure",
    examples: "Joint replacement, spinal fusion, bariatric surgery",
    scrutiny: "high",
    medicalNecessityElements: [
      "Diagnosis with severity and functional impairment documented",
      "Conservative management trialled, with duration and outcome",
      "Imaging or diagnostic findings corroborating the indication",
      "Procedure-specific criteria from the payer's policy",
    ],
    commonDenialReasons: ["Conservative management insufficient", "Criteria in payer policy not addressed point-by-point", "Site-of-service (inpatient vs ASC)"],
    documentation: ["Surgeon's evaluation", "Conservative-treatment record", "Imaging reports", "Payer policy criteria mapped to the record"],
    goldCardingNote: "Address the payer's published criteria point-by-point in the order the policy lists them — reviewers work from that checklist.",
  },
  {
    id: "dme",
    name: "Durable medical equipment",
    examples: "CPAP, wheelchairs, home oxygen, CGM",
    scrutiny: "standard",
    medicalNecessityElements: [
      "Qualifying clinical criteria (e.g. sleep study, oxygen saturation, mobility limitation)",
      "Face-to-face encounter documentation where required",
      "Expected duration of need",
      "Why the specific equipment level is required",
    ],
    commonDenialReasons: ["Missing face-to-face documentation", "Qualifying test results absent", "Equipment level exceeds documented need"],
    documentation: ["Qualifying diagnostic results", "Face-to-face encounter note", "Written order with all required elements"],
    goldCardingNote: "Highly rules-driven and repetitive — the strongest candidate for straight-through automation once the checklist is codified.",
  },
  {
    id: "behavioral",
    name: "Behavioral health / substance use",
    examples: "Residential treatment, intensive outpatient, TMS",
    scrutiny: "elevated",
    medicalNecessityElements: [
      "Current symptoms, severity and functional impact",
      "Level-of-care criteria addressed explicitly",
      "Prior treatment history and response",
      "Safety and risk assessment",
    ],
    commonDenialReasons: ["Level of care deemed higher than necessary", "Criteria not addressed explicitly", "Continued-stay review not submitted timely"],
    documentation: ["Clinical assessment", "Level-of-care criteria mapping", "Treatment history", "Risk assessment"],
    goldCardingNote: "Parity rules apply — document level-of-care criteria as rigorously as a medical/surgical request, and diarise continued-stay reviews.",
  },
  {
    id: "home-health",
    name: "Home health / post-acute",
    examples: "Skilled nursing, home PT, home infusion",
    scrutiny: "standard",
    medicalNecessityElements: [
      "Homebound status where required",
      "Skilled need requiring a licensed professional",
      "Plan of care with frequency and duration",
      "Expected goals and discharge criteria",
    ],
    commonDenialReasons: ["Skilled need not established", "Homebound status not documented", "Plan of care lacks measurable goals"],
    documentation: ["Face-to-face encounter", "Plan of care", "Skilled-need justification"],
    goldCardingNote: "Discharge-driven and time-critical — the win here is turnaround speed, not approval rate.",
  },
];

export const paReadinessGates: PaReadinessGate[] = [
  { id: "r1", area: "Intake", question: "Do you know, at scheduling, whether a service requires prior authorization?", gap: "PA requirement discovered late is the single largest driver of avoidable delay and day-of-service cancellation." },
  { id: "r2", area: "Intake", question: "Is the PA requirement check automated against payer rules rather than looked up manually?", gap: "Manual lookup does not scale and drifts as payer policies change monthly." },
  { id: "r3", area: "Determination", question: "Do you maintain payer-specific medical-necessity criteria in a usable, current form?", gap: "Without codified criteria, each request is assembled from scratch and approval depends on who prepared it." },
  { id: "r4", area: "Determination", question: "Do you assemble the clinical packet from the record automatically, rather than by hand?", gap: "Packet assembly is the most labour-intensive step and the most common source of avoidable rework." },
  { id: "r5", area: "Submission", question: "Do you submit electronically for the majority of your PA volume?", mapsTo: "CMS-0057-F Prior Auth API (1 Jan 2027)", gap: "Portal-and-fax submission is the workflow the 2027 API date is designed to replace." },
  { id: "r6", area: "Submission", question: "Do you generate the PA request letter from a template rather than writing each one?", gap: "Hand-written requests vary in quality and are the easiest thing to standardise for immediate gain." },
  { id: "r7", area: "Tracking", question: "Do you track every PA to determination with an owner and an SLA?", gap: "Untracked requests age silently and surface as denials or cancellations." },
  { id: "r8", area: "Tracking", question: "Do you measure PA turnaround time and approval rate by payer?", mapsTo: "CMS-0057-F PA metrics reporting (31 Mar 2026)", gap: "Payers must now publish their PA metrics — if you do not measure yours, you cannot use theirs in negotiation." },
  { id: "r9", area: "Tracking", question: "Do you analyse PA denials for root cause and feed that upstream?", gap: "Without root-cause feedback, the same avoidable denial recurs indefinitely." },
  { id: "r10", area: "Interoperability", question: "Have you assessed which of your payers will expose PA APIs, and when?", mapsTo: "CMS-0057-F APIs (1 Jan 2027)", gap: "The 2027 date is fixed. Organisations that plan for it convert headcount into analytics; those that wait automate under margin pressure." },
  { id: "r11", area: "Interoperability", question: "Is your EHR or clearinghouse able to consume a FHIR PA API?", mapsTo: "CMS-0057-F Prior Auth API (1 Jan 2027)", gap: "Payer-side APIs deliver nothing if the provider side cannot consume them." },
  { id: "r12", area: "Interoperability", question: "Do you have gold-carding arrangements, or a data-backed case to negotiate them?", gap: "Gold carding removes PA entirely for high-approval services — the highest-leverage negotiation available, and it needs your own approval-rate data." },
];

export const paBenchmarks = [
  { label: "PA turnaround", bestInClass: "< 24h for 90%+", typical: "3–5 days" },
  { label: "Touchless determination", bestInClass: "60–75%", typical: "< 20%" },
  { label: "PA approval rate", bestInClass: "> 78%", typical: "60–70%" },
  { label: "Day-of-service cancellations from PA", bestInClass: "< 1%", typical: "3–5%" },
];
