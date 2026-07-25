import { describe, it, expect } from "vitest";
import { rubric, sliceSections, matchesPattern, countPatterns, sampleNote } from "@/data/qa-scorecard-data";

const check = (id: string) => rubric.find(c => c.id === id)!;
const evalCheck = (note: string, id: string) => {
  const c = check(id);
  const sections = sliceSections(note);
  const target = c.scope ? sections[c.scope] : note.toLowerCase();
  if (c.mode === "any") return target.trim() && c.patterns.some(p => matchesPattern(target, p)) ? "good" : "missing";
  const n = target.trim() ? countPatterns(target, c.patterns) : 0;
  const good = c.goodThreshold ?? 3;
  return n >= good ? "good" : n >= 1 ? "partial" : "missing";
};

describe("rubric integrity", () => {
  it("weights sum to 100", () => {
    expect(rubric.reduce((s, c) => s + c.weight, 0)).toBe(100);
  });
});

describe("regressions: no false 'Complete'", () => {
  it("meds NOT credited from 'activities of daily living'", () => {
    expect(evalCheck("HPI: difficulty with activities of daily living.", "medications")).toBe("missing");
  });
  it("attribution NOT credited from ordinary prose 'we do not'", () => {
    expect(evalCheck("PLAN: we do not recommend surgery.", "attribution")).toBe("missing");
  });
  it("ROS NOT credited from a lab line 'negative for growth'", () => {
    expect(evalCheck("OBJECTIVE: cultures were negative for growth.", "ros")).toBe("missing");
  });
  it("CDI NOT credited when only the HPI is descriptive", () => {
    const note = `HPI: severe left-sided chronic pain, moderate, acute onset.
ASSESSMENT: pain.
PLAN: rest.`;
    expect(evalCheck(note, "assessment-specificity")).toBe("missing");
  });
  it("'controlled' does not double-count inside 'uncontrolled'", () => {
    expect(countPatterns("uncontrolled diabetes", ["uncontrolled", "well-controlled"])).toBe(1);
  });
});

describe("true positives still detected", () => {
  it("CDI credited for a genuinely specific assessment", () => {
    const note = `HPI: pain.
ASSESSMENT: Chronic left-sided radiculopathy, moderate, without acute exacerbation. Type 2 diabetes, well-controlled.`;
    expect(evalCheck(note, "assessment-specificity")).toBe("good");
  });
  it("meds credited from a real med list", () => {
    expect(evalCheck("MEDICATIONS: Metformin 1000 mg twice daily.", "medications")).toBe("good");
  });
  it("attribution credited when signed", () => {
    expect(evalCheck("Electronically signed by Provider, M.D.", "attribution")).toBe("good");
  });
  it("ROS credited from a real ROS section", () => {
    expect(evalCheck("REVIEW OF SYSTEMS: Constitutional: denies fever. Cardiovascular: no chest pain.", "ros")).toBe("good");
  });
  it("sample note still scores well but flags missing ROS + allergies", () => {
    expect(evalCheck(sampleNote, "ros")).toBe("missing");
    expect(evalCheck(sampleNote, "allergies")).toBe("missing");
    expect(evalCheck(sampleNote, "assessment-specificity")).toBe("good");
    expect(evalCheck(sampleNote, "medications")).toBe("good");
    expect(evalCheck(sampleNote, "attribution")).toBe("good");
  });
});

describe("rubric completeness", () => {
  it("every check has a non-empty recommendation, label and patterns", () => {
    for (const c of rubric) {
      expect(c.recommendation, `${c.id} recommendation`).toBeTruthy();
      expect(c.label, `${c.id} label`).toBeTruthy();
      expect(c.patterns.length, `${c.id} patterns`).toBeGreaterThan(0);
    }
  });
});
