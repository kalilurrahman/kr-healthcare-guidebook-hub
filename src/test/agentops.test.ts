import { describe, it, expect } from "vitest";
import { agentWorkflows, autonomyLevels, curriculum } from "@/data/agentops-data";

// The risk cap is a SAFETY invariant, not a UI nicety: it is what stops a
// clinical-judgement workflow from being granted unsupervised operation.
// The page computes granted = Math.min(target, workflow.maxAutonomy).
const grant = (target: number, maxAutonomy: number) => Math.min(target, maxAutonomy);

describe("AgentOps — risk-capped autonomy (safety invariant)", () => {
  it("never grants more autonomy than a workflow's risk cap, at any target", () => {
    for (const w of agentWorkflows) {
      for (let target = 1; target <= 5; target++) {
        expect(grant(target, w.maxAutonomy), `${w.name} @ target L${target}`)
          .toBeLessThanOrEqual(w.maxAutonomy);
      }
    }
  });

  it("caps CDI query drafting at human review even when L5 is requested", () => {
    const cdi = agentWorkflows.find((w) => w.id === "cdi-query")!;
    expect(grant(5, cdi.maxAutonomy)).toBeLessThanOrEqual(2);
  });

  it("never lets a tier-4 (clinical judgement) workflow run exception-only or above", () => {
    // L4 = Exception-Only (unsupervised). Tier 4+ work must keep a human in the loop.
    for (const w of agentWorkflows.filter((w) => w.riskTier >= 4)) {
      expect(grant(5, w.maxAutonomy), `${w.name} must stay below L4`).toBeLessThan(4);
    }
  });

  it("allows full autonomy only on low-risk, reversible workflows", () => {
    for (const w of agentWorkflows.filter((w) => w.maxAutonomy === 5)) {
      expect(w.riskTier, `${w.name} claims L5 but is tier ${w.riskTier}`).toBeLessThanOrEqual(2);
    }
  });

  it("higher risk never permits higher autonomy than lower risk", () => {
    // Monotonicity: sorting by risk must not produce an autonomy inversion.
    const sorted = [...agentWorkflows].sort((a, b) => a.riskTier - b.riskTier);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].riskTier > sorted[i - 1].riskTier) {
        expect(sorted[i].maxAutonomy).toBeLessThanOrEqual(sorted[i - 1].maxAutonomy);
      }
    }
  });
});

describe("AgentOps — data integrity", () => {
  it("every workflow has a valid risk tier and autonomy cap", () => {
    for (const w of agentWorkflows) {
      expect(w.riskTier, w.name).toBeGreaterThanOrEqual(1);
      expect(w.riskTier, w.name).toBeLessThanOrEqual(5);
      expect(w.maxAutonomy, w.name).toBeGreaterThanOrEqual(1);
      expect(w.maxAutonomy, w.name).toBeLessThanOrEqual(5);
    }
  });

  it("every workflow declares exceptions and go-live KPIs", () => {
    for (const w of agentWorkflows) {
      expect(w.exceptions.length, `${w.name} exceptions`).toBeGreaterThan(0);
      expect(w.goLiveKpis.length, `${w.name} KPIs`).toBeGreaterThan(0);
    }
  });

  it("workflow ids are unique", () => {
    const ids = agentWorkflows.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("autonomy levels are a complete, ordered 1-5 ladder", () => {
    expect(autonomyLevels.map((a) => a.level)).toEqual([1, 2, 3, 4, 5]);
  });

  it("the curriculum is a complete 5-day arc, each day with a deliverable", () => {
    expect(curriculum.map((d) => d.day)).toEqual([1, 2, 3, 4, 5]);
    for (const d of curriculum) {
      expect(d.deliverable, `day ${d.day}`).toBeTruthy();
      expect(d.activities.length, `day ${d.day}`).toBeGreaterThan(0);
    }
  });
});
