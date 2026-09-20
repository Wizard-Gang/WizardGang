import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import worker, { PERMANENT_REDIRECTS } from "../src/worker/index.ts";
import { CANONICAL_PAGES, SITEMAP_ROUTES, anchors, dist, exists, readDist } from "./helpers.mjs";

const SITE = "https://wizardgang.ai";

const wg048Compatibility = new Map([
  ["/work", "/about/team/jacob/"],
  ["/work/", "/about/team/jacob/"],
  ["/resume", "/about/team/jacob/"],
  ["/resume/", "/about/team/jacob/"],
  ["/professional", "/about/team/jacob/"],
  ["/professional/", "/about/team/jacob/"],
  ["/projects", "/software/projects/"],
  ["/projects/", "/software/projects/"],
  ["/projects/sharktank", "/software/projects/sharktank/"],
  ["/projects/sharktank/", "/software/projects/sharktank/"],
  ["/projects/sharktank/case-study", "/software/projects/sharktank/case-study/"],
  ["/projects/sharktank/case-study/", "/software/projects/sharktank/case-study/"],
  ["/projects/hexframe", "/software/projects/hexframe/"],
  ["/projects/hexframe/", "/software/projects/hexframe/"],
  ["/projects/hexframe/case-study", "/software/projects/hexframe/case-study/"],
  ["/projects/hexframe/case-study/", "/software/projects/hexframe/case-study/"],
  ["/projects/yarreader", "/software/projects/yarreader/"],
  ["/projects/yarreader/", "/software/projects/yarreader/"],
  ["/projects/yarreader/case-study", "/software/projects/yarreader/case-study/"],
  ["/projects/yarreader/case-study/", "/software/projects/yarreader/case-study/"],
  ["/services", "/solutions/websites/"],
  ["/services/", "/solutions/websites/"],
  ["/services/example", "/solutions/websites/"],
  ["/services/example/", "/solutions/websites/"],
  ["/work/shadowmoney", "/software/projects/hexframe/"],
  ["/work/shadowmoney/", "/software/projects/hexframe/"],
  ["/work/hexframe", "/software/projects/hexframe/"],
  ["/work/hexframe/", "/software/projects/hexframe/"],
  ["/work/shark-tank", "/software/projects/sharktank/"],
  ["/work/shark-tank/", "/software/projects/sharktank/"],
  ["/work/sharktank", "/software/projects/sharktank/"],
  ["/work/sharktank/", "/software/projects/sharktank/"],
  ["/projects/shark-tank", "/software/projects/sharktank/"],
  ["/projects/shark-tank/", "/software/projects/sharktank/"],
  ["/work/yarreader", "/software/projects/yarreader/"],
  ["/work/yarreader/", "/software/projects/yarreader/"]
]);

const retiredOutputs = [
  "work/index.html",
  "resume/index.html",
  "professional/index.html",
  "projects/index.html",
  "projects/sharktank/index.html",
  "projects/sharktank/case-study/index.html",
  "projects/hexframe/index.html",
  "projects/hexframe/case-study/index.html",
  "projects/yarreader/index.html",
  "projects/yarreader/case-study/index.html",
  "projects/shark-tank/index.html",
  "services/index.html",
  "services/example/index.html",
  "contact/index.html"
];

function assetEnv(status = 200) {
  const calls = [];
  return {
    calls,
    env: {
      ASSETS: {
        fetch: async (request) => {
          calls.push(request);
          return new Response(status === 404 ? "not found" : "asset", { status });
        }
      }
    }
  };
}

test("WG-048 compatibility routes point directly to their final canonical destinations", () => {
  for (const [source, destination] of wg048Compatibility) {
    assert.equal(PERMANENT_REDIRECTS.get(source), destination, `${source} has the wrong compatibility destination`);
    assert.equal(PERMANENT_REDIRECTS.has(destination), false, `${source} would create a redirect chain through ${destination}`);
  }
});

test("WG-048 compatibility redirects preserve queries and terminate in one hop", async (t) => {
  for (const [source, destination] of [
    ["/projects/", "/software/projects/"],
    ["/work/", "/about/team/jacob/"],
    ["/professional", "/about/team/jacob/"],
    ["/resume", "/about/team/jacob/"],
    ["/services/", "/solutions/websites/"]
  ]) {
    await t.test(source, async () => {
      const response = await worker.fetch(new Request(`${SITE}${source}?ref=wg057`), assetEnv().env);
      assert.equal(response.status, 308);
      assert.equal(response.headers.get("location"), `${SITE}${destination}?ref=wg057`);
    });
  }
});

test("compatibility graph has no loops", () => {
  for (const source of wg048Compatibility.keys()) {
    const visited = new Set([source]);
    let current = source;
    while (PERMANENT_REDIRECTS.has(current)) {
      const next = PERMANENT_REDIRECTS.get(current);
      if (!next?.startsWith("/")) break;
      assert.equal(visited.has(next), false, `redirect loop detected from ${source} through ${next}`);
      visited.add(next);
      current = next;
    }
  }
});

test("retired portfolio-era pages do not generate canonical HTML or sitemap entries", async () => {
  const canonicalRoutes = new Set([...CANONICAL_PAGES.values()].filter(Boolean));
  for (const output of retiredOutputs) {
    assert.equal(await exists(resolve(dist, output)), false, `retired output still generated: ${output}`);
  }

  for (const source of wg048Compatibility.keys()) {
    assert.equal(canonicalRoutes.has(source), false, `compatibility route is still canonical: ${source}`);
    assert.equal(SITEMAP_ROUTES.includes(source), false, `compatibility route is still in sitemap contract: ${source}`);
  }

  for (const contact of ["/contact", "/contact/"]) {
    assert.equal(PERMANENT_REDIRECTS.has(contact), false, `${contact} must not become a compatibility alias`);
    assert.equal(canonicalRoutes.has(contact), false, `${contact} must not become canonical`);
    assert.equal(SITEMAP_ROUTES.includes(contact), false, `${contact} must not enter the sitemap`);
  }
});

test("canonical UI links directly to canonical or external destinations", async () => {
  for (const [relative, route] of CANONICAL_PAGES) {
    if (!route) continue;
    const html = await readDist(relative);
    for (const anchor of anchors(html)) {
      if (!anchor.href.startsWith("/")) continue;
      const pathname = new URL(anchor.href, SITE).pathname;
      assert.equal(PERMANENT_REDIRECTS.has(pathname), false, `${relative} links through compatibility route ${anchor.href}`);
    }
  }
});

test("Contact remains discoverable without a standalone Contact route", async () => {
  const { calls, env } = assetEnv(404);
  const response = await worker.fetch(new Request(`${SITE}/contact/?source=wg057`), env);
  assert.equal(response.status, 404);
  assert.equal(calls.length, 1, "ordinary /contact/ must fall through to the normal static not-found authority");

  const home = await readDist("index.html");
  assert.ok(anchors(home).some((anchor) => anchor.href === "mailto:jacob@wizardgang.ai"), "contact email must remain discoverable");
});
