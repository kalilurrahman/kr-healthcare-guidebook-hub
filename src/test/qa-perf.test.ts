import { describe, it, expect } from "vitest";
import { sliceSections, sampleNote } from "@/data/qa-scorecard-data";

describe("sliceSections performance", () => {
  it("handles a 1MB note in well under 50ms", () => {
    const big = (sampleNote + "\n").repeat(Math.ceil(1_000_000 / sampleNote.length));
    const t0 = performance.now();
    const r = sliceSections(big);
    const ms = performance.now() - t0;
    console.log(`  1MB note (${(big.length/1e6).toFixed(2)}MB, ${big.split("\n").length} lines): ${ms.toFixed(1)}ms`);
    expect(r.assessment).toBeTruthy();
    expect(ms).toBeLessThan(50);
  });
  it("still produces correct sections (output unchanged)", () => {
    const s = sliceSections(sampleNote);
    expect(s.assessment).toContain("radiculopathy");
    expect(s.plan).toContain("follow up");
    expect(s.medications).toContain("metformin");
    expect(s.ros).toBe("");
  });
});
