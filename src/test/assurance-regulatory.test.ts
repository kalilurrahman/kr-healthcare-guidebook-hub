import { describe, it, expect } from "vitest";
import { acuitasPillars, acuitasMeta, assuranceGates, assuranceLevels } from "@/data/ai-assurance-data";
import { regulations, calendarEntries, regStatusMeta } from "@/data/regulatory-data";

// Mirrors the banding in AiAssurancePage.
const levelFor = (pct: number) => (pct >= 90 ? 5 : pct >= 72 ? 4 : pct >= 50 ? 3 : pct >= 25 ? 2 : 1);

describe("ACUITAS — framework integrity", () => {
  it("has exactly seven pillars spelling ACUITAS", () => {
    expect(acuitasPillars).toHaveLength(7);
    expect(acuitasMeta.pillarCount).toBe(7);
    // A2 is the second 'A' in the acronym.
    const acronym = acuitasPillars.map((p) => p.letter.replace("₂", "")).join("");
    expect(acronym).toBe("ACUITAS");
  });

  it("every pillar carries its verbatim core principle plus the adaptation layer", () => {
    for (const p of acuitasPillars) {
      expect(p.corePrinciple, `${p.letter} corePrinciple`).toBeTruthy();
      expect(p.healthcareApplication, `${p.letter} healthcareApplication`).toBeTruthy();
      expect(p.agenticRisk, `${p.letter} agenticRisk`).toBeTruthy();
      expect(p.controls.length, `${p.letter} controls`).toBeGreaterThan(0);
      expect(p.regulatory.length, `${p.letter} regulatory`).toBeGreaterThan(0);
    }
  });

  it("every readiness gate maps to a real pillar, and every pillar has gates", () => {
    const ids = new Set(acuitasPillars.map((p) => p.id));
    for (const g of assuranceGates) expect(ids.has(g.pillar), `gate ${g.id} -> ${g.pillar}`).toBe(true);
    for (const p of acuitasPillars) {
      expect(assuranceGates.some((g) => g.pillar === p.id), `${p.title} has no gate`).toBe(true);
    }
  });
});

describe("ACUITAS — scoring", () => {
  it("zero gates met is L1, all gates met is L5", () => {
    expect(levelFor(0)).toBe(1);
    expect(levelFor(100)).toBe(5);
  });

  it("banding is monotonic — more gates never lowers the level", () => {
    let prev = 0;
    for (let pct = 0; pct <= 100; pct++) {
      const l = levelFor(pct);
      expect(l).toBeGreaterThanOrEqual(prev);
      prev = l;
    }
  });

  it("levels are a complete 1-5 ladder with summaries", () => {
    expect(assuranceLevels.map((l) => l.level)).toEqual([1, 2, 3, 4, 5]);
    for (const l of assuranceLevels) expect(l.summary).toBeTruthy();
  });
});

describe("Regulatory calendar — integrity", () => {
  it("every regulation has dates, requirements, sources and board questions", () => {
    for (const r of regulations) {
      expect(r.keyDates.length, `${r.short} keyDates`).toBeGreaterThan(0);
      expect(r.requires.length, `${r.short} requires`).toBeGreaterThan(0);
      expect(r.boardQuestions.length, `${r.short} boardQuestions`).toBeGreaterThan(0);
      expect(r.sources.length, `${r.short} sources`).toBeGreaterThan(0);
      expect(r.gccImplication, `${r.short} gccImplication`).toBeTruthy();
    }
  });

  it("every source is an https URL to a real host", () => {
    for (const r of regulations) {
      for (const s of r.sources) {
        expect(s.url, `${r.short}: ${s.label}`).toMatch(/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}/i);
      }
    }
  });

  it("every key date has a sortable ISO value matching its display year", () => {
    for (const r of regulations) {
      for (const d of r.keyDates) {
        expect(d.iso, `${r.short}: ${d.date}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const year = d.iso.slice(0, 4);
        expect(d.date, `${r.short}: ${d.date} vs ${d.iso}`).toContain(year);
      }
    }
  });

  it("the calendar is returned in chronological order", () => {
    const cal = calendarEntries();
    const isos = cal.map((e) => e.iso);
    expect(isos).toEqual([...isos].sort());
  });

  it("every status used has display metadata", () => {
    for (const r of regulations) expect(regStatusMeta[r.status], r.short).toBeDefined();
  });

  it("a proposed rule is never presented as binding", () => {
    // Guards against the failure mode of asserting an unfinalised rule as law.
    const hipaa = regulations.find((r) => r.id === "hipaa-security")!;
    expect(hipaa.status).toBe("proposed-delayed");
    expect(hipaa.requires.every((x) => /^proposed/i.test(x))).toBe(true);
  });
});
