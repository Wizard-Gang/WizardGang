const SHARK_ORIGIN = "https://sharktank.wizardgang.ai";
const GITHUB_ORG = "https://github.com/Wizard-Gang";

export const PERMANENT_REDIRECTS = new Map([
  ["/github", GITHUB_ORG],
  ["/github/", GITHUB_ORG],
  ["/resume", "/work/"],
  ["/resume/", "/work/"],
  ["/professional", "/work/"],
  ["/professional/", "/work/"],
  ["/accessibility", "/compliance/"],
  ["/accessibility/", "/compliance/"],
  ["/security", "/compliance/"],
  ["/security/", "/compliance/"],
  ["/services/example", "https://yourwebsite.wizardgang.ai/"],
  ["/services/example/", "https://yourwebsite.wizardgang.ai/"],
  ["/work/shadowmoney", "/projects/hexframe/"],
  ["/work/shadowmoney/", "/projects/hexframe/"],
  ["/work/hexframe", "/projects/hexframe/"],
  ["/work/hexframe/", "/projects/hexframe/"],
  ["/work/shark-tank", "/projects/sharktank/"],
  ["/work/shark-tank/", "/projects/sharktank/"],
  ["/work/sharktank", "/projects/sharktank/"],
  ["/work/sharktank/", "/projects/sharktank/"],
  ["/projects/shark-tank", "/projects/sharktank/"],
  ["/projects/shark-tank/", "/projects/sharktank/"],
  ["/work/yarreader", "/projects/yarreader/"],
  ["/work/yarreader/", "/projects/yarreader/"]
]);

const SECURITY_HEADERS = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()"
};

const MACHINE_PATHS = new Set([
  "/openapi.json",
  "/status.json",
  "/roadmap.json",
  "/incidents.json",
  "/spend.json",
  "/inquiry.json",
  "/logs.json",
  "/audit/manifest.json",
  "/policies.json"
]);

const HUMAN_EXACT = new Map([
  ["/play", "/play/"],
  ["/play/", "/play/"],
  ["/ts", "/ts/"],
  ["/ts/", "/ts/"],
  ["/php", "/php/"],
  ["/php/", "/php/"],
  ["/docs", "/docs/"],
  ["/docs/", "/docs/"],
  ["/trust", "/trust/"],
  ["/trust/", "/trust/"],
  ["/status", "/status/"],
  ["/status/", "/status/"],
  ["/roadmap", "/status/#delivery"],
  ["/roadmap/", "/status/#delivery"],
  ["/incidents", "/status/#incidents"],
  ["/incidents/", "/status/#incidents"],
  ["/inquiry", "/spend/"],
  ["/inquiry/", "/spend/"],
  ["/spend", "/spend/"],
  ["/spend/", "/spend/"],
  ["/logs", "/logs/"],
  ["/logs/", "/logs/"],
  ["/audit", "/audit/"],
  ["/audit/", "/audit/"],
  ["/policies", "/policies/"],
  ["/policies/", "/policies/"]
]);

function redirect(target) {
  return new Response(null, {
    status: 308,
    headers: { location: target, "cache-control": "public, max-age=3600", ...SECURITY_HEADERS }
  });
}

function isProtectedLegacy(path) {
  return path === "/admin" || path.startsWith("/admin/") ||
    path === "/audit.json" || path === "/audit.jsonl" ||
    path === "/audit/status.json" || path.startsWith("/audit/game/") ||
    path.startsWith("/audit/replay/");
}

function isMachineRoute(path) {
  return path === "/api" || path.startsWith("/api/") ||
    path.startsWith("/room/") || path === "/php-room" ||
    path === "/php-api" || path.startsWith("/php-api/") ||
    path.startsWith("/docs/openapi.json") || MACHINE_PATHS.has(path) ||
    /^\/logs\/game\/[^/]+\.txt$/.test(path);
}

async function proxyToSharkTank(request, url) {
  const target = new URL(url.pathname + url.search, SHARK_ORIGIN);
  const headers = new Headers(request.headers);
  const origin = headers.get("origin");
  if (origin === url.origin) headers.set("origin", SHARK_ORIGIN);
  headers.set("x-wizardgang-migration-proxy", "1");
  return fetch(new Request(target, { method: request.method, headers, body: request.body, redirect: "manual" }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (PERMANENT_REDIRECTS.has(path)) {
      const destination = PERMANENT_REDIRECTS.get(path);
      if (destination.startsWith("https://")) return redirect(destination);
      const target = new URL(destination, url.origin);
      target.search = url.search;
      return redirect(target.toString());
    }
    if (/^\/(?:arena|uno|x4|21|game|checkers|battleship|3d|shark-?run)(?:\/.*)?$/i.test(path)) {
      return redirect(`${url.origin}/`);
    }
    if (isProtectedLegacy(path)) return redirect(`${SHARK_ORIGIN}${path}${url.search}`);
    if (isMachineRoute(path)) return proxyToSharkTank(request, url);
    if (HUMAN_EXACT.has(path)) return redirect(`${SHARK_ORIGIN}${HUMAN_EXACT.get(path)}${url.search}`);
    if (path.startsWith("/policies/")) return redirect(`${SHARK_ORIGIN}${path}${url.search}`);

    return env.ASSETS.fetch(request);
  }
};
