// Ambient Note QA Scorecard — rubric + deterministic detectors.
// Grades an ambient-scribe / clinical note against a defensible completeness
// and CDI/coding rubric (reader Ch7 coding & CDI specificity; ACUITAS-style
// quality checks). 100% client-side text analysis — no PHI is transmitted.
// The production tier swaps these detectors for an LLM grader (behind a BAA)
// for semantic scoring; v1 proves the rubric with transparent heuristics.
//
// Matching rules (deliberate, to avoid false "Complete" verdicts):
//  - Patterns are WORD-BOUNDARY regexes, never bare substrings, so "controlled"
//    does not fire inside "uncontrolled" and " do " does not fire inside "we do not".
//  - Checks can be SECTION-SCOPED, so assessment specificity is judged on the
//    assessment/impression text only — a richly worded HPI must not earn CDI
//    credit for a one-word assessment.

export type NoteSection = "assessment" | "plan" | "medications" | "allergies" | "ros" | "hpi" | "exam" | "signature";

export interface RubricCheck {
  id: string;
  label: string;
  weight: number; // sums to 100 across checks
  description: string;
  reference: string;
  recommendation: string;
  mode: "any" | "count";
  /** Which part of the note to search. Omit to search the whole note. */
  scope?: NoteSection;
  /** Word-boundary-anchored patterns (source strings, compiled at match time). */
  patterns: string[];
  goodThreshold?: number; // count mode: >= this = good, >=1 = partial
}

export interface SafetyFlag {
  id: string;
  label: string;
  patterns: string[];
  note: string;
}

/** Headings that begin each logical section, used to slice the note. */
export const sectionHeadings: Record<NoteSection, string[]> = {
  hpi: ["history of present illness", "hpi", "subjective", "chief complaint", "cc"],
  exam: ["physical exam", "examination", "objective", "exam"],
  ros: ["review of systems", "ros"],
  allergies: ["allergies", "allergy"],
  medications: ["medications", "medication", "current meds", "home meds", "meds"],
  assessment: ["assessment", "impression", "diagnosis", "diagnoses", "a/p", "assessment and plan"],
  plan: ["plan", "disposition", "recommendations", "a/p", "assessment and plan"],
  signature: ["electronically signed", "signed by", "attestation", "dictated by"],
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Heading matchers, compiled ONCE at module load. Building these inside the
 * per-line loop cost ~33 RegExp constructions per line, which made scoring a
 * large pasted note block the main thread for hundreds of milliseconds.
 */
const HEADING_RE: [NoteSection, RegExp][] =
  (Object.entries(sectionHeadings) as [NoteSection, string[]][])
    .map(([section, heads]) => [
      section,
      new RegExp(`^(?:${heads.map(escapeRe).join("|")})\\s*[:\\-–—]`, "i"),
    ]);

/**
 * Split a note into sections by recognized headings. Returns the text that
 * follows each heading, up to the next heading. Falls back to empty string
 * when a section is absent — which is exactly what should score as "Missing".
 */
export function sliceSections(note: string): Record<NoteSection, string> {
  const lines = note.split(/\r?\n/);
  const result = {
    hpi: "", exam: "", ros: "", allergies: "",
    medications: "", assessment: "", plan: "", signature: "",
  } as Record<NoteSection, string>;

  let current: NoteSection | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const lower = line.toLowerCase();
    let matched: NoteSection | null = null;

    // "ASSESSMENT:", "Assessment -", "assessment and plan:" at line start
    for (const [section, re] of HEADING_RE) {
      if (re.test(lower)) { matched = section; break; }
    }

    if (matched) {
      current = matched;
      // Keep any inline content that follows the heading on the same line.
      const after = line.replace(/^[^:\-–—]*[:\-–—]\s*/, "");
      if (after) result[current] += after.toLowerCase() + "\n";
      continue;
    }
    if (current) result[current] += lower + "\n";
  }

  // Signature commonly appears as a trailing line with no heading colon.
  if (!result.signature) {
    const tail = lines.slice(-3).join("\n").toLowerCase();
    if (/electronically signed|signed by|dictated by|attest/i.test(tail)) result.signature = tail;
  }
  return result;
}

/** Word-boundary match: avoids "controlled" inside "uncontrolled". */
export function matchesPattern(text: string, pattern: string): boolean {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // \b works for alphanumeric edges; patterns ending in ':' or containing spaces still behave.
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(text);
}

export function countPatterns(text: string, patterns: string[]): number {
  return patterns.reduce((n, p) => (matchesPattern(text, p) ? n + 1 : n), 0);
}

// Weighted completeness + specificity rubric (weights sum to 100).
export const rubric: RubricCheck[] = [
  {
    id: "structure", label: "Note structure (SOAP)", weight: 14,
    description: "Recognized clinical sections are present and labeled.",
    reference: "HIM · documentation standards",
    recommendation: "Use clearly labeled Subjective / Objective / Assessment / Plan (or HPI / Exam / Assessment / Plan) sections so the note is auditable and codeable.",
    mode: "count", goodThreshold: 4,
    patterns: ["subjective", "objective", "assessment", "plan", "chief complaint", "history of present illness", "physical exam", "review of systems", "impression"],
  },
  {
    id: "chief-complaint", label: "Chief complaint", weight: 8,
    description: "A clear reason for the visit is documented.",
    reference: "E/M documentation",
    recommendation: "State an explicit chief complaint / reason for visit — it anchors medical necessity for the encounter.",
    mode: "any",
    patterns: ["chief complaint", "cc", "presents with", "presenting complaint", "reason for visit", "here for"],
  },
  {
    id: "hpi", label: "HPI richness", weight: 12,
    description: "History of present illness carries enough descriptive elements (OLDCARTS).",
    reference: "E/M · HPI elements",
    recommendation: "Add HPI elements — onset, location, duration, severity, quality, timing, context, and modifying/associated factors — to support the E/M level.",
    mode: "count", goodThreshold: 4, scope: "hpi",
    patterns: ["onset", "duration", "located", "location", "radiates", "radiating", "severity", "quality", "timing", "aggravated", "aggravating", "alleviated", "relieved", "context", "associated", "denies", "reports", "started", "worse", "improved", "since"],
  },
  {
    id: "ros", label: "Review of systems", weight: 10,
    description: "A labeled review of systems (or pertinent negatives within it) is documented.",
    reference: "E/M · ROS",
    recommendation: "Document a labeled review of systems with pertinent positives and negatives; a missing ROS caps the achievable E/M level.",
    // Scoped to the ROS section: a lab line reading "negative for growth" must not count.
    mode: "any", scope: "ros",
    patterns: ["constitutional", "heent", "cardiovascular", "respiratory", "gi", "gu", "neuro", "psych", "musculoskeletal", "skin", "denies", "negative", "no fever", "no chest pain", "pertinent negative", "all other systems"],
  },
  {
    id: "allergies", label: "Allergies", weight: 8,
    description: "Allergy status is recorded (or explicitly none).",
    reference: "Patient safety",
    recommendation: "Record allergy status explicitly (or NKDA). Missing allergy documentation is a safety and compliance gap.",
    mode: "any",
    patterns: ["allergies", "allergy", "allergic", "nkda", "no known drug allergies", "no known allergies"],
  },
  {
    id: "medications", label: "Medications", weight: 8,
    description: "Current medications are captured.",
    reference: "Med reconciliation",
    recommendation: "Include a current medication list; medication reconciliation is a required safety element and supports the plan.",
    // "daily" alone is removed — it matched "activities of daily living".
    mode: "any",
    patterns: ["medications", "medication", "current meds", "home meds", "rx", "prescribed", "prescription", "mg", "mcg", "tablet", "capsule", "twice daily", "once daily", "bid", "tid", "qhs", "po"],
  },
  {
    id: "assessment-specificity", label: "Assessment specificity (CDI)", weight: 16,
    description: "Diagnoses in the ASSESSMENT carry the specificity coders need — laterality, acuity, stage, control.",
    reference: "Reader Ch7 · Coding & CDI",
    recommendation: "Specify each diagnosis to the highest fidelity — acute vs chronic, laterality, stage, controlled/uncontrolled, exacerbation, type — so the acuity is captured for coding and risk adjustment.",
    // Scoped to the assessment: a vivid HPI must not earn CDI credit for "Assessment: pain."
    // "controlled" removed as a separate token — it double-counted inside "uncontrolled".
    mode: "count", goodThreshold: 3, scope: "assessment",
    patterns: ["acute", "chronic", "left", "right", "bilateral", "stage", "severe", "moderate", "mild", "exacerbation", "uncontrolled", "well-controlled", "poorly controlled", "type 2", "type 1", "status post", "with complication", "without complication", "secondary to", "due to"],
  },
  {
    id: "plan-followup", label: "Plan & follow-up", weight: 14,
    description: "A clear plan and a concrete follow-up / disposition are documented.",
    reference: "Care continuity",
    recommendation: "Give each problem an actionable plan and a concrete follow-up (interval, referral, or return precautions) so the disposition is unambiguous.",
    mode: "count", goodThreshold: 3, scope: "plan",
    patterns: ["follow up", "follow-up", "f/u", "return in", "rtc", "recheck", "referral", "refer", "order", "start", "continue", "discontinue", "labs", "imaging", "return precautions"],
  },
  {
    id: "attribution", label: "Attribution / signature", weight: 10,
    description: "The note is authenticated — attributed to an author / signed.",
    reference: "Compliance · authentication",
    recommendation: "Ensure the note is authenticated — an author attestation and signature are required for a legal, billable record.",
    // Bare " do " / "md " removed: they matched ordinary prose ("we do not…").
    mode: "any",
    patterns: ["electronically signed", "signed by", "attestation", "attested", "dictated by", "pa-c", "m.d.", "d.o.", "signature"],
  },
];

// Ambient-AI failure modes — surfaced as red warnings regardless of score.
// Patterns are matched as plain substrings (they are literal artifacts).
export const safetyFlags: SafetyFlag[] = [
  {
    id: "unresolved-transcription", label: "Unresolved transcription",
    patterns: ["[inaudible]", "[unintelligible]", "[crosstalk]", "inaudible", "unintelligible", "(?)", "[?]"],
    note: "Ambient capture left audio unresolved — a factual gap. Resolve before signing.",
  },
  {
    id: "placeholder", label: "Placeholder / unfilled text",
    patterns: ["placeholder", "lorem", "tbd", "xxxx", "[insert", "todo", "to be completed", "___"],
    note: "Template placeholder text remains in the note. Replace with the real finding.",
  },
  {
    id: "contradiction", label: "Possible contradiction",
    // Realistic ambient-AI contradictions: the same finding asserted and denied.
    patterns: [
      "denies chest pain", // paired below in the detector with a positive assertion
      "no acute distress",
    ],
    note: "Check for an internal contradiction — the note may both assert and deny the same finding, a known ambient-AI failure mode.",
  },
];

/**
 * Contradiction pairs: if BOTH sides appear, the note likely contradicts itself.
 * Replaces the earlier patterns that could never match in practice.
 */
export const contradictionPairs: [string, string][] = [
  ["denies chest pain", "reports chest pain"],
  ["denies chest pain", "complains of chest pain"],
  ["no acute distress", "in acute distress"],
  ["afebrile", "febrile"],
  ["denies shortness of breath", "shortness of breath present"],
  ["no known drug allergies", "allergic to"],
  ["denies fever", "fever noted"],
  ["nonsmoker", "current smoker"],
];

// A demo note (de-identified, generic) — solid but missing ROS + allergies,
// so the scorecard shows a realistic ~B with actionable recommendations.
export const sampleNote = `CHIEF COMPLAINT: Follow-up of chronic low back pain, here for medication review.

HISTORY OF PRESENT ILLNESS: 54-year-old presents with chronic low back pain, present for 8 months, located in the lumbar region, moderate severity, worse with prolonged sitting and improved with movement. Reports the pain radiates to the left buttock. Denies bowel or bladder changes. Onset was gradual; no acute injury.

MEDICATIONS: Metformin 1000 mg twice daily. Ibuprofen 400 mg as needed.

PHYSICAL EXAM: Alert, in no acute distress. Lumbar paraspinal tenderness on the left. Straight-leg raise negative bilaterally. Strength 5/5 in bilateral lower extremities.

ASSESSMENT: Chronic left-sided lumbar radiculopathy, moderate, without acute exacerbation. Type 2 diabetes mellitus, well-controlled.

PLAN: Continue home exercise program. Start physical therapy, refer to PT. Continue metformin 1000 mg twice daily. Order lumbar MRI if no improvement in 6 weeks. Follow up in 6 weeks; return precautions given for any new weakness or bowel/bladder changes.

Electronically signed by Provider, M.D.`;
