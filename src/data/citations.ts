export interface CitationSource {
  publisher: string;
  title: string;
  url: string;
  note?: string;
}

/** Primary-source registry. Keys are matched case-insensitively against the
 *  short source label rendered next to a metric, quote or policy item. */
export const CITATIONS: Record<string, CitationSource> = {
  hfma: {
    publisher: "HFMA",
    title: "MAP Keys — Industry-Standard Revenue Cycle Metrics",
    url: "https://www.hfma.org/finance-and-business-strategy/map-keys/",
    note: "Consensus KPI definitions and peer medians for US provider revenue cycle.",
  },
  "change healthcare": {
    publisher: "Optum / Change Healthcare",
    title: "Revenue Cycle Denials Index",
    url: "https://www.optum.com/en/business/insights.html",
    note: "National denial-rate tracking across commercial and government payers.",
  },
  "advisory board": {
    publisher: "Advisory Board",
    title: "Cost-to-Collect Benchmarking",
    url: "https://www.advisory.com/topics/revenue-cycle",
  },
  nsi: {
    publisher: "NSI Nursing Solutions",
    title: "National Health Care Retention & RN Staffing Report",
    url: "https://www.nsinursingsolutions.com/Library.html",
    note: "Annual RN vacancy and turnover survey of US hospitals.",
  },
  "kaufman hall": {
    publisher: "Kaufman Hall",
    title: "National Hospital Flash Report",
    url: "https://www.kaufmanhall.com/insights/research-report",
    note: "Monthly operating margin, labour and length-of-stay indicators.",
  },
  acep: {
    publisher: "American College of Emergency Physicians",
    title: "ED Boarding Crisis Resources",
    url: "https://www.acep.org/administration/crowding--boarding",
  },
  deloitte: {
    publisher: "Deloitte Center for Health Solutions",
    title: "Health Care Outlook & Generative AI Adoption Surveys",
    url: "https://www2.deloitte.com/us/en/insights/industry/health-care.html",
  },
  klas: {
    publisher: "KLAS Research",
    title: "Ambient Speech & Patient Access Best in KLAS Reports",
    url: "https://klasresearch.com/",
  },
  aapc: {
    publisher: "AAPC",
    title: "Autonomous Coding Adoption Research",
    url: "https://www.aapc.com/resources/",
  },
  ahip: {
    publisher: "AHIP",
    title: "Prior Authorization Automation Survey",
    url: "https://www.ahip.org/resources",
  },
  onc: {
    publisher: "ASTP/ONC",
    title: "Health IT Data & FHIR API Adoption",
    url: "https://www.healthit.gov/data/",
  },
  "astp/onc": {
    publisher: "ASTP/ONC",
    title: "TEFCA and HTI Certification Rules",
    url: "https://www.healthit.gov/topic/interoperability/policy/trusted-exchange-framework-and-common-agreement-tefca",
  },
  ibm: {
    publisher: "IBM Security / Ponemon",
    title: "Cost of a Data Breach Report",
    url: "https://www.ibm.com/reports/data-breach",
    note: "Healthcare has led all sectors on average breach cost for 14 consecutive years.",
  },
  "hhs ocr": {
    publisher: "HHS Office for Civil Rights",
    title: "Breach Portal — Cases Under Investigation",
    url: "https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf",
  },
  sophos: {
    publisher: "Sophos",
    title: "State of Ransomware in Healthcare",
    url: "https://www.sophos.com/en-us/content/state-of-ransomware",
  },
  himss: {
    publisher: "HIMSS",
    title: "Healthcare Cybersecurity Survey",
    url: "https://www.himss.org/resources-cybersecurity/",
  },
  nasscom: {
    publisher: "NASSCOM",
    title: "India GCC Landscape Report",
    url: "https://nasscom.in/knowledge-center",
    note: "Authoritative count of India-based capability centres and talent trends.",
  },
  "everest group": {
    publisher: "Everest Group",
    title: "Global Capability Center Maturity Research",
    url: "https://www.everestgrp.com/research/",
  },
  zinnov: {
    publisher: "Zinnov",
    title: "GCC Cost and Value Benchmarking",
    url: "https://zinnov.com/global-capability-centers/",
  },
  caqh: {
    publisher: "CAQH",
    title: "CAQH Index — Electronic Administrative Transactions",
    url: "https://www.caqh.org/insights/caqh-index",
  },
  cms: {
    publisher: "Centers for Medicare & Medicaid Services",
    title: "CMS-0057-F Interoperability and Prior Authorization Final Rule",
    url: "https://www.cms.gov/priorities/key-initiatives/burden-reduction/interoperability/policies-and-regulations/cms-interoperability-and-prior-authorization-final-rule-cms-0057-f",
  },
  "regulation (eu)": {
    publisher: "European Union",
    title: "Regulation (EU) 2024/1689 — Artificial Intelligence Act",
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
  },
  // Quote provenance
  "eric topol": {
    publisher: "Scripps Research",
    title: "Eric Topol — Ground Truths & Deep Medicine",
    url: "https://erictopol.substack.com/",
  },
  "shiv rao": {
    publisher: "HLTH / Abridge",
    title: "Abridge newsroom and HLTH conference remarks",
    url: "https://www.abridge.com/press",
  },
  "sachin jain": {
    publisher: "Forbes",
    title: "Sachin H. Jain — contributor columns",
    url: "https://www.forbes.com/sites/sachinjain/",
  },
  "rod hochman": {
    publisher: "American Hospital Association",
    title: "AHA Leadership Summit proceedings",
    url: "https://www.aha.org/education-events/aha-leadership-summit",
  },
  "debjani ghosh": {
    publisher: "NASSCOM",
    title: "GCC Landscape Report commentary",
    url: "https://nasscom.in/knowledge-center",
  },
  "rick gundling": {
    publisher: "HFMA",
    title: "HFMA Annual Conference and thought leadership",
    url: "https://www.hfma.org/",
  },
  "micky tripathi": {
    publisher: "ASTP/ONC",
    title: "National Coordinator remarks on TEFCA",
    url: "https://www.healthit.gov/buzz-blog/",
  },
  "robert califf": {
    publisher: "US FDA",
    title: "FDA commentary on clinical AI oversight",
    url: "https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-software-medical-device",
  },
  "rick pollack": {
    publisher: "American Hospital Association",
    title: "AHA statements on the 2024 clearinghouse cyber outage",
    url: "https://www.aha.org/cybersecurity",
  },
  "chiquita brooks-lasure": {
    publisher: "CMS",
    title: "CMS newsroom — prior authorization reform",
    url: "https://www.cms.gov/newsroom",
  },
};

/** Resolve a free-text source label (e.g. "NSI 2025", "HFMA MAP Keys") to a primary source. */
export function resolveCitation(label: string): CitationSource | undefined {
  const key = label.toLowerCase();
  if (CITATIONS[key]) return CITATIONS[key];
  const match = Object.keys(CITATIONS).find((k) => key.includes(k));
  return match ? CITATIONS[match] : undefined;
}
