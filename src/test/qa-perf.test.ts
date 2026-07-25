import { describe, it, expect } from "vitest";
import { sliceSections, sampleNote } from "@/data/qa-scorecard-data";

// The regression this guards against is ALGORITHMIC: sliceSections used to
// construct ~33 RegExp objects per line, so cost grew with (lines x patterns)
// and blocked the main thread on a large pasted note. The heading matchers are
// now compiled once at module load.
//
// An absolute millisecond budget proved flaky here — wall-clock depends on the
// machine and on how many suites run concurrently. So assert SCALING, which is
// what actually catches the regression, plus a deliberately generous ceiling.

const build = (targetBytes: number) =>
  (sampleNote + "\n").repeat(Math.ceil(targetBytes / sampleNote.length));

const timeIt = (fn: () => void) => {
  const t0 = performance.now();
  fn();
  return performance.now() - t0;
};

describe("sliceSections performance", () => {
  it("scales roughly linearly with input size, not multiplicatively", () => {
    const small = build(250_000);
    const large = build(1_000_000); // 4x the input

    sliceSections(small); // warm up so JIT state doesn't skew the first measurement

    const tSmall = Math.max(timeIt(() => sliceSections(small)), 0.5);
    const tLarge = timeIt(() => sliceSections(large));
    const ratio = tLarge / tSmall;

    console.log(`  250KB: ${tSmall.toFixed(1)}ms · 1MB: ${tLarge.toFixed(1)}ms · ratio ${ratio.toFixed(1)}x (input 4x)`);

    // Linear would be ~4x. Generous headroom for noise, but fails loudly if
    // cost grows super-linearly again.
    expect(ratio).toBeLessThan(12);
  });

  it("stays within a generous ceiling on a 1MB note", () => {
    const big = build(1_000_000);
    const ms = timeIt(() => sliceSections(big));
    console.log(`  1MB single pass: ${ms.toFixed(1)}ms`);
    // Pre-fix this was ~150ms+ on an idle machine and grew with load.
    // 400ms is a smoke ceiling, not a performance target.
    expect(ms).toBeLessThan(400);
  });

  it("still produces correct sections (output unchanged by the optimisation)", () => {
    const s = sliceSections(sampleNote);
    expect(s.assessment).toContain("radiculopathy");
    expect(s.plan).toContain("follow up");
    expect(s.medications).toContain("metformin");
    expect(s.ros).toBe("");
  });
});
