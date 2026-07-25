// AppealForge — codified denial-appeal strategy library.
// The moat is the per-denial-type appeal strategy, argument scaffold, and
// evidence checklist (from reader Ch5 payer intelligence + denial taxonomy and
// Ch11 appeal-letter generation) — NOT the generator. v1 assembles letters
// deterministically, fully client-side, no PHI leaves the browser. The
// production tier swaps the template engine for an LLM (behind a BAA) for
// richer clinical argumentation.

export interface DenialType {
  id: string;
  label: string;
  carc: string; // representative CARC code(s)
  category: "Clinical" | "Administrative" | "Coding" | "Coverage";
  rootCause: string;
  strategy: string;
  argument: string[]; // woven into the letter body
  attachments: string[];
  prevention: string;
  overturnNote: string;
}

export interface Payer {
  id: string;
  name: string;
  note: string;
}

export interface AppealLevel {
  id: string;
  label: string;
  desc: string;
  closer: string; // level-specific request line
}

export const payers: Payer[] = [
  { id: "uhc", name: "UnitedHealthcare (Optum)", note: "Commercial appeals typically due within 180 days of the remittance." },
  { id: "aetna", name: "Aetna (CVS Health)", note: "Reference the specific clinical policy bulletin (CPB) number in the appeal." },
  { id: "cigna", name: "Cigna", note: "Peer-to-peer review is often available before a formal second-level appeal." },
  { id: "humana", name: "Humana", note: "For Medicare Advantage, follow the CMS-defined reconsideration timeline." },
  { id: "elevance", name: "Elevance / Anthem BCBS", note: "Cite the member's specific benefit plan language where coverage is disputed." },
  { id: "bcbs", name: "Blue Cross Blue Shield (other)", note: "Plan rules vary by state licensee; confirm the local filing window." },
  { id: "medicare", name: "Medicare (CMS / MAC)", note: "First level is Redetermination (120 days); escalate to Reconsideration (QIC) if upheld." },
  { id: "medicaid", name: "Medicaid (state)", note: "Appeal windows and fair-hearing rights are state-specific." },
  { id: "commercial", name: "Other commercial payer", note: "Confirm the payer's appeal address and filing window on the remittance." },
];

export const appealLevels: AppealLevel[] = [
  {
    id: "first",
    label: "First-Level Appeal (Reconsideration)",
    desc: "Standard written reconsideration of the initial denial.",
    closer: "We respectfully request that this determination be overturned and the claim processed for payment.",
  },
  {
    id: "peer",
    label: "Second-Level / Peer-to-Peer",
    desc: "Escalated review, often with a physician peer-to-peer discussion.",
    closer: "We request a peer-to-peer review with the treating physician and that the denial be overturned upon reconsideration.",
  },
  {
    id: "external",
    label: "External / Independent Review (IRO)",
    desc: "Independent external review after internal appeals are exhausted.",
    closer: "Having exhausted internal appeals, we request an independent external review of this adverse determination.",
  },
];

export const denialTypes: DenialType[] = [
  {
    id: "medical-necessity",
    label: "Medical necessity",
    carc: "CARC 50",
    category: "Clinical",
    rootCause: "The payer determined the service was not medically necessary under its clinical policy.",
    strategy: "Rebut point-by-point against the payer's OWN published medical policy criteria, reinforced by the treating physician's rationale and evidence-based guidelines.",
    argument: [
      "The service met the payer's published medical-necessity criteria, as documented in the enclosed medical record.",
      "The ordering physician's clinical judgment is supported by current specialty-society guidelines for this condition.",
      "Conservative or lower-cost alternatives were previously attempted and failed, or were clinically contraindicated.",
    ],
    attachments: [
      "Complete medical records for the date(s) of service",
      "Physician letter of medical necessity",
      "Relevant clinical guideline excerpts (with the payer's own policy number)",
      "History of prior conservative treatment",
    ],
    prevention: "Capture medical-necessity documentation and the payer's policy criteria at the point of order; use CDI to ensure clinical specificity.",
    overturnNote: "Overturn rates are highest when the appeal cites the payer's own policy number and attaches the complete record.",
  },
  {
    id: "prior-auth",
    label: "No / invalid prior authorization",
    carc: "CARC 197",
    category: "Administrative",
    rootCause: "A service requiring prior authorization had no auth on file, or the auth did not match the billed claim.",
    strategy: "Show a valid authorization existed, that the service was emergent (and therefore exempt), or that any code mismatch is clerical with unchanged clinical intent.",
    argument: [
      "A valid authorization was in place for this service at the time of care.",
      "The service was rendered emergently, which exempts it from prior-authorization requirements.",
      "Any discrepancy between the authorized and billed codes is clerical; the clinical service and intent are unchanged.",
    ],
    attachments: [
      "Authorization confirmation / reference number",
      "Documentation of emergent presentation (if applicable)",
      "Timestamp of the original authorization request",
    ],
    prevention: "Automate eligibility and prior-auth at scheduling and reconcile authorized vs. billed codes before submission.",
    overturnNote: "Retro-authorizations are frequently granted when emergent circumstances are clearly documented.",
  },
  {
    id: "timely-filing",
    label: "Timely filing",
    carc: "CARC 29",
    category: "Administrative",
    rootCause: "The claim was received after the payer's filing deadline.",
    strategy: "Prove timely original submission with the clearinghouse acknowledgment, or establish good cause for any delay.",
    argument: [
      "The original claim was submitted within the filing limit, evidenced by the enclosed clearinghouse acknowledgment.",
      "Any delay resulted from circumstances outside the provider's control (payer/system error, incorrect payer on file, or pending COB), constituting good cause.",
      "Under the payer's good-cause provisions, the claim should be treated as timely.",
    ],
    attachments: [
      "Clearinghouse / EDI 277CA acknowledgment report",
      "Proof of the original submission date",
      "Documentation supporting good cause (if applicable)",
    ],
    prevention: "Monitor unbilled and held claims daily and set filing-deadline alerts by payer.",
    overturnNote: "The clearinghouse acknowledgment report is the single strongest piece of evidence for timely-filing appeals.",
  },
  {
    id: "non-covered",
    label: "Non-covered service",
    carc: "CARC 96",
    category: "Coverage",
    rootCause: "The payer classifies the service as not covered under the member's benefit plan.",
    strategy: "Challenge the benefit interpretation using the plan's own language and, where relevant, establish medical necessity and construe ambiguity in favor of coverage.",
    argument: [
      "The service is a covered benefit under the member's plan as written.",
      "The exclusion cited does not apply to the clinical circumstances of this case.",
      "Where the plan language is ambiguous, it should be construed in favor of coverage.",
    ],
    attachments: [
      "Member benefit summary / SPD excerpt",
      "Medical records for the date(s) of service",
      "Physician letter of medical necessity",
    ],
    prevention: "Verify covered benefits and exclusions at eligibility; counsel patients on non-covered services with an ABN where applicable.",
    overturnNote: "Quoting the exact benefit-plan language back to the payer materially improves overturn odds.",
  },
  {
    id: "coding-bundling",
    label: "Bundling / NCCI edit",
    carc: "CARC 97 / 234 / B15",
    category: "Coding",
    rootCause: "The service was denied as bundled or inclusive of another service (an NCCI edit), or as requiring a prerequisite service.",
    strategy: "Justify separate reporting with the correct modifier and documentation of a distinct, independently necessary service.",
    argument: [
      "The procedures were distinct and independently necessary, supporting separate reporting with the appropriate modifier (e.g., 59 / XU).",
      "The NCCI edit permits an override given the documented separate anatomic site or session.",
      "The operative and procedure documentation supports the separate, identifiable service.",
    ],
    attachments: [
      "Operative / procedure notes showing the distinct services",
      "Modifier rationale",
      "Relevant NCCI policy reference",
    ],
    prevention: "Apply NCCI-aware charge capture and modifier logic before the claim is dropped.",
    overturnNote: "Appeals that attach the operative note and name the specific modifier override are overturned far more often.",
  },
  {
    id: "eligibility",
    label: "Coverage terminated / not in effect",
    carc: "CARC 27",
    category: "Coverage",
    rootCause: "Coverage was reported as terminated or not in effect on the date of service.",
    strategy: "Prove active coverage on the date of service, or identify the correct primary payer via coordination of benefits.",
    argument: [
      "The member had active coverage on the date of service, per the enclosed eligibility response.",
      "Any termination was retroactive and the service preceded the effective termination date.",
      "If applicable, the correct primary payer is identified in the enclosed COB information.",
    ],
    attachments: [
      "Eligibility verification for the date of service",
      "Coordination-of-benefits information",
    ],
    prevention: "Run real-time eligibility at every encounter and scrub coordination of benefits at registration.",
    overturnNote: "A dated eligibility response captured at the point of service resolves most termination denials.",
  },
  {
    id: "duplicate",
    label: "Duplicate claim",
    carc: "CARC 18",
    category: "Administrative",
    rootCause: "The claim was flagged as a duplicate of a previously processed claim.",
    strategy: "Demonstrate the services are distinct (different date, site, or provider) or that the referenced prior claim was never actually paid.",
    argument: [
      "This is not a duplicate; the service differs by date of service, anatomic site, or rendering provider.",
      "The referenced prior claim was denied or not paid, so this claim remains open and payable.",
      "Appropriate modifiers distinguish the separate encounters.",
    ],
    attachments: [
      "Records for each distinct encounter",
      "Remittance advice showing the prior claim's status",
    ],
    prevention: "Add duplicate-logic checks and correct modifier usage before submission.",
    overturnNote: "Attaching the prior remittance showing non-payment quickly resolves false-duplicate denials.",
  },
  {
    id: "experimental",
    label: "Experimental / investigational",
    carc: "CARC 55",
    category: "Clinical",
    rootCause: "The service was deemed experimental or investigational for the indication.",
    strategy: "Establish standard-of-care status via FDA approval, specialty-society guideline adoption, and peer-reviewed evidence for the patient's condition.",
    argument: [
      "The service is FDA-approved or cleared for this indication.",
      "Major specialty-society guidelines endorse the service as standard of care for this condition.",
      "Peer-reviewed evidence demonstrates efficacy for the patient's clinical situation.",
    ],
    attachments: [
      "FDA approval / clearance documentation",
      "Specialty-society guideline citations",
      "Peer-reviewed literature",
      "Physician letter of medical necessity",
    ],
    prevention: "Screen for experimental-designation risk at the point of order and pursue pre-service coverage determinations.",
    overturnNote: "A guideline-plus-FDA package reframes the service as standard of care and is the strongest counter.",
  },
  {
    id: "insufficient-doc",
    label: "Insufficient documentation",
    carc: "CARC 16 / 252",
    category: "Administrative",
    rootCause: "The claim lacked information or documentation the payer required to adjudicate.",
    strategy: "Supply the missing documentation and explicitly map each element to the payer's stated requirement.",
    argument: [
      "The requested documentation is enclosed and fully supports the billed service.",
      "Each required element is addressed in the attached record.",
      "The claim now contains complete information for adjudication.",
    ],
    attachments: [
      "Complete medical records",
      "Itemized statement",
      "Any payer-specific forms requested",
    ],
    prevention: "Run pre-bill documentation-completeness checks so required elements are present before submission.",
    overturnNote: "Explicitly labeling which attachment satisfies which requirement speeds the reversal.",
  },
  {
    id: "cob",
    label: "Coordination of benefits",
    carc: "CARC 22 / 23",
    category: "Coverage",
    rootCause: "The claim was denied pending coordination of benefits or other-payer responsibility.",
    strategy: "Provide the primary payer's remittance and establish this payer's secondary responsibility for the balance.",
    argument: [
      "The primary payer has adjudicated the claim; its remittance is enclosed.",
      "This payer is secondary and responsible for the remaining balance under coordination-of-benefits rules.",
      "The member's COB information has been confirmed and updated.",
    ],
    attachments: [
      "Primary payer EOB / remittance advice",
      "Updated coordination-of-benefits information",
    ],
    prevention: "Capture and verify coordination of benefits at registration to prevent COB denials.",
    overturnNote: "Enclosing the primary EOB converts a COB denial into a routine secondary payment.",
  },
];
