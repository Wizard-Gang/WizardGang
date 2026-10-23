import { createEdge } from "#wg-edge";
import type { EdgeEnv, EdgeHandler, Release } from "#wg-edge";

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

export interface AssetBinding {
  fetch(request: Request): Promise<Response>;
}

export interface MediaObject {
  body: ReadableStream | null;
  httpEtag: string;
}

export interface MediaBucket {
  get(key: string): Promise<MediaObject | null>;
}

export interface WorkerEnv extends EdgeEnv {
  ASSETS: AssetBinding;
  WG_R2?: MediaBucket & NonNullable<EdgeEnv["WG_R2"]>;
}

/* The /sl page's photos live in the wizardgang R2 bucket under sl/. Only flat
   lowercase WebP names are served; everything else under /sl/media/ is a 404. */
export const SRI_LANKA_MEDIA = /^\/sl\/media\/([0-9a-f]{8})\.webp$/;

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

/* The shell answers /robots.txt before the app sees it, so the site's crawl policy lives here. */
export const ROBOTS = "User-agent: *\nAllow: /\n\nSitemap: https://wizardgang.ai/sitemap.xml\n";

function permanentRedirectFor(path: string): PermanentRedirectRoute | undefined {
  return PERMANENT_REDIRECT_ROUTES.find((route) => route.source === path);
}

async function sriLankaMedia(request: Request, env: WorkerEnv, name: string | undefined): Promise<Response> {
  const object = name && (request.method === "GET" || request.method === "HEAD") && env.WG_R2
    ? await env.WG_R2.get(`sl/${name}.webp`)
    : null;
  if (!object) return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  return new Response(request.method === "HEAD" ? null : object.body, {
    headers: {
      "content-type": "image/webp",
      "cache-control": "public, max-age=31536000, immutable",
      etag: object.httpEtag
    }
  });
}

function redirect(target: string): Response {
  // The shell adds the security headers to every app response.
  return new Response(null, {
    status: 308,
    headers: { location: target, "cache-control": "public, max-age=3600" }
  });
}

/* The wg-edge shell owns the host guard, the www → apex 308, TLS, /version.json, /health.json,
   /robots.txt, the /admin gate, security headers and errors. The site adds its outward
   shortcuts and the /sl photos from R2, and serves everything else from its assets. */
export function createSiteWorker(release: Release, { logSink }: { logSink?: (line: string) => void } = {}): EdgeHandler<WorkerEnv> {
  return createEdge<WorkerEnv>({
    release,
    robots: ROBOTS,
    logSink,
    async fetch(request, env) {
      const path = new URL(request.url).pathname;
      const permanentRoute = permanentRedirectFor(path);
      if (permanentRoute) return redirect(permanentRoute.destination);
      if (path.startsWith("/sl/media/")) return sriLankaMedia(request, env, SRI_LANKA_MEDIA.exec(path)?.[1]);
      return env.ASSETS.fetch(request);
    }
  });
}
