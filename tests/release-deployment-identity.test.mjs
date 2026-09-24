import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  extractDeployedVersionId,
  fetchPublicReleaseIdentity,
  verifyPublicReleaseIdentity,
  verifyServingDeployment,
} from "../scripts/production-deployment-identity.mjs";

const workflow = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
const versionId = "12345678-1234-1234-1234-1234567890ab";
const otherVersionId = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

function jobBlock(jobName) {
  const start = new RegExp(`^  ${jobName}:\\s*$`, "m").exec(workflow);
  if (!start) return "";
  const after = workflow.slice(start.index + start[0].length);
  const next = /^  [A-Za-z0-9_-]+:\s*$/m.exec(after);
  return next ? after.slice(0, next.index) : after;
}

test("structured Wrangler deploy output yields the exact Worker Version ID", () => {
  const output = [
    JSON.stringify({ type: "wrangler-session", version: 1 }),
    JSON.stringify({ type: "deploy", version: 1, worker_name: "wizardgang-portfolio", version_id: versionId }),
  ].join("\n");

  assert.equal(extractDeployedVersionId(output), versionId);
  assert.throws(
    () => extractDeployedVersionId(JSON.stringify({ type: "deploy", version_id: "not-a-version" })),
    /Version ID/,
  );
  assert.throws(() => extractDeployedVersionId(""), /Version ID/);
});

test("provider evidence requires the newest deployment to serve only the captured version at 100 percent", () => {
  const deployments = [
    { id: "older", created_on: "2026-09-20T00:00:00Z", versions: [{ version_id: otherVersionId, percentage: 100 }] },
    { id: "current", created_on: "2026-09-24T00:00:00Z", versions: [{ version_id: versionId, percentage: 100 }] },
  ];
  assert.equal(verifyServingDeployment(deployments, versionId).id, "current");

  assert.throws(
    () => verifyServingDeployment([{ id: "wrong", versions: [{ version_id: otherVersionId, percentage: 100 }] }], versionId),
    /expected/,
  );
  assert.throws(
    () => verifyServingDeployment([{ id: "split", versions: [
      { version_id: versionId, percentage: 50 },
      { version_id: otherVersionId, percentage: 50 },
    ] }], versionId),
    /exactly one version/,
  );
});

test("public identity fails closed on the wrong release or commit", () => {
  const expected = { release: "v1.1.0", commit: "0123456789abcdef0123456789abcdef01234567" };
  const payload = { product: "WizardGang", ...expected, builtAt: "2026-09-24T00:00:00.000Z" };
  assert.equal(verifyPublicReleaseIdentity(payload, expected), payload);
  assert.throws(() => verifyPublicReleaseIdentity({ ...payload, release: "v1.0.0" }, expected), /does not match/);
  assert.throws(() => verifyPublicReleaseIdentity({ ...payload, commit: "wrong" }, expected), /does not match/);
});

test("public verification retries stale edge identity before accepting the exact release", async () => {
  const expected = { release: "v1.1.0", commit: "0123456789abcdef0123456789abcdef01234567" };
  let calls = 0;
  const fetchImpl = async () => ({
    ok: true,
    status: 200,
    text: async () => JSON.stringify(calls++ === 0
      ? { release: "v1.0.0", commit: "old" }
      : expected),
  });

  const payload = await fetchPublicReleaseIdentity({
    url: "https://wizardgang.ai/version.json",
    ...expected,
    fetchImpl,
    attempts: 2,
    retryDelayMs: 0,
    sleep: async () => {},
  });
  assert.equal(calls, 2);
  assert.equal(payload.release, expected.release);
});

test("canonical release publication precedes deployment, provider confirmation, and public identity", () => {
  const release = jobBlock("release");
  const deploy = jobBlock("deploy-production");
  assert.ok(release);
  assert.ok(deploy);
  assert.match(deploy, /^    needs: \[release-tag, release\]$/m);

  const providerRelease = deploy.indexOf("Verify published GitHub Release");
  const publish = deploy.indexOf("./node_modules/.bin/wrangler deploy --env production");
  const provider = deploy.indexOf("production-deployment-identity.mjs provider");
  const publicIdentity = deploy.indexOf("production-deployment-identity.mjs public");

  assert.ok(providerRelease >= 0);
  assert.ok(publish > providerRelease);
  assert.ok(provider > publish);
  assert.ok(publicIdentity > provider);
  assert.match(deploy, /WRANGLER_OUTPUT_FILE:/);
  assert.match(deploy, /wrangler deployments list --env production --json/);
  assert.match(deploy, /EXPECTED_VERSION_ID: \$\{\{ steps\.deploy\.outputs\.version_id \}\}/);
  assert.match(deploy, /EXPECTED_RELEASE: \$\{\{ needs\.release-tag\.outputs\.tag \}\}/);
  assert.match(deploy, /EXPECTED_COMMIT: \$\{\{ github\.sha \}\}/);
  assert.match(release, /gh release create/);
  assert.doesNotMatch(release, /wrangler deploy/);
});
