import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const workflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");

function jobBlock(jobName) {
  const start = new RegExp(`^  ${jobName}:\\s*$`, "m").exec(workflow);
  if (!start) return "";
  const after = workflow.slice(start.index + start[0].length);
  const next = /^  [A-Za-z0-9_-]+:\s*$/m.exec(after);
  return next ? after.slice(0, next.index) : after;
}

test("arbitrary production checkout deployment is removed while staging and dry runs remain", () => {
  assert.equal(packageJson.scripts["deploy:production"], undefined);
  assert.equal(packageJson.scripts["deploy:staging"], "npm run build && wrangler deploy --env staging");
  assert.match(packageJson.scripts["deploy:staging:dry-run"], /wrangler deploy --dry-run --env staging/);
  assert.match(packageJson.scripts["deploy:production:dry-run"], /wrangler deploy --dry-run --env production/);
});

test("production deployment depends on successful release publication and exact released state", () => {
  const release = jobBlock("release");
  const deploy = jobBlock("deploy-production");
  assert.ok(release, "CI must define release publication");
  assert.ok(deploy, "CI must define production deployment");
  assert.match(deploy, /^    needs: \[release-tag, release\]$/m);
  assert.match(deploy, /needs\.release-tag\.outputs\.tag != ''/);
  assert.match(deploy, /^    environment: production$/m);
  assert.match(deploy, /^    concurrency:\n      group: wizardgang-production\n      cancel-in-progress: false$/m);
  assert.match(deploy, /ref: \$\{\{ needs\.release-tag\.outputs\.tag \}\}/);
  assert.match(deploy, /fetch-depth: 0/);
  assert.match(deploy, /npm ci/);
  assert.match(deploy, /npm run check/);
  assert.match(deploy, /npm run verify:release-identity -- "\$RELEASE_TAG"/);
  assert.match(deploy, /GH_TOKEN: \$\{\{ github\.token \}\}/);
  assert.match(deploy, /CLOUDFLARE_API_TOKEN: \$\{\{ secrets\.CLOUDFLARE_API_TOKEN \}\}/);
  assert.doesNotMatch(release, /wrangler deploy|deploy-production/);
});

test("published release verification precedes the only production Wrangler publish", () => {
  const deploy = jobBlock("deploy-production");
  const tag = deploy.indexOf('gh release view "$RELEASE_TAG" --json tagName');
  const draft = deploy.indexOf('gh release view "$RELEASE_TAG" --json isDraft');
  const prerelease = deploy.indexOf('gh release view "$RELEASE_TAG" --json isPrerelease');
  const wrangler = deploy.indexOf("./node_modules/.bin/wrangler deploy --env production");
  assert.ok(tag >= 0, "deployment must verify the published release tag");
  assert.ok(draft > tag, "deployment must reject draft Releases");
  assert.ok(prerelease > draft, "deployment must reject prerelease Releases");
  assert.ok(wrangler > prerelease, "production publish must follow provider Release verification");
  assert.equal((workflow.match(/wrangler deploy --env production/g) || []).length, 1, "canonical workflow must have one production publish path");
  assert.match(deploy, /test -n "\$CLOUDFLARE_API_TOKEN"/);
});
