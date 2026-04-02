export interface RCMChapter {
  id: string;
  title: string;
}

export interface RCMTab {
  id: string;
  label: string;
  chapters: RCMChapter[];
}

export const rcmTabs: RCMTab[] = [
  {
    id: 'revenue-cycle-core',
    label: 'Revenue Cycle Core',
    chapters: [
      { id: 'rcm-01', title: 'RCM End-to-End Operating Model' },
      { id: 'rcm-02', title: 'Payer & Claims Adjudication Deep Dive' },
      { id: 'rcm-03', title: 'Provider Network Management' },
      { id: 'rcm-04', title: 'Care Management & Population Health' },
      { id: 'rcm-08', title: 'Claims Adjudication — Full Chapter' },
      { id: 'rcm-09', title: 'Provider Credentialing — Full Chapter' },
      { id: 'rcm-10', title: 'Denial Management & Prevention' },
      { id: 'rcm-11', title: 'Patient Eligibility Verification' },
      { id: 'rcm-12', title: 'Risk Stratification' },
      { id: 'rcm-13', title: 'Prior Authorization' },
    ],
  },
  {
    id: 'patient-access',
    label: 'Patient Access & Ops',
    chapters: [
      { id: 'rcm-14', title: 'PBM Formulary & Rebate Operations' },
      { id: 'rcm-15', title: 'Care Management & Utilization Management' },
      { id: 'rcm-16', title: 'Medical Coding & CDI' },
      { id: 'rcm-17', title: 'Payment Integrity, FWA & Audit Analytics' },
      { id: 'rcm-18', title: 'Denials Management' },
      { id: 'rcm-19', title: 'Patient Financial Counseling' },
      { id: 'rcm-20', title: 'Patient Access & Scheduling' },
      { id: 'rcm-21', title: 'Claims Processing & Adjudication' },
      { id: 'rcm-22', title: 'Revenue Integrity & Charge Capture' },
      { id: 'rcm-23', title: 'Healthcare Contact Center — Member/Patient Services' },
      { id: 'rcm-24', title: 'Population Health Management' },
      { id: 'rcm-25', title: 'Compliance & Regulatory Affairs' },
    ],
  },
  {
    id: 'value-based-specialty',
    label: 'Value-Based & Specialty',
    chapters: [
      { id: 'rcm-26', title: 'Value-Based Care & ACOs' },
      { id: 'rcm-27', title: 'Digital Transformation & Health IT' },
      { id: 'rcm-28', title: 'Physician Engagement & Network Management' },
      { id: 'rcm-29', title: 'Provider Enrollment & Contracting' },
      { id: 'rcm-30', title: 'Specialty Services, Home Health & Post-Acute Care' },
      { id: 'rcm-31', title: 'PBM Prior Auth, Specialty Pharmacy & Medication Mgmt' },
      { id: 'rcm-32', title: 'Healthcare AI GCC Operating Model & Capability Map' },
      { id: 'rcm-33', title: 'Patient Access & Scheduling (Refined)' },
      { id: 'rcm-34', title: 'Denial Management & Appeals (Refined)' },
      { id: 'rcm-35', title: 'Coding & Compliance (Refined)' },
    ],
  },
  {
    id: 'analytics-ai',
    label: 'Analytics & AI',
    chapters: [
      { id: 'rcm-36', title: 'Analytics & Reporting for RCM' },
      { id: 'rcm-37', title: 'Denial Management & Appeals (Multi-Tab)' },
      { id: 'rcm-38', title: 'Coding & Charge Capture' },
      { id: 'rcm-39', title: 'Patient Financial Services' },
      { id: 'rcm-40', title: 'Technology & Automation in RCM' },
      { id: 'rcm-41', title: 'Benchmarking & Performance Improvement' },
      { id: 'rcm-42', title: 'Executive Summary' },
      { id: 'rcm-43', title: 'How to Implement the RCM Playbook in a Hospital' },
      { id: 'rcm-44', title: 'Healthcare AI & Analytics' },
      { id: 'rcm-45', title: 'Risk Stratification Case Studies' },
      { id: 'rcm-46', title: 'Revenue Integrity' },
      { id: 'rcm-47', title: 'RCM Implementation Checklist' },
      { id: 'rcm-48', title: 'AI Tools for Claims Denial Prevention' },
      { id: 'rcm-49', title: 'Healthcare AI in Hospitals — Case Studies' },
      { id: 'rcm-50', title: 'AI Analytics Dashboard Templates' },
    ],
  },
  {
    id: 'implementation-training',
    label: 'Implementation & Training',
    chapters: [
      { id: 'rcm-51', title: 'RCM Implementation Training Program' },
      { id: 'rcm-52', title: 'Best AI Tools for RCM Denial Prediction 2026' },
      { id: 'rcm-53', title: 'Implementation Roadmap for AI in Healthcare RCM' },
      { id: 'rcm-54', title: 'Metrics to Measure AI Denial Prevention Success' },
      { id: 'rcm-55', title: 'AI Reducing RCM Costs — Small Hospital Case Studies' },
      { id: 'rcm-56', title: 'Templates for AI-Powered RCM Dashboards & Reports' },
      { id: 'rcm-57', title: 'AI Roadmap for Healthcare RCM 2026' },
      { id: 'rcm-58', title: 'AI Denial Prevention Success Metrics' },
      { id: 'rcm-59', title: 'AI Case Studies — Small Hospital RCM Cost Reduction' },
      { id: 'rcm-60', title: 'AI-Powered RCM Dashboard Templates' },
      { id: 'rcm-61', title: 'Training Staff on AI for Claims Processing' },
    ],
  },
  {
    id: 'reference-notes',
    label: 'Reference Notes',
    chapters: [
      { id: 'ref-01', title: 'AI Tools for Claims Auto-Adjudication' },
      { id: 'ref-02', title: 'Analytics & Reporting for RCM Playbook' },
      { id: 'ref-03', title: 'Best AI Tools for Patient Eligibility Verification' },
      { id: 'ref-04', title: 'Claims Adjudication KPIs' },
      { id: 'ref-05', title: 'Claims Auto-Adjudication Technologies & Denial Prevention' },
      { id: 'ref-06', title: 'Credentialing & Enrollment Tools and Software' },
      { id: 'ref-07', title: 'Hospital AI Denial Prevention Pitfalls' },
      { id: 'ref-08', title: 'Medicare vs Medicaid Enrollment Requirements' },
      { id: 'ref-09', title: 'Negotiating Better Reimbursement Rates' },
      { id: 'ref-10', title: 'Prior Authorization Workflows & Automation Best Practices' },
      { id: 'ref-11', title: 'Provider Credentialing Maintenance Pitfalls' },
      { id: 'ref-12', title: 'Provider Credentialing PSV Expanded Checklists' },
      { id: 'ref-13', title: 'Root Cause Analysis Templates for High-Value Denials' },
      { id: 'ref-14', title: 'Sample CDI Checklists' },
      { id: 'ref-15', title: 'Strategies to Appeal Clinical Validation Denials' },
    ],
  },
];
