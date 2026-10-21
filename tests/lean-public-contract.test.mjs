import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import { createSiteWorker } from "../src/worker/index.ts";
import { translateDynamic, translateText } from "../src/browser/translations.ts";
import {
  anchors, exists, generatedHtmlFiles, linkByRel, metaContent,
  readDist, readRoot, root, startTags, tagBlocks, textContent
} from "./helpers.mjs";

const ORIGIN = "https://wizardgang.ai";
const sections = ["services", "integrations", "about"];
const labels = ["Services", "Integrations", "About"];
const retired = ["/solutions/", "/projects/", "/projects/hexframe/", "/about/",
  "/work/", "/services/", "/contact/", "/resume", "/professional"];

test("WG-141: one static root contains all three ordered, labelled fragments", async () => {
  assert.deepEqual(await generatedHtmlFiles(), ["404.html", "index.html"]);
  const html = await readDist("index.html");
  const main = tagBlocks(html, "main")[0];
  assert.ok(main);
  assert.equal(main.attrs.get("id"), "main");
  assert.equal(tagBlocks(main.inner, "h1").length, 1);
  const named = startTags(main.inner, "section").map((tag) => tag.attrs.get("id")).filter((id) => sections.includes(id));
  assert.deepEqual(named, sections);
  for (const id of sections) {
    const section = tagBlocks(main.inner, "section").find((tag) => tag.attrs.get("id") === id);
    assert.ok(section);
    assert.equal(section.attrs.get("aria-labelledby"), id + "-heading");
    assert.equal(startTags(section.inner, "h2").length, 1);
  }
  assert.ok(anchors(main.inner).some((a) => a.href === "#integrations"));
});

test("WG-144: precise historical integration inventory without case narratives or email", async () => {
  const content = tagBlocks(await readDist("index.html"), "main")[0].inner;
  const visible = textContent(content);
  const expected = [["ERP & WMS",["NetSuite","Microsoft Dynamics","Sage","Fishbowl","QuickBooks POS","RedPrairie","Blue Yonder","CIMS WMS","Canbar"]],["Commerce & fulfillment",["Shopify","Amazon Direct Fulfillment","ShipStation","Shipium","ProShip"]],["Warehouse automation",["A360","Locus","6 River Systems","AutoStore","Corvus","Pendant"]],["Carriers",["USPS","UPS","FedEx"]],["EDI & B2B",["EDI Orders","Acknowledgements","ASNs","Invoices","Inventory & Fulfillment Flows"]],["Warehouse hardware",["Zebra","Honeywell"]],["Development & workflow",["GitHub","Jira","Zapier"]],["Justice & legal",["Axon","LexisNexis"]]];
  const rows = tagBlocks(content, "li").filter(item => item.attrs.get("class") === "integration-row");
  assert.equal(rows.length, expected.length, "one compact row per historical category");
  expected.forEach(([category, platforms], index) => {
    const item = rows[index].inner;
    assert.equal(textContent(tagBlocks(item, "h3")[0].inner), category);
    const labels = textContent(tagBlocks(item, "p")[0].inner);
    assert.equal(labels, platforms.join(" · "), "only historical brands and systems");
    assert.equal(anchors(item).length, 0, "no vendor marketing-link wall");
  });
  assert.ok(visible.includes("These integrations come from prior professional roles, not WizardGang client engagements."));
  for (const unsupported of [
    "Shipping compliance & dock routing", "Enterprise ERP and WMS cutovers",
    "Carrier and fulfillment integrations", "Inventory and financial reconciliation",
    "Regulated case management and reporting", "more than $10 million",
    "Hexframe", "SharkTank", "YarReader"
  ]) assert.ok(!visible.includes(unsupported), "unsupported narrative: " + unsupported);
  assert.equal(startTags(content, "section").filter(section => section.attrs.get("id") === "contact").length, 0);
  for (const path of await generatedHtmlFiles()) {
    assert.equal(anchors(await readDist(path)).filter(a => a.href.startsWith("mailto:")).length, 0);
  }
});

test("WG-137: desktop and no-JS mobile navigation, skip, focus, and reduced motion", async () => {
  const css = await readRoot("src/styles/globals.css");
  for (const path of await generatedHtmlFiles()) {
    const html = await readDist(path);
    const navs = tagBlocks(html, "nav");
    for (const name of ["Primary", "Primary mobile"]) {
      const nav = navs.find((item) => item.attrs.get("aria-label") === name);
      assert.ok(nav, path + ": missing " + name);
      assert.deepEqual(anchors(nav.inner).map((a) => [textContent(a.inner), a.href]),
        sections.map((id, index) => [labels[index], "/#" + id]));
    }
    const mobile = navs.find((item) => item.attrs.get("id") === "primary-mobile-navigation");
    assert.equal(mobile.attrs.has("hidden"), false, "no-JS links must be present");
    const toggle = tagBlocks(html, "button").find((item) => item.attrs.get("aria-controls") === "primary-mobile-navigation");
    assert.ok(toggle);
    assert.equal(toggle.attrs.has("hidden"), true, "no-JS button is not operable");
    assert.equal(toggle.attrs.get("aria-expanded"), "false");
    assert.match(textContent(toggle.inner), /Menu/);
    assert.ok(anchors(html).some((a) => a.href === "#main" && textContent(a.inner) === "Skip to main content"));
    assert.match(html, /aria-label="Display and language preferences"/);
  }
  assert.match(css, /@media\s*\(min-width:\s*48rem\)/);
  assert.match(css, /\.site-nav-desktop\s*\{\s*display:\s*flex/);
  assert.match(css, /\.nav-disclosure\s+\.site-nav-mobile:not\(\[hidden\]\)\s*\{\s*display:\s*flex/);
  assert.match(css, /:where\(a, button, input, select, summary\):focus-visible\s*\{[^}]*outline:\s*2px solid var\(--focus\)/);
  assert.match(css, /\.skip-link:focus\s*\{\s*transform:\s*none/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test("WG-144: 200% text reflows integration rows and navigation", async () => {
  const css = await readRoot("src/styles/globals.css");
  assert.match(css, /html:has\(#text-size-200:checked\)\s*\{\s*font-size:\s*200%/);
  assert.match(css, /html:has\(#text-size-200:checked\)\s+\.integration-row\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /html:has\(#text-size-200:checked\)\s+\.site-nav-desktop\s*\{\s*display:\s*none/);
  assert.match(css, /html:has\(#text-size-200:checked\)\s+\.site-nav-mobile:not\(\[hidden\]\)\s*\{\s*display:\s*flex\s*!important/);
  assert.match(css, /\.site-main, \.site-header-bar, \.site-footer\s*\{[^}]*width:\s*min\(100%, var\(--shell\)\)/s);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /minmax\(0,\s*1fr\)/);
});

test("WG-137: Spanish has navigation, visible copy and assistive labels", async () => {
  for (const phrase of ["Services", "Integrations", "About",
    "System integration", "Warehouse automation", "Data & reporting", "Regulated applications",
    "ERP & WMS", "Commerce & fulfillment", "Carriers", "EDI & B2B",
    "These integrations come from prior professional roles, not WizardGang client engagements.",
    "Skip to main content", "Display and language preferences", "WizardGang home",
    "Primary", "Primary mobile", "Menu", "Build", "Not Found — WizardGang"]) {
    assert.notEqual(translateDynamic(phrase), phrase, "Spanish phrase missing: " + phrase);
  }
  assert.equal(translateText("  Services  ", "es"), "  Servicios  ");
  assert.equal(translateText("Services", "en"), "Services");
  const browser = await readRoot("src/browser/index.ts");
  assert.match(browser, /documentRoot\.documentElement\.lang\s*=\s*locale/);
  assert.match(browser, /documentRoot\.title\s*=\s*locale/);
});

test("WG-137: root-only sitemap and 404-page routing do not redirect retired URLs", async () => {
  const html = await readDist("index.html");
  const notFound = await readDist("404.html");
  assert.equal(linkByRel(html, "canonical")?.attrs.get("href"), ORIGIN + "/");
  assert.equal(metaContent(notFound, "name", "robots"), "noindex");
  assert.equal(linkByRel(notFound, "canonical"), null);
  const sitemap = await readDist("sitemap.xml");
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]), [ORIGIN + "/"]);
  const wrangler = await readRoot("wrangler.jsonc");
  assert.match(wrangler, /"run_worker_first":\s*true/);
  assert.match(wrangler, /"not_found_handling":\s*"404-page"/);
  assert.match(wrangler, /"html_handling":\s*"auto-trailing-slash"/);
  for (const path of retired) {
    const target = path.replace(/^\/|\/$/g, "");
    assert.equal(await exists(resolve(root, "dist", target, "index.html")), false, "retired page emitted: " + path);
  }
  const assetCalls = [];
  const worker = createSiteWorker(
    { version: "1.4.0", commit: "0123456789abcdef0123456789abcdef01234567" },
    { logSink: () => {} }
  );
  const env = { WG_APP: "wizardgang", ASSETS: { async fetch(request) {
    assetCalls.push(request);
    return new Response("not found", { status: 404, headers: { "content-type": "text/html" } });
  } } };
  for (const path of retired) {
    const result = await worker.fetch(new Request(ORIGIN + path, { headers: { accept: "text/html" } }), env, {});
    assert.equal(result.status, 404, "retired route changed: " + path);
    assert.equal(result.headers.get("location"), null);
  }
  assert.equal(assetCalls.length, retired.length, "retired routes must reach static assets");
});

test("WG-137: safe outbound inventory, metadata, CSP and wg-edge boundary", async () => {
  const outbound = new Set([
    "https://github.com/Wizard-Gang", "https://www.linkedin.com/in/jacob-yongue",

  ]);
  for (const path of await generatedHtmlFiles()) {
    const html = await readDist(path);
    for (const link of anchors(html)) {
      if (link.href.startsWith("https://")) {
        assert.ok(outbound.has(link.href), path + ": unknown external link " + link.href);
      } else if (link.href.startsWith("mailto:")) {
        assert.fail(path + ": unexpected mailto link " + link.href);
      } else {
        assert.ok(link.href.startsWith("/") || link.href === "#main" || link.href === "#integrations",
          path + ": unsafe link " + link.href);
        assert.ok(!link.href.startsWith("//"));
      }
    }
    assert.equal(startTags(html, "script").length, 1);
    assert.equal(startTags(html, "script")[0].attrs.get("type"), "module");
    assert.doesNotMatch(html, /\son[a-z]+\s*=/i);
  }
  const headers = await readRoot("public/_headers");
  assert.equal(await readDist("_headers"), headers);
  const csp = headers.match(/^  Content-Security-Policy: (.*)$/m)?.[1];
  assert.ok(csp);
  for (const directive of ["default-src 'none'", "script-src 'self' https://static.cloudflareinsights.com",
    "style-src 'self'", "font-src 'self'", "img-src 'self' data:",
    "object-src 'none'", "base-uri 'none'", "frame-ancestors 'none'",
    "form-action 'none'", "upgrade-insecure-requests"]) {
    assert.ok(csp.includes(directive), "missing CSP directive " + directive);
  }
  assert.doesNotMatch(csp, /'unsafe-inline'|'unsafe-eval'/);
  assert.match(headers, /Strict-Transport-Security:\s*max-age=31536000; includeSubDomains/);
  assert.match(headers, /X-Content-Type-Options:\s*nosniff/);
  assert.doesNotMatch(headers, /\/og-jacob-yongue\.jpg|\/hexframe-project\.jpg/);
  const source = await readRoot("src/worker/index.ts");
  assert.match(source, /createEdge<WorkerEnv>/);
  assert.match(source, /return env\.ASSETS\.fetch\(request\)/);
  for (const owned of ["version.json", "health.json", "robots.txt", "admin"]) {
    assert.equal(await exists(resolve(root, "dist", owned)), false, "wg-edge route shadowed: " + owned);
  }
});
