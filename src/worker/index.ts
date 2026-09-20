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

type InternalPermanentRedirect = {
  kind: "internal";
  source: Path;
  destination: Path;
};

type PermanentRedirectRoute = ExternalPermanentRedirect | InternalPermanentRedirect;

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

const PERMANENT_REDIRECT_ROUTES = [
  { kind: "external", source: "/github", destination: GITHUB_ORG },
  { kind: "external", source: "/github/", destination: GITHUB_ORG },
  { kind: "internal", source: "/work", destination: "/about/team/jacob/" },
  { kind: "internal", source: "/work/", destination: "/about/team/jacob/" },
  { kind: "internal", source: "/resume", destination: "/about/team/jacob/" },
  { kind: "internal", source: "/resume/", destination: "/about/team/jacob/" },
  { kind: "internal", source: "/professional", destination: "/about/team/jacob/" },
  { kind: "internal", source: "/professional/", destination: "/about/team/jacob/" },
  { kind: "internal", source: "/projects", destination: "/software/projects/" },
  { kind: "internal", source: "/projects/", destination: "/software/projects/" },
  { kind: "internal", source: "/projects/sharktank", destination: "/software/projects/sharktank/" },
  { kind: "internal", source: "/projects/sharktank/", destination: "/software/projects/sharktank/" },
  { kind: "internal", source: "/projects/sharktank/case-study", destination: "/software/projects/sharktank/case-study/" },
  { kind: "internal", source: "/projects/sharktank/case-study/", destination: "/software/projects/sharktank/case-study/" },
  { kind: "internal", source: "/projects/hexframe", destination: "/software/projects/hexframe/" },
  { kind: "internal", source: "/projects/hexframe/", destination: "/software/projects/hexframe/" },
  { kind: "internal", source: "/projects/hexframe/case-study", destination: "/software/projects/hexframe/case-study/" },
  { kind: "internal", source: "/projects/hexframe/case-study/", destination: "/software/projects/hexframe/case-study/" },
  { kind: "internal", source: "/projects/yarreader", destination: "/software/projects/yarreader/" },
  { kind: "internal", source: "/projects/yarreader/", destination: "/software/projects/yarreader/" },
  { kind: "internal", source: "/projects/yarreader/case-study", destination: "/software/projects/yarreader/case-study/" },
  { kind: "internal", source: "/projects/yarreader/case-study/", destination: "/software/projects/yarreader/case-study/" },
  { kind: "external", source: "/compliance", destination: `${DEMO_ORIGIN}/assurance` },
  { kind: "external", source: "/compliance/", destination: `${DEMO_ORIGIN}/assurance` },
  { kind: "external", source: "/accessibility", destination: `${DEMO_ORIGIN}/assurance` },
  { kind: "external", source: "/accessibility/", destination: `${DEMO_ORIGIN}/assurance` },
  { kind: "external", source: "/security", destination: `${DEMO_ORIGIN}/security` },
  { kind: "external", source: "/security/", destination: `${DEMO_ORIGIN}/security` },
  { kind: "internal", source: "/services", destination: "/solutions/websites/" },
  { kind: "internal", source: "/services/", destination: "/solutions/websites/" },
  { kind: "internal", source: "/services/example", destination: "/solutions/websites/" },
  { kind: "internal", source: "/services/example/", destination: "/solutions/websites/" },
  { kind: "internal", source: "/work/shadowmoney", destination: "/software/projects/hexframe/" },
  { kind: "internal", source: "/work/shadowmoney/", destination: "/software/projects/hexframe/" },
  { kind: "internal", source: "/work/hexframe", destination: "/software/projects/hexframe/" },
  { kind: "internal", source: "/work/hexframe/", destination: "/software/projects/hexframe/" },
  { kind: "internal", source: "/work/shark-tank", destination: "/software/projects/sharktank/" },
  { kind: "internal", source: "/work/shark-tank/", destination: "/software/projects/sharktank/" },
  { kind: "internal", source: "/work/sharktank", destination: "/software/projects/sharktank/" },
  { kind: "internal", source: "/work/sharktank/", destination: "/software/projects/sharktank/" },
  { kind: "internal", source: "/projects/shark-tank", destination: "/software/projects/sharktank/" },
  { kind: "internal", source: "/projects/shark-tank/", destination: "/software/projects/sharktank/" },
  { kind: "internal", source: "/work/yarreader", destination: "/software/projects/yarreader/" },
  { kind: "internal", source: "/work/yarreader/", destination: "/software/projects/yarreader/" }
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

function isRetiredGameRoute(path: string): boolean {
  return /^\/(?:arena|uno|x4|21|game|checkers|battleship|3d|shark-?run)(?:\/.*)?$/i.test(path);
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
    if (permanentRoute) {
      if (permanentRoute.kind === "external") return redirect(permanentRoute.destination);
      const target = new URL(permanentRoute.destination, url.origin);
      target.search = url.search;
      return redirect(target.toString());
    }

    if (isRetiredGameRoute(path)) return redirect(`${url.origin}/`);
    if (isProtectedLegacy(path)) return redirect(`${SHARK_ORIGIN}${path}${url.search}`);
    if (isMachineRoute(path)) return proxyToSharkTank(request, url);

    const humanDestination = HUMAN_EXACT.get(path);
    if (humanDestination) return redirect(`${SHARK_ORIGIN}${humanDestination}${url.search}`);
    if (path.startsWith("/policies/")) return redirect(`${SHARK_ORIGIN}${path}${url.search}`);

    return env.ASSETS.fetch(request);
  }
} satisfies WorkerModule;

export default worker;
