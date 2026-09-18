import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  DEFAULT_PORT,
  DEV_HOST,
  READINESS_TIMEOUT_MS,
  LOCAL_HEADERS_RELATIVE,
  RESET_TARGETS,
  RUNTIME_STATE_RELATIVE,
  buildWranglerArgs,
  ensurePortAvailable,
  isCheckoutRuntimeCommand,
  openBrowser,
  prepareLocalHeaders,
  readyThenOpen,
  removeRuntimeStateIfPid,
  resetDisposableState,
  sanitizeLocalHeadersText,
  resolvePort,
  teardownOwnedRuntime,
  waitForReadiness
} from "../scripts/dev.mjs";

async function tempCheckout() {
  const root = await mkdtemp(join(os.tmpdir(), "wizardgang-dev-test-"));
  const runtimeFile = resolve(root, RUNTIME_STATE_RELATIVE);
  await mkdir(resolve(root, "tmp/dev"), { recursive: true });
  return { root, runtimeFile, wranglerCli: resolve(root, "node_modules/wrangler/bin/wrangler.js") };
}

async function writeState(runtimeFile, state) {
  await writeFile(runtimeFile, `${JSON.stringify(state)}\n`);
}

test("port override is honored and defaults to the existing repository port", () => {
  assert.equal(resolvePort({}), DEFAULT_PORT);
  assert.equal(DEFAULT_PORT, 8790);
  assert.equal(resolvePort({ WIZARDGANG_PORT: "9123" }), 9123);
  assert.throws(() => resolvePort({ WIZARDGANG_PORT: "nope" }), /integer between 1 and 65535/);
});

test("Wrangler and the browser use the same explicit loopback host", () => {
  assert.equal(DEV_HOST, "127.0.0.1");
  assert.deepEqual(buildWranglerArgs("/repo/node_modules/wrangler/bin/wrangler.js", 8790), [
    "/repo/node_modules/wrangler/bin/wrangler.js", "dev", "--local", "--ip", "127.0.0.1", "--port", "8790"
  ]);
});

test("checkout-owned process identification requires both checkout and Wrangler path", async () => {
  const { root, wranglerCli } = await tempCheckout();
  assert.equal(isCheckoutRuntimeCommand(`${process.execPath} ${wranglerCli} dev --local --port 8790`, root, wranglerCli), true);
  assert.equal(isCheckoutRuntimeCommand(`${process.execPath} /other/repo/node_modules/wrangler/bin/wrangler.js dev`, root, wranglerCli), false);
});

test("unrelated processes are never killed even when stale metadata points at their PID", async () => {
  const { root, runtimeFile, wranglerCli } = await tempCheckout();
  await writeState(runtimeFile, { pid: 4242, checkoutRoot: root, wranglerCli, processGroup: true });
  let kills = 0;
  const result = await teardownOwnedRuntime({
    checkoutRoot: root,
    runtimeFile,
    wranglerCli,
    getProcessInfoFn: async () => ({ pid: 4242, ppid: 1, command: "/usr/bin/node /other/repo/server.js" }),
    killProcessTreeFn: async () => { kills += 1; }
  });
  assert.equal(kills, 0);
  assert.equal(result.stale, true);
  await assert.rejects(readFile(runtimeFile, "utf8"), { code: "ENOENT" });
});

test("stale checkout PID state is recovered when the process no longer exists", async () => {
  const { root, runtimeFile, wranglerCli } = await tempCheckout();
  await writeState(runtimeFile, { pid: 5151, checkoutRoot: root, wranglerCli, processGroup: true });
  const result = await teardownOwnedRuntime({
    checkoutRoot: root,
    runtimeFile,
    wranglerCli,
    getProcessInfoFn: async () => null,
    killProcessTreeFn: async () => assert.fail("stale PID must not be killed")
  });
  assert.equal(result.stale, true);
  await assert.rejects(readFile(runtimeFile, "utf8"), { code: "ENOENT" });
});

test("checkout-owned runtime is terminated through the injected process-tree seam", async () => {
  const { root, runtimeFile, wranglerCli } = await tempCheckout();
  await writeState(runtimeFile, { pid: 6161, checkoutRoot: root, wranglerCli, processGroup: true });
  const calls = [];
  const result = await teardownOwnedRuntime({
    checkoutRoot: root,
    runtimeFile,
    wranglerCli,
    getProcessInfoFn: async () => ({ pid: 6161, ppid: 1, command: `${process.execPath} ${wranglerCli} dev --local` }),
    killProcessTreeFn: async (pid, options) => calls.push({ pid, options })
  });
  assert.equal(result.terminated, true);
  assert.deepEqual(calls, [{ pid: 6161, options: { processGroup: true } }]);
});

test("occupied unrelated ports fail safely without killing the owner", async () => {
  const { root, wranglerCli } = await tempCheckout();
  let kills = 0;
  await assert.rejects(
    ensurePortAvailable({
      port: 8790,
      checkoutRoot: root,
      wranglerCli,
      isPortAvailableFn: async () => false,
      findPortOwnerFn: async () => ({ pid: 7171, command: "/usr/bin/python3 unrelated.py" }),
      killProcessTreeFn: async () => { kills += 1; }
    }),
    /Port 8790 is already in use by PID 7171.*Refusing to terminate an unrelated process/
  );
  assert.equal(kills, 0);
});


test("checkout-owned process occupying the requested port is terminated and the port is rechecked", async () => {
  const { root, wranglerCli } = await tempCheckout();
  let checks = 0;
  const kills = [];
  await ensurePortAvailable({
    port: 8790,
    checkoutRoot: root,
    wranglerCli,
    isPortAvailableFn: async () => { checks += 1; return checks > 1; },
    findPortOwnerFn: async () => ({ pid: 8181, command: `${process.execPath} ${wranglerCli} dev --local --port 8790` }),
    killProcessTreeFn: async (pid, options) => kills.push({ pid, options })
  });
  assert.equal(checks, 2);
  assert.deepEqual(kills, [{ pid: 8181, options: { processGroup: false } }]);
});

test("readiness timeout is bounded", async () => {
  let clock = 0;
  let attempts = 0;
  const timeoutMs = 25;
  await assert.rejects(
    waitForReadiness("http://localhost:8790", {
      timeoutMs,
      intervalMs: 10,
      now: () => clock,
      sleep: async (ms) => { clock += ms; },
      fetchImpl: async () => { attempts += 1; return new Response("starting", { status: 503 }); }
    }),
    /Timed out after 25ms/
  );
  assert.ok(attempts >= 2);
  assert.ok(clock <= timeoutMs);
  assert.equal(READINESS_TIMEOUT_MS, 20_000);
});

test("browser opener waits for the OS command result and reports failure", async () => {
  const calls = [];
  const successfulSpawn = (command, args, options) => {
    const child = new EventEmitter();
    calls.push({ command, args, options });
    queueMicrotask(() => child.emit("exit", 0, null));
    return child;
  };
  await openBrowser("http://127.0.0.1:8790", { platform: "darwin", spawnFn: successfulSpawn });
  assert.deepEqual(calls, [{ command: "open", args: ["http://127.0.0.1:8790"], options: { stdio: "ignore" } }]);

  const failingSpawn = () => {
    const child = new EventEmitter();
    queueMicrotask(() => child.emit("exit", 1, null));
    return child;
  };
  await assert.rejects(
    openBrowser("http://127.0.0.1:8790", { platform: "darwin", spawnFn: failingSpawn }),
    /Browser opener exited with status 1.*Open http:\/\/127\.0\.0\.1:8790 manually/
  );
});

test("browser opening occurs only after readiness succeeds", async () => {
  const events = [];
  await readyThenOpen("http://localhost:8790", {
    waitForReadinessFn: async () => { events.push("ready"); },
    openBrowserFn: async () => { events.push("open"); }
  });
  assert.deepEqual(events, ["ready", "open"]);

  events.length = 0;
  await assert.rejects(
    readyThenOpen("http://localhost:8790", {
      waitForReadinessFn: async () => { events.push("timeout"); throw new Error("not ready"); },
      openBrowserFn: async () => { events.push("open"); }
    }),
    /not ready/
  );
  assert.deepEqual(events, ["timeout"]);
});


test("an older attached dev process cannot erase newer runtime metadata", async () => {
  const { root, runtimeFile, wranglerCli } = await tempCheckout();
  await writeState(runtimeFile, { pid: 9002, checkoutRoot: root, wranglerCli, processGroup: true });
  await removeRuntimeStateIfPid(runtimeFile, 9001);
  const state = JSON.parse(await readFile(runtimeFile, "utf8"));
  assert.equal(state.pid, 9002);
  await removeRuntimeStateIfPid(runtimeFile, 9002);
  await assert.rejects(readFile(runtimeFile, "utf8"), { code: "ENOENT" });
});


test("runtime metadata path is ignored by repository policy", async () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const ignore = await readFile(resolve(repoRoot, ".gitignore"), "utf8");
  assert.match(ignore, /^tmp\/$/m);
  assert.match(RUNTIME_STATE_RELATIVE, /^tmp\//);
});

test("local HTTP headers remove only HTTPS-only directives", () => {
  const source = `/*\n  Content-Security-Policy: default-src 'none'; style-src 'self'; upgrade-insecure-requests\n  Strict-Transport-Security: max-age=31536000; includeSubDomains\n  X-Frame-Options: DENY\n`;
  const sanitized = sanitizeLocalHeadersText(source);
  assert.doesNotMatch(sanitized, /Strict-Transport-Security/i);
  assert.doesNotMatch(sanitized, /upgrade-insecure-requests/i);
  assert.match(sanitized, /Content-Security-Policy: default-src 'none'; style-src 'self'/);
  assert.match(sanitized, /X-Frame-Options: DENY/);
});

test("local header preparation changes only dist and preserves production source headers", async () => {
  const { root } = await tempCheckout();
  const publicDir = resolve(root, "public");
  const distDir = resolve(root, "dist");
  await mkdir(publicDir, { recursive: true });
  await mkdir(distDir, { recursive: true });
  const productionHeaders = `/*\n  Content-Security-Policy: default-src 'none'; upgrade-insecure-requests\n  Strict-Transport-Security: max-age=31536000; includeSubDomains\n`;
  const sourceFile = resolve(publicDir, "_headers");
  const localFile = resolve(root, LOCAL_HEADERS_RELATIVE);
  await writeFile(sourceFile, productionHeaders);
  await writeFile(localFile, productionHeaders);

  assert.equal(await prepareLocalHeaders(root), true);
  assert.equal(await readFile(sourceFile, "utf8"), productionHeaders);
  const localHeaders = await readFile(localFile, "utf8");
  assert.doesNotMatch(localHeaders, /Strict-Transport-Security/i);
  assert.doesNotMatch(localHeaders, /upgrade-insecure-requests/i);
});

test("reset targets are explicitly bounded to generated output and dev runtime state", async () => {
  const { root } = await tempCheckout();
  const removed = [];
  await resetDisposableState(root, async (target, options) => removed.push({ target, options }));
  assert.deepEqual(RESET_TARGETS, ["dist", "tmp/dev"]);
  assert.deepEqual(removed.map(({ target }) => target), [resolve(root, "dist"), resolve(root, "tmp/dev")]);
  assert.ok(removed.every(({ target }) => target.startsWith(`${resolve(root)}/`) || process.platform === "win32"));
});
