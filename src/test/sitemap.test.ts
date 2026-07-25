import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { routeSeo, SITE_URL } from "@/lib/seo";

// A route shipped without a sitemap entry is invisible to crawlers. /pa-accelerate
// was added and the sitemap was not updated, so this guards both directions.
const appSrc = readFileSync(resolve(__dirname, "../App.tsx"), "utf8");
const sitemap = readFileSync(resolve(__dirname, "../../public/sitemap.xml"), "utf8");

const appRoutes = [...appSrc.matchAll(/path="(\/[a-z-]*)"/g)].map((m) => m[1]);
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const urlFor = (r: string) => (r === "/" ? SITE_URL : `${SITE_URL}${r}`);

describe("sitemap.xml covers the app", () => {
  it("finds routes and locs", () => {
    expect(appRoutes.length).toBeGreaterThan(5);
    expect(sitemapLocs.length).toBeGreaterThan(5);
  });

  it.each(appRoutes)("route %s is listed in the sitemap", (route) => {
    expect(sitemapLocs, `${route} is routed but missing from sitemap.xml`).toContain(urlFor(route));
  });

  it("lists no URL that is not a real route", () => {
    const valid = new Set(appRoutes.map(urlFor));
    for (const loc of sitemapLocs) {
      expect(valid.has(loc), `${loc} is in the sitemap but is not a registered route`).toBe(true);
    }
  });

  it("every route has SEO copy defined", () => {
    const seoPaths = new Set(Object.values(routeSeo).map((s) => s.path));
    for (const r of appRoutes) {
      expect(seoPaths.has(r), `${r} has no entry in routeSeo — it would inherit the homepage title`).toBe(true);
    }
  });

  it("sitemap entries are unique", () => {
    expect(new Set(sitemapLocs).size).toBe(sitemapLocs.length);
  });
});
