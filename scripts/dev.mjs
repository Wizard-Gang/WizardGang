import { spawn, spawnSync, execFileSync } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import net from "node:net";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_PORT = 8790;
export const DEV_HOST = "127.0.0.1";
export const READINESS_TIMEOUT_MS = 20_000;
export const RUNTIME_STATE_RELATIVE = "tmp/dev/runtime.json";
export const RESET_TARGETS = Object.freeze(["dist", "tmp/dev"]);

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function normalizePath(value, platform = process.platform) {
  const normalized = String(value ?? "").replaceAll("\\", "/");
  return platform === "win32" ? normalized.toLowerCase() : normalized;
}

export function resolvePort(env = process.env) {
  const raw = env.WIZARDGANG_PORT;
  if (raw === undefined || raw === "") return DEFAULT_PORT;
  if (!/^\d+$/.test(raw)) throw new Error(`WIZARDGANG_PORT must be an integer between 1 and 65535; received ${JSON.stringify(raw)}.`);
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`WIZARDGANG_PORT must be an integer between 1 and 65535; received ${JSON.stringify(raw)}.`);
  }
  return port;
}

export function isCheckoutRuntimeCommand(command, checkoutRoot, wranglerCli, platform = process.platform) {
  const normalizedCommand = normalizePath(command, platform);
  const normalizedRoot = normalizePath(checkoutRoot, platform);
  const normalizedWrangler = normalizePath(wranglerCli, platform);
  if (!normalizedCommand || !normalizedRoot || !normalizedWrangler) return false;
  return normalizedCommand.includes(normalizedRoot) && normalizedCommand.includes(normalizedWrangler);
}

export async function readRuntimeState(runtimeFile) {
  try {
    const state = JSON.parse(await readFile(runtimeFile, "utf8"));
    if (!state || !Number.isInteger(state.pid) || state.pid <= 0) return null;
    return state;
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    return null;
  }
}

async function removeRuntimeState(runtimeFile) {
  await rm(runtimeFile, { force: true });
}

export async function removeRuntimeStateIfPid(runtimeFile, pid) {
  const current = await readRuntimeState(runtimeFile);
  if (!current || current.pid === pid) await removeRuntimeState(runtimeFile);
}

export function getProcessInfo(pid, platform = process.platform) {
  try {
    if (platform === "win32") {
      const script = [
        `$p = Get-CimInstance Win32_Process -Filter \"ProcessId = ${pid}\"`,
        "if ($null -eq $p) { exit 1 }",
        "$p | Select-Object ProcessId,ParentProcessId,CommandLine | ConvertTo-Json -Compress"
      ].join("; ");
      const parsed = JSON.parse(execFileSync("powershell.exe", ["-NoProfile", "-Command", script], { encoding: "utf8" }));
      return { pid: Number(parsed.ProcessId), ppid: Number(parsed.ParentProcessId), command: parsed.CommandLine ?? "" };
    }
    const output = execFileSync("ps", ["-p", String(pid), "-o", "pid=", "-o", "ppid=", "-o", "command="], { encoding: "utf8" }).trim();
    if (!output) return null;
    const match = output.match(/^\s*(\d+)\s+(\d+)\s+([\s\S]+)$/);
    return match ? { pid: Number(match[1]), ppid: Number(match[2]), command: match[3] } : null;
  } catch {
    return null;
  }
}

function processExists(pid) {
  try { process.kill(pid, 0); return true; } catch (error) { return error?.code === "EPERM"; }
}

async function sleep(ms) {
  await new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

export async function waitForProcessExit(pid, timeoutMs = 4_000, deps = {}) {
  const exists = deps.processExists ?? processExists;
  const sleepFn = deps.sleep ?? sleep;
  const started = Date.now();
  while (exists(pid)) {
    if (Date.now() - started >= timeoutMs) return false;
    await sleepFn(50);
  }
  return true;
}

export async function killProcessTree(pid, options = {}) {
  const platform = options.platform ?? process.platform;
  const processGroup = options.processGroup ?? false;
  if (platform === "win32") {
    const result = spawnSync("taskkill", ["/PID", String(pid), "/T"], { stdio: "ignore" });
    if (result.status !== 0 && processExists(pid)) throw new Error(`Could not terminate process tree ${pid}.`);
  } else {
    try { process.kill(processGroup ? -pid : pid, "SIGTERM"); }
    catch (error) { if (error?.code !== "ESRCH") throw error; }
  }

  if (await waitForProcessExit(pid, 4_000)) return;

  if (platform === "win32") {
    spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    try { process.kill(processGroup ? -pid : pid, "SIGKILL"); }
    catch (error) { if (error?.code !== "ESRCH") throw error; }
  }
  if (!await waitForProcessExit(pid, 1_000)) throw new Error(`Process ${pid} did not exit after termination.`);
}

export async function teardownOwnedRuntime({ checkoutRoot, runtimeFile, wranglerCli, getProcessInfoFn = getProcessInfo, killProcessTreeFn = killProcessTree, removeStateFn = removeRuntimeState }) {
  const state = await readRuntimeState(runtimeFile);
  if (!state) {
    await removeStateFn(runtimeFile);
    return { found: false, terminated: false, stale: false };
  }

  const info = await getProcessInfoFn(state.pid);
  const metadataMatches = normalizePath(state.checkoutRoot) === normalizePath(checkoutRoot)
    && normalizePath(state.wranglerCli) === normalizePath(wranglerCli);
  const owned = info && metadataMatches && isCheckoutRuntimeCommand(info.command, checkoutRoot, wranglerCli);

  if (!owned) {
    await removeStateFn(runtimeFile);
    return { found: true, terminated: false, stale: true };
  }

  await killProcessTreeFn(state.pid, { processGroup: Boolean(state.processGroup) });
  await removeStateFn(runtimeFile);
  return { found: true, terminated: true, stale: false };
}

export async function resetDisposableState(checkoutRoot, rmFn = rm) {
  const normalizedRoot = resolve(checkoutRoot);
  for (const relative of RESET_TARGETS) {
    const target = resolve(normalizedRoot, relative);
    if (target !== normalizedRoot && target.startsWith(`${normalizedRoot}${sep}`)) {
      await rmFn(target, { recursive: true, force: true });
      continue;
    }
    throw new Error(`Refusing to reset path outside checkout: ${target}`);
  }
}

export async function isPortAvailable(port, host = DEV_HOST) {
  return await new Promise((resolvePromise, reject) => {
    const server = net.createServer();
    server.unref();
    server.once("error", (error) => {
      if (error?.code === "EADDRINUSE" || error?.code === "EACCES") resolvePromise(false);
      else reject(error);
    });
    server.listen({ port, host, exclusive: true }, () => server.close(() => resolvePromise(true)));
  });
}

function posixPortPid(port) {
  try {
    const output = execFileSync("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN", "-t"], { encoding: "utf8" }).trim();
    const first = output.split(/\s+/).find(Boolean);
    return first ? Number(first) : null;
  } catch {
    return null;
  }
}

function windowsPortPid(port) {
  try {
    const script = `(Get-NetTCPConnection -State Listen -LocalPort ${port} | Select-Object -First 1 -ExpandProperty OwningProcess)`;
    const output = execFileSync("powershell.exe", ["-NoProfile", "-Command", script], { encoding: "utf8" }).trim();
    return output ? Number(output) : null;
  } catch {
    return null;
  }
}

export function findPortOwner(port, platform = process.platform, getProcessInfoFn = getProcessInfo) {
  const pid = platform === "win32" ? windowsPortPid(port) : posixPortPid(port);
  if (!pid) return null;
  return getProcessInfoFn(pid, platform) ?? { pid, ppid: null, command: "unknown command" };
}

export async function ensurePortAvailable({ port, checkoutRoot, wranglerCli, isPortAvailableFn = isPortAvailable, findPortOwnerFn = findPortOwner, killProcessTreeFn = killProcessTree }) {
  if (await isPortAvailableFn(port)) return;

  const owner = await findPortOwnerFn(port);
  if (owner && isCheckoutRuntimeCommand(owner.command, checkoutRoot, wranglerCli)) {
    await killProcessTreeFn(owner.pid, { processGroup: false });
    if (await isPortAvailableFn(port)) return;
    throw new Error(`Port ${port} is still occupied after terminating checkout-owned PID ${owner.pid}.`);
  }

  const detail = owner ? `PID ${owner.pid} (${owner.command || "unknown command"})` : "an unidentified process";
  throw new Error(`Port ${port} is already in use by ${detail}. Refusing to terminate an unrelated process. Stop it or set WIZARDGANG_PORT to another port.`);
}

async function fetchStatus(url, fetchImpl, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, { redirect: "manual", signal: controller.signal });
    try { await response.body?.cancel(); } catch { /* body already consumed/absent */ }
    return response.status;
  } finally {
    clearTimeout(timer);
  }
}

export async function waitForReadiness(url, options = {}) {
  const timeoutMs = options.timeoutMs ?? READINESS_TIMEOUT_MS;
  const intervalMs = options.intervalMs ?? 200;
  const fetchImpl = options.fetchImpl ?? fetch;
  const sleepFn = options.sleep ?? sleep;
  const now = options.now ?? Date.now;
  const started = now();
  let lastFailure = "no response";

  do {
    const elapsed = now() - started;
    const remaining = Math.max(1, timeoutMs - elapsed);
    try {
      const status = await fetchStatus(url, fetchImpl, Math.min(1_000, remaining));
      if (status >= 200 && status < 400) return status;
      lastFailure = `HTTP ${status}`;
    } catch (error) {
      lastFailure = error?.name === "AbortError" ? "request timed out" : (error?.message || String(error));
    }
    if (now() - started >= timeoutMs) break;
    await sleepFn(Math.min(intervalMs, Math.max(1, timeoutMs - (now() - started))));
  } while (now() - started < timeoutMs);

  throw new Error(`Timed out after ${timeoutMs}ms waiting for ${url} (${lastFailure}).`);
}

export async function openBrowser(url, options = {}) {
  const platform = options.platform ?? process.platform;
  const spawnFn = options.spawnFn ?? spawn;
  let command;
  let args;
  if (platform === "darwin") [command, args] = ["open", [url]];
  else if (platform === "win32") [command, args] = ["cmd.exe", ["/d", "/s", "/c", "start", "", url]];
  else [command, args] = ["xdg-open", [url]];

  await new Promise((resolvePromise, reject) => {
    const child = spawnFn(command, args, { stdio: "ignore" });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) return resolvePromise();
      reject(new Error(`Browser opener exited with status ${code ?? "unknown"}${signal ? ` (${signal})` : ""}. Open ${url} manually.`));
    });
  });
}

export async function readyThenOpen(url, options = {}) {
  const waitForReadinessFn = options.waitForReadinessFn ?? waitForReadiness;
  const openBrowserFn = options.openBrowserFn ?? openBrowser;
  const readinessOptions = options.readinessOptions ?? {};
  await waitForReadinessFn(url, readinessOptions);
  await openBrowserFn(url);
}

function runBuild(checkoutRoot) {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npm, ["run", "build"], { cwd: checkoutRoot, stdio: "inherit", env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`npm run build exited with status ${result.status}.`);
}

async function writeRuntimeState(runtimeFile, state) {
  await mkdir(dirname(runtimeFile), { recursive: true });
  await writeFile(runtimeFile, `${JSON.stringify(state, null, 2)}\n`, { flag: "w" });
}

export function buildWranglerArgs(wranglerCli, port) {
  return [wranglerCli, "dev", "--local", "--ip", DEV_HOST, "--port", String(port)];
}

function spawnWrangler(checkoutRoot, wranglerCli, port) {
  return spawn(process.execPath, buildWranglerArgs(wranglerCli, port), {
    cwd: checkoutRoot,
    env: process.env,
    stdio: "inherit",
    detached: process.platform !== "win32"
  });
}

async function main() {
  const checkoutRoot = root;
  const wranglerCli = resolve(checkoutRoot, "node_modules/wrangler/bin/wrangler.js");
  const runtimeFile = resolve(checkoutRoot, RUNTIME_STATE_RELATIVE);
  let runtime = null;
  let phase = "configuration";
  let stopping = false;

  const stopRuntime = async () => {
    if (!runtime?.pid || stopping) return;
    stopping = true;
    try { await killProcessTree(runtime.pid, { processGroup: process.platform !== "win32" }); }
    catch (error) { console.error(`[dev] cleanup warning: ${error.message}`); }
  };

  try {
    const port = resolvePort();
    const url = `http://${DEV_HOST}:${port}`;

    phase = "teardown";
    console.log("[dev] teardown");
    await teardownOwnedRuntime({ checkoutRoot, runtimeFile, wranglerCli });

    phase = "reset";
    console.log("[dev] reset");
    await resetDisposableState(checkoutRoot);

    phase = "build";
    console.log("[dev] build");
    runBuild(checkoutRoot);

    phase = "bootstrap";
    console.log("[dev] bootstrap");
    try { await access(wranglerCli); }
    catch { throw new Error("Local Wrangler is not installed. Run npm ci before npm run dev."); }

    phase = "port check";
    await ensurePortAvailable({ port, checkoutRoot, wranglerCli });

    phase = "start";
    console.log("[dev] start");
    runtime = spawnWrangler(checkoutRoot, wranglerCli, port);
    if (!runtime.pid) throw new Error("Wrangler did not start with a process ID.");
    await writeRuntimeState(runtimeFile, {
      pid: runtime.pid,
      checkoutRoot,
      wranglerCli,
      port,
      host: DEV_HOST,
      url,
      processGroup: process.platform !== "win32",
      startedAt: new Date().toISOString()
    });

    const onSignal = () => { void stopRuntime(); };
    process.once("SIGINT", onSignal);
    process.once("SIGTERM", onSignal);

    phase = "readiness";
    console.log(`[dev] waiting for ${url}`);
    await waitForReadiness(url);
    console.log("[dev] ready");

    phase = "browser";
    console.log("[dev] opening browser");
    await openBrowser(url);

    phase = "runtime";
    const exit = await new Promise((resolvePromise) => {
      runtime.once("error", (error) => resolvePromise({ error }));
      runtime.once("exit", (code, signal) => resolvePromise({ code, signal }));
    });
    process.removeListener("SIGINT", onSignal);
    process.removeListener("SIGTERM", onSignal);
    await removeRuntimeStateIfPid(runtimeFile, runtime.pid);

    if (exit.error) throw exit.error;
    if (!stopping && exit.code !== 0) throw new Error(`Wrangler exited with status ${exit.code ?? "unknown"}${exit.signal ? ` (${exit.signal})` : ""}.`);
  } catch (error) {
    await stopRuntime();
    if (runtime?.pid) await removeRuntimeStateIfPid(runtimeFile, runtime.pid);
    else await removeRuntimeState(runtimeFile);
    console.error(`[dev] ${phase} failed: ${error?.message || error}`);
    process.exitCode = 1;
  }
}

const isEntryPoint = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntryPoint) await main();
