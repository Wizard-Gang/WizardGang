import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const docsRoot = resolve(root, "docs");

async function currentDocs() {
  const names = (await readdir(docsRoot)).filter((name) => name.endsWith(".md")).sort();
  return ["README.md", "SECURITY.md", ...names.map((name) => `docs/${name}`)];
}

async function source(path) {
  return readFile(resolve(root, path), "utf8");
}

test("current documentation corpus has one purpose per active document", async () => {
  assert.deepEqual(
    await currentDocs(),
    [
      "README.md",
      "SECURITY.md",
      "docs/ACCESSIBILITY.md",
      "docs/COMPLIANCE.md",
      "docs/INFORMATION-ARCHITECTURE.md",
      "docs/OWNERSHIP.md"
    ]
  );
  await assert.rejects(access(resolve(root, "docs/BOUNDARY-MIGRATION.md")), { code: "ENOENT" });
});

test("current docs do not restore migration-era frontend authorities or controlled-change planning", async () => {
  const forbidden = [
    "src/site.mjs",
    "src/projects.mjs",
    "src/professional.mjs",
    "src/professional-systems.mjs",
    "public/assets/site.js",
    "portfolio-cleanup.css",
    "Approved implementation sequence",
    "future-state information architecture"
  ];

  for (const path of await currentDocs()) {
    const text = await source(path);
    for (const value of forbidden) {
      assert.ok(!text.includes(value), `${path} contains retired current-state documentation reference: ${value}`);
    }
    assert.doesNotMatch(text, /\bWG-\d{3}\b/, `${path} must describe current state instead of controlled-change history`);
  }
});

test("README documents the current entry points and acceptance gate", async () => {
  const readme = await source("README.md");
  for (const value of [
    "company site for WizardGang",
    "npm ci",
    "npm run dev",
    "http://127.0.0.1:8790",
    "WIZARDGANG_PORT",
    "npm run build",
    "npm run check",
    "npm run test:company-ia",
    "npm run test:accessibility",
    "npm run test:frontend-authority",
    "npm run test:docs",
    "src/app/pageRegistry.ts",
    "src/app/navigation.ts",
    "src/worker/index.ts",
    "public/_headers",
    "dist/_headers"
  ]) assert.ok(readme.includes(value), `README is missing current contract: ${value}`);

  assert.doesNotMatch(readme, /canonical at \/(?:work|projects|services)\//, "README must not describe compatibility paths as canonical");
});

test("information architecture documents current company ownership and static-first constraints", async () => {
  const ia = await source("docs/INFORMATION-ARCHITECTURE.md");
  for (const value of [
    "Status: current-state authority",
    "/about/company/",
    "/about/team/jacob/",
    "/software/integrations/",
    "/software/projects/",
    "/solutions/websites/",
    "/solutions/demo-framework/",
    "demo.wizardgang.ai",
    "src/app/pageRegistry.ts",
    "src/app/navigation.ts",
    "There is no SPA router",
    "public/_headers",
    "npm run check"
  ]) assert.ok(ia.includes(value), `information architecture is missing current contract: ${value}`);

  assert.match(ia, /Supported compatibility behavior lives in `src\/worker\/index\.ts`/);
  assert.match(ia, /There is no canonical `\/contact\/` route/);
});

test("relative Markdown documentation links resolve", async () => {
  for (const path of await currentDocs()) {
    const text = await source(path);
    for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const raw = match[1].trim();
      if (!raw || /^(?:https?:|mailto:|#)/i.test(raw)) continue;
      const target = decodeURIComponent(raw.split("#", 1)[0]);
      if (!target) continue;
      const absolute = resolve(root, dirname(path), target);
      await assert.doesNotReject(access(absolute), `${path} links to missing documentation target ${raw}`);
    }
  }
});
