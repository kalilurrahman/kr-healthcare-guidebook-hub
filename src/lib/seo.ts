import { useEffect } from "react";

// Per-route SEO. This is a client-rendered SPA, so every route previously
// shared index.html's single title/description — bad for search results and
// for link previews, where every shared URL looked identical. This sets the
// document title, description, canonical and social tags per route without
// pulling in a helmet dependency.

export const SITE_URL = "https://healthcare.kalilurrahman.com";
export const SITE_NAME = "Healthcare GCC & Digital Transformation Handbook";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface SeoInput {
  title: string;
  description: string;
  /** Route path, e.g. "/diagnostic". Used for the canonical URL. */
  path: string;
}

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSeo({ title, description, path }: SeoInput) {
  useEffect(() => {
    const fullTitle = path === "/" ? `${title} | Kalilur Rahman` : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path === "/" ? "" : path}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", description);
    setCanonical(url);

    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", OG_IMAGE);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);

    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", OG_IMAGE);
  }, [title, description, path]);
}

/** Canonical copy for every route, kept in one place so it stays consistent. */
export const routeSeo: Record<string, SeoInput> = {
  home: {
    path: "/",
    title: "Healthcare GCC Digital Transformation Handbook",
    description:
      "The definitive operating playbook for healthcare executives, GCC leaders, and revenue cycle professionals — 60 strategic chapters, 8 volumes, and free AI-native tools.",
  },
  reader: {
    path: "/reader",
    title: "Online Reader — 23 Chapters",
    description:
      "The Healthcare Industry Digital Transformation Handbook 2026: 23 chapters across 9 parts, with executive summaries, KPI benchmark tables and board-level questions.",
  },
  gccMetrics: {
    path: "/gcc-metrics",
    title: "GCC Maturity Benchmarks",
    description:
      "37 benchmarked metrics across 9 dimensions for evaluating healthcare Global Capability Centre maturity, from strategic alignment to value delivered.",
  },
  bcm: {
    path: "/bcm",
    title: "Healthcare Business Capability Map",
    description:
      "7 capability domains, 36 business processes and 200+ named technology players across enterprise, mid-market, niche, payer and digital-first segments.",
  },
  diagnostic: {
    path: "/diagnostic",
    title: "RCM & GCC Maturity Diagnostic",
    description:
      "Score your revenue cycle, AI adoption and operating model against best-in-class benchmarks. Free, runs in your browser, and returns a prioritized roadmap in two minutes.",
  },
  appealForge: {
    path: "/appeal-forge",
    title: "AppealForge — Denial Appeal Letter Generator",
    description:
      "Turn a denial code into a payer-specific, clinically-argued appeal letter in seconds, with the evidence checklist that maximizes overturn. No PHI leaves your browser.",
  },
  noteQa: {
    path: "/note-qa",
    title: "Ambient Note QA Scorecard",
    description:
      "Grade an ambient-scribe or clinical note against a 9-dimension completeness and CDI/coding rubric — specificity gaps, safety flags and fix-it recommendations.",
  },
  aiAssurance: {
    path: "/ai-assurance",
    title: "Agentic AI Assurance — ACUITAS™",
    description:
      "Govern autonomous healthcare AI against the seven ACUITAS pillars. Score your assurance level across traceability, validation, oversight and adaptive risk.",
  },
  agentops: {
    path: "/agentops",
    title: "AgentOps GCC Launch Planner",
    description:
      "Pick RCM workflows and target autonomy, and get a risk-capped launch plan: PDD outline, exception register, five-day enablement schedule and go-live KPIs.",
  },
  paAccelerate: {
    path: "/pa-accelerate",
    title: "PA-Accelerate — Prior Authorization Readiness & Packet Builder",
    description:
      "Check your prior-authorization operation against the CMS-0057-F obligations, then generate a payer-ready PA request that addresses medical necessity the way reviewers assess it.",
  },
  regulatory: {
    path: "/regulatory",
    title: "Regulatory Calendar 2026–2027",
    description:
      "The rules binding US healthcare operations through 2027 — TEAM, CMS-0057-F, price transparency, HIPAA Security and CMS-HCC V28 — with dates, impact and board questions.",
  },
};
