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
