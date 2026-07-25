import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { bcmStats, bcmCapabilities, bcmDomains } from "@/data/bcm-data";

// A download card promising a file that does not exist is a silent 404 for the
// visitor. This guards the offer list against the file set on disk.
const src = readFileSync(resolve(__dirname, "../components/ResourcesSection.tsx"), "utf8");
const offered = [...src.matchAll(/filename: "([^"]+)"/g)]
  .map((m) => m[1])
  .filter((f) => !f.startsWith("/")); // internal routes are not files

describe("Resources — every offered download exists", () => {
  it("finds at least one offered file", () => {
    expect(offered.length).toBeGreaterThan(0);
  });

  it.each(offered)("%s exists in public/resources", (file) => {
    const p = resolve(__dirname, "../../public/resources", file);
    expect(existsSync(p), `${file} is offered for download but missing on disk`).toBe(true);
  });

  it("no offered file is empty", () => {
    for (const f of offered) {
      const p = resolve(__dirname, "../../public/resources", f);
      if (existsSync(p)) expect(statSync(p).size, f).toBeGreaterThan(0);
    }
  });
});

describe("Capability map — advertised counts match the data", () => {
  it("the process count shown equals the number of processes present", () => {
    const claimed = Number(bcmStats.find((s) => s.label === "Business Processes")!.value);
    expect(claimed).toBe(bcmCapabilities.length);
  });

  it("the domain count shown equals the number of distinct domains", () => {
    const claimed = Number(bcmStats.find((s) => s.label === "Capability Domains")!.value);
    expect(claimed).toBe(bcmDomains.length);
    expect(new Set(bcmCapabilities.map((c) => c.domain)).size).toBe(bcmDomains.length);
  });
});

// ---- advertised counts across the rest of the site ----
import { handbookStats, coverStats, healthcareVolumes, allChapters } from "@/data/healthcare-data";
import { gccMetrics, gccHighlightStats, gccDimensions } from "@/data/gcc-metrics";
import { rcmTabs } from "@/data/rcm-playbook-chapters";

describe("Advertised counts match the underlying data", () => {
  it("chapter and volume counts are real", () => {
    expect(handbookStats.chapters).toBe(allChapters.length);
    expect(handbookStats.volumes).toBe(healthcareVolumes.length);
    expect(coverStats.find((s) => s.label === "Strategic Chapters")!.value).toBe(String(allChapters.length));
    expect(coverStats.find((s) => s.label === "Volumes")!.value).toBe(String(healthcareVolumes.length));
  });

  it("the RCM playbook count is the number of playbooks, not the highest id", () => {
    // rcm-* ids run to 61 but skip 5-7, so the count is 58. Counting by the
    // highest id is exactly the mistake this guards against.
    const rcmCount = rcmTabs.flatMap((t) => t.chapters).filter((c) => c.id.startsWith("rcm-")).length;
    expect(handbookStats.playbooks).toBe(rcmCount);
    expect(coverStats.find((s) => s.label === "RCM Playbooks")!.value).toBe(String(rcmCount));
  });

  it("GCC metric and dimension counts are real", () => {
    expect(gccHighlightStats.find((s) => s.label === "Metrics Tracked")!.value).toBe(String(gccMetrics.length));
    expect(gccHighlightStats.find((s) => s.label === "Dimensions")!.value).toBe(String(gccDimensions.length));
  });

  it("every metric belongs to a declared dimension", () => {
    for (const m of gccMetrics) expect(gccDimensions, m.metric).toContain(m.dimension);
  });
});
