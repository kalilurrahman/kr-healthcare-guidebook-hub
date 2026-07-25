// Regulatory Calendar 2026–2027.
// Every date and obligation below was verified against primary/authoritative
// sources in July 2026 (see `sources` on each entry). Status reflects that
// verification date — re-check before relying on it operationally.

export type RegStatus = "in-effect" | "phasing" | "upcoming" | "proposed-delayed";

export interface RegKeyDate {
  date: string;
  iso: string; // sortable
  what: string;
}

export interface Regulation {
  id: string;
  short: string;
  name: string;
  citation: string;
  status: RegStatus;
  domain: "Payer" | "Provider" | "Both";
  headline: string;
  keyDates: RegKeyDate[];
  requires: string[];
  rcmImpact: string;
  gccImplication: string;
  boardQuestions: string[];
  sources: { label: string; url: string }[];
}

export const regStatusMeta: Record<RegStatus, { label: string; tone: string }> = {
  "in-effect": { label: "In effect", tone: "teal" },
  "phasing": { label: "Phasing in", tone: "gold" },
  "upcoming": { label: "Upcoming", tone: "indigo" },
  "proposed-delayed": { label: "Proposed · delayed", tone: "coral" },
};

export const verifiedAsOf = "July 2026";

export const regulations: Regulation[] = [
  {
    id: "team",
    short: "TEAM",
    name: "Transforming Episode Accountability Model",
    citation: "CMS Innovation Center · mandatory model",
    status: "in-effect",
    domain: "Provider",
    headline: "Mandatory 5-year bundled-payment model for five surgical episodes — live since 1 January 2026.",
    keyDates: [
      { date: "1 Jan 2026", iso: "2026-01-01", what: "Performance Year 1 begins — participation is mandatory for selected hospitals" },
      { date: "31 Dec 2030", iso: "2030-12-31", what: "Model ends after five performance years" },
    ],
    requires: [
      "Selected acute-care hospitals bear financial risk for the episode from admission through 30 days post-discharge",
      "Five surgical episodes: lower-extremity joint replacement, surgical hip/femur fracture treatment, spinal fusion, CABG, and major bowel procedures",
      "Applies to Original Medicare beneficiaries in selected Core-Based Statistical Areas",
    ],
    rcmImpact: "Episode economics replace fee-for-service margin logic for the covered procedures. Post-acute spend, readmissions and 30-day utilisation move directly onto the hospital's P&L, so cost capture and post-discharge coordination become revenue functions rather than quality functions.",
    gccImplication: "A natural GCC mandate: episode cost analytics, post-acute network performance tracking, readmission-risk stratification, and reconciliation against CMS target prices. This is analytical work at Wave 4 maturity, not transactional processing.",
    boardQuestions: [
      "Are we in a selected CBSA — and if so, have we modelled our episode margin against the CMS target price?",
      "Who owns the 30-day post-discharge cost we are now financially responsible for?",
      "Can we measure post-acute variation by facility today, or only after reconciliation?",
    ],
    sources: [
      { label: "CMS · TEAM Model", url: "https://www.cms.gov/priorities/innovation/innovation-models/team-model" },
      { label: "Premier · What providers need to know", url: "https://premierinc.com/newsroom/new-cms-transforming-episode-accountability-model-team-what-providers-need-to-know" },
    ],
  },
  {
    id: "cms0057",
    short: "CMS-0057-F",
    name: "Interoperability and Prior Authorization Final Rule",
    citation: "CMS-0057-F",
    status: "phasing",
    domain: "Both",
    headline: "Impacted payers must run FHIR prior-auth APIs and publish PA metrics — obligations land across 2026 and 2027.",
    keyDates: [
      { date: "1 Jan 2026", iso: "2026-01-01", what: "Core prior-authorization requirements apply to MA organizations, Medicaid & CHIP managed care, and QHP issuers on the FFEs" },
      { date: "31 Mar 2026", iso: "2026-03-31", what: "First public reporting of prior-authorization metrics, covering calendar year 2025" },
      { date: "1 Jan 2027", iso: "2027-01-01", what: "API requirements (Prior Auth, Patient Access, Provider Access, Payer-to-Payer); State Medicaid/CHIP fee-for-service compliance date" },
    ],
    requires: [
      "Prior Authorization API supporting electronic submission and status, plus Patient Access, Provider Access and Payer-to-Payer APIs",
      "Public reporting of prior-authorization metrics on an annual cadence",
      "Decision timeframes and specific denial reasons communicated to providers",
    ],
    rcmImpact: "The single biggest structural change to prior authorization in a decade. Manual portal-and-fax PA workflows become a competitive disadvantage as payers expose APIs; providers who cannot consume them keep paying the labour cost while competitors automate.",
    gccImplication: "India PA towers should be re-architected now — the work shifts from portal keying to exception handling and API integration monitoring. Centres that automate ahead of the 2027 API date convert a headcount line into an analytics function; those that wait will be automating under margin pressure.",
    boardQuestions: [
      "Are we positioned to consume payer PA APIs in 2027, or will we still be keying portals?",
      "What share of our PA volume could be touchless once the APIs exist?",
      "If our payers must publish PA metrics, are we using that data in contract negotiation?",
    ],
    sources: [
      { label: "CMS · CMS-0057-F final rule", url: "https://www.cms.gov/cms-interoperability-and-prior-authorization-final-rule-cms-0057-f" },
      { label: "CMS · Prior Authorization API FAQ", url: "https://www.cms.gov/initiatives/burden-reduction/overview/interoperability/frequently-asked-questions/prior-authorization-api" },
    ],
  },
  {
    id: "price-transparency",
    short: "Price Transparency",
    name: "Hospital Price Transparency — CY2026 OPPS updates",
    citation: "CY2026 OPPS/ASC Final Rule · EO of 25 Feb 2025",
    status: "in-effect",
    domain: "Provider",
    headline: "Enforcement of the updated machine-readable-file requirements began 1 April 2026 — with CEO attestation and real claims data, not estimates.",
    keyDates: [
      { date: "25 Feb 2025", iso: "2025-02-25", what: "Executive Order directing stronger enforcement and actual prices rather than estimates" },
      { date: "1 Apr 2026", iso: "2026-04-01", what: "CMS enforcement of the CY2026 OPPS price-transparency revisions begins" },
    ],
    requires: [
      "The 'estimated allowed amount' placeholder is eliminated",
      "Three new data elements derived from 12–15 months of actual claims history",
      "A hospital CEO or designated senior official must attest in writing that posted prices are true, accurate and complete",
    ],
    rcmImpact: "Posted rates become an attested, auditable disclosure of real negotiated prices. That changes payer negotiation dynamics — your rates and your competitors' are both legible — and it puts personal executive accountability behind data quality that was previously a back-office export.",
    gccImplication: "MRF generation, validation and reconciliation against contract terms is well-suited to a GCC revenue-integrity function — but the attestation requirement means the control environment and evidence trail must be strong enough for a CEO to sign.",
    boardQuestions: [
      "Who prepares the file our CEO is attesting to, and what QA sits behind that signature?",
      "Have we analysed competitors' posted rates as negotiation intelligence?",
      "Can we reconcile posted rates to actual adjudicated claims?",
    ],
    sources: [
      { label: "CMS · CY2026 OPPS price transparency fact sheet", url: "https://www.cms.gov/newsroom/fact-sheets/cy-2026-opps-ambulatory-surgical-center-final-rule-hospital-price-transparency-policy-changes" },
      { label: "CMS · Hospital Price Transparency", url: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency" },
    ],
  },
  {
    id: "hipaa-security",
    short: "HIPAA Security NPRM",
    name: "HIPAA Security Rule — proposed cybersecurity overhaul",
    citation: "HHS OCR NPRM · 6 Jan 2025",
    status: "proposed-delayed",
    domain: "Both",
    headline: "Proposed in January 2025, still not finalised as of July 2026 — final action now targeted for 2027. Plan, but do not yet build to it.",
    keyDates: [
      { date: "6 Jan 2025", iso: "2025-01-06", what: "NPRM published in the Federal Register" },
      { date: "7 Mar 2025", iso: "2025-03-07", what: "Comment period closed — over 4,000 comments received" },
      { date: "2027 (target)", iso: "2027-07-01", what: "Final action target per the Unified Agenda; no final rule as of July 2026" },
    ],
    requires: [
      "Proposed: remove the 'required' vs 'addressable' distinction — effectively making all specifications mandatory",
      "Proposed: comprehensive technology asset inventory and network mapping",
      "Proposed: mandatory multi-factor authentication and expanded encryption",
      "Proposed: more prescriptive risk analysis, vulnerability testing, business-associate oversight, and incident-response/disaster-recovery planning",
    ],
    rcmImpact: "Indirect but material: the proposal would extend hard controls to business associates, which includes most RCM vendors and offshore delivery centres. Industry pushback has been substantial — CHIME and 100+ health systems sought withdrawal, citing roughly $9B in first-year cost.",
    gccImplication: "This is the item most likely to affect GCC contracting. If finalised broadly, business-associate obligations become prescriptive rather than addressable, so BAAs, asset inventories and MFA coverage at offshore sites move from good practice to enforceable requirement. Build toward the controls; do not assume the timeline.",
    boardQuestions: [
      "Would our offshore delivery sites pass a prescriptive asset-inventory and MFA audit today?",
      "Do our BAAs anticipate a materially stricter Security Rule, or would they need renegotiation?",
      "What is our no-regrets subset of these controls — the ones worth doing regardless of the final rule?",
    ],
    sources: [
      { label: "HHS · Security Rule NPRM fact sheet", url: "https://www.hhs.gov/hipaa/for-professionals/security/hipaa-security-rule-nprm/factsheet/index.html" },
      { label: "HIPAA Journal · update postponed", url: "https://www.hipaajournal.com/hipaa-security-rule-update-postponed/" },
    ],
  },
  {
    id: "hcc-v28",
    short: "CMS-HCC V28",
    name: "CMS-HCC Risk Adjustment Model V28",
    citation: "CMS Rate Announcement · 3-year phase-in",
    status: "in-effect",
    domain: "Payer",
    headline: "The V24 → V28 transition completes in 2026 — risk scores now reflect the new model in full.",
    keyDates: [
      { date: "PY2024", iso: "2024-01-01", what: "Phase-in begins, blended with V24" },
      { date: "PY2026", iso: "2026-01-01", what: "Phase-in complete — V28 applies fully" },
    ],
    requires: [
      "Coding and documentation specificity aligned to the V28 condition categories",
      "Recapture discipline for chronic conditions that must be re-documented annually",
      "Risk-score forecasting rebased on V28 rather than blended assumptions",
    ],
    rcmImpact: "Revenue tied to risk scores is now fully exposed to V28. Conditions that carried weight under V24 and were removed or re-weighted no longer support the same RAF, so documentation habits built around the old model quietly under-capture acuity.",
    gccImplication: "Risk-adjustment analytics, HCC gap identification and compliant query support are strong GCC mandates — provided the OIG-safe framing (recapture with documentation integrity, never code-chasing) is designed into the workflow from the start.",
    boardQuestions: [
      "Have we rebased our RAF forecast on V28, or are we still assuming blended scores?",
      "Which conditions lost weight in V28, and what is that worth to us annually?",
      "Is our recapture programme defensible in an OIG audit — documentation-led, not code-led?",
    ],
    sources: [
      { label: "CMS · Advance Notice & Rate Announcement", url: "https://www.cms.gov/medicare/payment/medicare-advantage-rates-statistics" },
    ],
  },
];

/** Flattened, date-sorted view for the calendar. */
export function calendarEntries() {
  return regulations
    .flatMap((r) => r.keyDates.map((d) => ({ reg: r, ...d })))
    .sort((a, b) => a.iso.localeCompare(b.iso));
}
