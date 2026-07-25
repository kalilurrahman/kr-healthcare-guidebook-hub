// Ambient Note QA Scorecard — rubric + deterministic detectors.
// Grades an ambient-scribe / clinical note against a defensible completeness
// and CDI/coding rubric (reader Ch7 coding & CDI specificity; ACUITAS-style
// quality checks). 100% client-side text analysis — no PHI is transmitted.
// The production tier swaps the keyword detectors for an LLM grader (behind a
// BAA) for semantic scoring; v1 proves the rubric with transparent heuristics.

export interface RubricCheck {
  id: string;
  label: string;
  weight: number; // sums to 100 across checks
  description: string;
  reference: string;
  recommendation: string;
  mode: "any" | "count";
  keywords: string[]; // matched against lowercased note text
  goodThreshold?: number; // count mode: >= this = good, >=1 = partial
}

export interface SafetyFlag {
  id: string;
  label: string;
  patterns: string[];
  note: string;
}

// Weighted completeness + specificity rubric (weights sum to 100).
export const rubric: RubricCheck[] = [
  {
    id: "structure", label: "Note structure (SOAP)", weight: 14,
    description: "Recognized clinical sections are present and labeled.",
    reference: "HIM · documentation standards",
    recommendation: "Use clearly labeled Subjective / Objective / Assessment / Plan (or HPI / Exam / Assessment / Plan) sections so the note is auditable and codeable.",
    mode: "count", goodThreshold: 4,
    keywords: ["subjective", "objective", "assessment", "plan", "chief complaint", "history of present illness", "physical exam", "review of systems", "impression"],
  },
  {
    id: "chief-complaint", label: "Chief complaint", weight: 8,
    description: "A clear reason for the visit is documented.",
    reference: "E/M documentation",
    recommendation: "State an explicit chief complaint / reason for visit — it anchors medical necessity for the encounter.",
    mode: "any",
    keywords: ["chief complaint", "cc:", "presents with", "presenting complaint", "reason for visit", "here for"],
  },
  {
    id: "hpi", label: "HPI richness", weight: 12,
    description: "History of present illness carries enough descriptive elements (OLDCARTS).",
    reference: "E/M · HPI elements",
    recommendation: "Add HPI elements — onset, location, duration, severity, quality, timing, context, and modifying/associated factors — to support the E/M level.",
    mode: "count", goodThreshold: 4,
    keywords: ["onset", "duration", "location", "radiat", "severity", "quality", "timing", "aggravat", "allevi", "context", "associated", "denies", "reports", "started", "worse", "improv", "since"],
  },
  {
    id: "ros", label: "Review of systems", weight: 10,
    description: "A review of systems (or pertinent negatives) is documented.",
    reference: "E/M · ROS",
    recommendation: "Document a review of systems with pertinent positives and negatives; a missing ROS caps the achievable E/M level.",
    mode: "any",
    keywords: ["review of systems", "ros:", "ros ", "constitutional:", "pertinent negative", "denies fever", "no chest pain", "negative for"],
  },
  {
    id: "allergies", label: "Allergies", weight: 8,
    description: "Allergy status is recorded (or explicitly none).",
    reference: "Patient safety",
    recommendation: "Record allergy status explicitly (or NKDA). Missing allergy documentation is a safety and compliance gap.",
    mode: "any",
    keywords: ["allerg", "nkda", "no known drug"],
  },
  {
    id: "medications", label: "Medications", weight: 8,
    description: "Current medications are captured.",
    reference: "Med reconciliation",
    recommendation: "Include a current medication list; medication reconciliation is a required safety element and supports the plan.",
    mode: "any",
    keywords: ["medication", "current meds", "home meds", "rx:", "prescrib", " mg", "daily", "tablet"],
  },
  {
    id: "assessment-specificity", label: "Assessment specificity (CDI)", weight: 16,
    description: "Diagnoses carry the specificity coders need — laterality, acuity, stage, control.",
    reference: "Reader Ch7 · Coding & CDI",
    recommendation: "Specify each diagnosis to the highest fidelity — acute vs chronic, laterality, stage, controlled/uncontrolled, exacerbation, type — so the acuity is captured for coding and risk adjustment.",
    mode: "count", goodThreshold: 3,
    keywords: ["acute", "chronic", "left", "right", "bilateral", "stage", "severe", "moderate", "mild", "exacerbation", "uncontrolled", "controlled", "type 2", "type 1", "status post", "with complication", "without complication"],
  },
  {
    id: "plan-followup", label: "Plan & follow-up", weight: 14,
    description: "A clear plan and a concrete follow-up / disposition are documented.",
    reference: "Care continuity",
    recommendation: "Give each problem an actionable plan and a concrete follow-up (interval, referral, or return precautions) so the disposition is unambiguous.",
    mode: "count", goodThreshold: 3,
    keywords: ["follow up", "follow-up", "f/u", "return in", "rtc", "recheck", "referral", "refer to", "order", "start", "continue", "discontinue", "labs", "imaging", "return precautions"],
  },
  {
    id: "attribution", label: "Attribution / signature", weight: 10,
    description: "The note is attributed to an author / signed.",
    reference: "Compliance · authentication",
    recommendation: "Ensure the note is authenticated — an author attestation and signature are required for a legal, billable record.",
    mode: "any",
    keywords: ["electronically signed", "signed by", "attest", "md,", "md ", "d.o.", " do ", "np,", "np ", "pa-c", "provider:", "dictated by"],
  },
];

// Ambient-AI failure modes — surfaced as red warnings regardless of score.
export const safetyFlags: SafetyFlag[] = [
  {
    id: "unresolved-transcription", label: "Unresolved transcription",
    patterns: ["[inaudible]", "[unintelligible]", "[crosstalk]", "inaudible", "unintelligible"],
    note: "Ambient capture left audio unresolved — a factual gap. Resolve before signing.",
  },
  {
    id: "placeholder", label: "Placeholder / unfilled text",
    patterns: ["placeholder", "lorem", "tbd", "xxxx", "[insert", "todo", "to be completed"],
    note: "Template placeholder text remains in the note. Replace with the real finding.",
  },
  {
    id: "contradiction", label: "Possible contradiction / hallucination cue",
    patterns: ["patient denies and reports", "both present and absent", "not applicable n/a applicable"],
    note: "Language suggests a possible internal contradiction — a known ambient-AI hallucination pattern. Verify against the encounter.",
  },
];

// A demo note (de-identified, generic) — solid but missing ROS + allergies,
// so the scorecard shows a realistic ~B with actionable recommendations.
export const sampleNote = `CHIEF COMPLAINT: Follow-up of chronic low back pain, here for medication review.

HISTORY OF PRESENT ILLNESS: 54-year-old presents with chronic low back pain, present for 8 months, located in the lumbar region, moderate severity, worse with prolonged sitting and improved with movement. Reports the pain radiates to the left buttock. Denies bowel or bladder changes. Onset was gradual; no acute injury.

PHYSICAL EXAM: Alert, in no acute distress. Lumbar paraspinal tenderness on the left. Straight-leg raise negative bilaterally. Strength 5/5 in bilateral lower extremities.

ASSESSMENT: Chronic left-sided lumbar radiculopathy, moderate, without acute exacerbation. Type 2 diabetes mellitus, controlled.

PLAN: Continue home exercise program. Start physical therapy, refer to PT. Continue metformin 1000 mg twice daily. Order lumbar MRI if no improvement in 6 weeks. Follow up in 6 weeks; return precautions given for any new weakness or bowel/bladder changes.

Electronically signed by Provider, MD.`;
