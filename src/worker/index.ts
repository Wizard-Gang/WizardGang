const SHARK_ORIGIN = "https://sharktank.wizardgang.ai";
const GITHUB_ORG = "https://github.com/Wizard-Gang";
const DEMO_ORIGIN = "https://demo.wizardgang.ai";

type Path = `/${string}`;
type HttpsUrl = `https://${string}`;

type ExternalPermanentRedirect = {
  kind: "external";
  source: Path;
  destination: HttpsUrl;
};

type PermanentRedirectRoute = ExternalPermanentRedirect;

type HumanCompatibilityRoute = {
  source: Path;
  destination: Path;
};

export interface AssetBinding {
  fetch(request: Request): Promise<Response>;
}

export interface WorkerEnv {
  ASSETS: AssetBinding;
}

type WorkerModule = {
  fetch(request: Request, env: WorkerEnv): Promise<Response>;
};

/* Outward shortcuts only. These were never pages on this site — they are handy
   aliases for surfaces that live elsewhere, so they keep resolving.
   Compatibility redirects for routes this site used to serve have been removed:
   those paths are dead and return the ordinary 404. */
const PERMANENT_REDIRECT_ROUTES = [
  { kind: "external", source: "/github", destination: GITHUB_ORG },
  { kind: "external", source: "/github/", destination: GITHUB_ORG },
  { kind: "external", source: "/compliance", destination: `${DEMO_ORIGIN}/assurance` },
  { kind: "external", source: "/compliance/", destination: `${DEMO_ORIGIN}/assurance` },
  { kind: "external", source: "/accessibility", destination: `${DEMO_ORIGIN}/assurance` },
  { kind: "external", source: "/accessibility/", destination: `${DEMO_ORIGIN}/assurance` },
  { kind: "external", source: "/security", destination: `${DEMO_ORIGIN}/security` },
  { kind: "external", source: "/security/", destination: `${DEMO_ORIGIN}/security` }
] as const satisfies readonly PermanentRedirectRoute[];

export const PERMANENT_REDIRECTS = new Map<string, string>(
  PERMANENT_REDIRECT_ROUTES.map(({ source, destination }) => [source, destination] as const)
);

const SECURITY_HEADERS = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()"
} as const;

const MACHINE_PATHS = new Set<string>([
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

const HUMAN_COMPATIBILITY_ROUTES = [
  { source: "/play", destination: "/play/" },
  { source: "/play/", destination: "/play/" },
  { source: "/ts", destination: "/ts/" },
  { source: "/ts/", destination: "/ts/" },
  { source: "/php", destination: "/php/" },
  { source: "/php/", destination: "/php/" },
  { source: "/docs", destination: "/docs/" },
  { source: "/docs/", destination: "/docs/" },
  { source: "/trust", destination: "/trust/" },
  { source: "/trust/", destination: "/trust/" },
  { source: "/status", destination: "/status/" },
  { source: "/status/", destination: "/status/" },
  { source: "/roadmap", destination: "/status/#delivery" },
  { source: "/roadmap/", destination: "/status/#delivery" },
  { source: "/incidents", destination: "/status/#incidents" },
  { source: "/incidents/", destination: "/status/#incidents" },
  { source: "/inquiry", destination: "/spend/" },
  { source: "/inquiry/", destination: "/spend/" },
  { source: "/spend", destination: "/spend/" },
  { source: "/spend/", destination: "/spend/" },
  { source: "/logs", destination: "/logs/" },
  { source: "/logs/", destination: "/logs/" },
  { source: "/audit", destination: "/audit/" },
  { source: "/audit/", destination: "/audit/" },
  { source: "/policies", destination: "/policies/" },
  { source: "/policies/", destination: "/policies/" }
] as const satisfies readonly HumanCompatibilityRoute[];

const HUMAN_EXACT = new Map<string, Path>(
  HUMAN_COMPATIBILITY_ROUTES.map(({ source, destination }) => [source, destination] as const)
);

function permanentRedirectFor(path: string): PermanentRedirectRoute | undefined {
  return PERMANENT_REDIRECT_ROUTES.find((route) => route.source === path);
}

function redirect(target: string): Response {
  return new Response(null, {
    status: 308,
    headers: { location: target, "cache-control": "public, max-age=3600", ...SECURITY_HEADERS }
  });
}

function isProtectedLegacy(path: string): boolean {
  return path === "/admin" || path.startsWith("/admin/") ||
    path === "/audit.json" || path === "/audit.jsonl" ||
    path === "/audit/status.json" || path.startsWith("/audit/game/") ||
    path.startsWith("/audit/replay/");
}

function isMachineRoute(path: string): boolean {
  return path === "/api" || path.startsWith("/api/") ||
    path.startsWith("/room/") || path === "/php-room" ||
    path === "/php-api" || path.startsWith("/php-api/") ||
    path.startsWith("/docs/openapi.json") || MACHINE_PATHS.has(path) ||
    /^\/logs\/game\/[^/]+\.txt$/.test(path);
}

async function proxyToSharkTank(request: Request, url: URL): Promise<Response> {
  const target = new URL(url.pathname + url.search, SHARK_ORIGIN);
  const headers = new Headers(request.headers);
  const origin = headers.get("origin");
  if (origin === url.origin) headers.set("origin", SHARK_ORIGIN);
  headers.set("x-wizardgang-migration-proxy", "1");

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers,
    redirect: "manual"
  };
  if (request.body !== null) {
    init.body = request.body;
    init.duplex = "half";
  }

  return fetch(new Request(target, init));
}

const worker = {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const permanentRoute = permanentRedirectFor(path);
    if (permanentRoute) return redirect(permanentRoute.destination);

    if (isProtectedLegacy(path)) return redirect(`${SHARK_ORIGIN}${path}${url.search}`);
    if (isMachineRoute(path)) return proxyToSharkTank(request, url);

    const humanDestination = HUMAN_EXACT.get(path);
    if (humanDestination) return redirect(`${SHARK_ORIGIN}${humanDestination}${url.search}`);
    if (path.startsWith("/policies/")) return redirect(`${SHARK_ORIGIN}${path}${url.search}`);

    return env.ASSETS.fetch(request);
  }
} satisfies WorkerModule;

export default worker;
