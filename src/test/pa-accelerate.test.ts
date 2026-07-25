import { describe, it, expect } from "vitest";
import { paServiceCategories, paReadinessGates, paComplianceDates, paBenchmarks } from "@/data/pa-accelerate-data";
import { regulations } from "@/data/regulatory-data";

describe("PA-Accelerate — data integrity", () => {
  it("every service category is complete", () => {
    for (const c of paServiceCategories) {
      expect(c.medicalNecessityElements.length, c.name).toBeGreaterThan(0);
      expect(c.commonDenialReasons.length, c.name).toBeGreaterThan(0);
      expect(c.documentation.length, c.name).toBeGreaterThan(0);
      expect(c.goldCardingNote, c.name).toBeTruthy();
      expect(["standard", "elevated", "high"]).toContain(c.scrutiny);
    }
  });

  it("ids are unique across categories and gates", () => {
    const cids = paServiceCategories.map((c) => c.id);
    expect(new Set(cids).size).toBe(cids.length);
    const gids = paReadinessGates.map((g) => g.id);
    expect(new Set(gids).size).toBe(gids.length);
  });

  it("every readiness gate explains its gap and uses a known area", () => {
    const areas = ["Intake", "Determination", "Submission", "Tracking", "Interoperability"];
    for (const g of paReadinessGates) {
      expect(g.gap, g.id).toBeTruthy();
      expect(areas, g.id).toContain(g.area);
    }
  });

  it("every area has at least one gate", () => {
    for (const a of ["Intake", "Determination", "Submission", "Tracking", "Interoperability"]) {
      expect(paReadinessGates.some((g) => g.area === a), a).toBe(true);
    }
  });

  it("benchmarks declare both a best-in-class and a typical value", () => {
    for (const b of paBenchmarks) {
      expect(b.bestInClass, b.label).toBeTruthy();
      expect(b.typical, b.label).toBeTruthy();
    }
  });
});

describe("PA-Accelerate — stays in step with the Regulatory Calendar", () => {
  it("every compliance date shown matches a CMS-0057-F key date", () => {
    const cms = regulations.find((r) => r.id === "cms0057")!;
    const known = new Set(cms.keyDates.map((d) => d.date));
    for (const d of paComplianceDates) {
      expect(known.has(d.date), `${d.date} is not a CMS-0057-F key date`).toBe(true);
    }
  });

  it("gates citing a dated obligation reference CMS-0057-F", () => {
    for (const g of paReadinessGates.filter((x) => x.mapsTo)) {
      expect(g.mapsTo).toMatch(/CMS-0057-F/);
    }
  });
});
