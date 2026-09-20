import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/worker/index.ts";

const SITE = "https://wizardgang.ai";
const SHARK = "https://sharktank.wizardgang.ai";

function assetEnv(calls = []) {
  return {
    ASSETS: {
      fetch: async (request) => {
        calls.push(request);
        return new Response("asset", { status: 200, headers: { "x-asset-fallback": "1" } });
      }
    }
  };
}

async function fetchWorker(path, init = {}, env = assetEnv()) {
  return worker.fetch(new Request(`${SITE}${path}`, init), env);
}

const permanentRedirects = [
  ["/github", "https://github.com/Wizard-Gang", false],
  ["/github/", "https://github.com/Wizard-Gang", false],
  ["/compliance", "https://demo.wizardgang.ai/assurance", false],
  ["/compliance/", "https://demo.wizardgang.ai/assurance", false],
  ["/accessibility", "https://demo.wizardgang.ai/assurance", false],
  ["/accessibility/", "https://demo.wizardgang.ai/assurance", false],
  ["/security", "https://demo.wizardgang.ai/security", false],
  ["/security/", "https://demo.wizardgang.ai/security", false]
];

test("permanent compatibility redirects exercise the Worker API with exact current destinations", async (t) => {
  for (const [path, destination, preservesQuery] of permanentRedirects) {
    await t.test(path, async () => {
      const response = await fetchWorker(`${path}?source=wg037`);
      assert.equal(response.status, 308);
      // A same-origin destination keeps the query, and a fragment stays last.
      const expected = new URL(destination);
      if (preservesQuery) expected.search = "?source=wg037";
      assert.equal(response.headers.get("location"), preservesQuery ? expected.toString() : destination);
    });
  }
});

test("same-origin compatibility redirects terminate at a canonical asset route instead of chaining", async (t) => {
  for (const [, destination] of permanentRedirects.filter(([, destination]) => destination.startsWith(SITE))) {
    await t.test(destination, async () => {
      const calls = [];
      const response = await fetchWorker(new URL(destination).pathname, {}, assetEnv(calls));
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("x-asset-fallback"), "1");
      assert.equal(calls.length, 1, "canonical destination should fall directly through to assets");
    });
  }
});

test("routes this site used to serve are dead rather than redirected", async (t) => {
  const retired = [
    "/work/", "/services/", "/contact/", "/projects/", "/glossary/", "/resume", "/professional",
    "/software/", "/software/projects/", "/software/sharktank/", "/software/integrations/",
    "/solutions/industries/", "/solutions/integrations/", "/solutions/deployments/",
    "/solutions/websites/", "/about/company/", "/about/team/", "/about/team/jacob/",
    "/arena", "/uno", "/x4", "/21", "/checkers", "/battleship"
  ];
  for (const path of retired) {
    await t.test(path, async () => {
      const calls = [];
      const response = await fetchWorker(path, {}, assetEnv(calls));
      assert.equal(response.status, 200, "a dead route falls through to the asset handler");
      assert.equal(calls.length, 1, "nothing may intercept it on the way");
      assert.equal(response.headers.get("location"), null, `${path} must not redirect`);
    });
  }
});


test("protected SharkTank legacy routes preserve path and query at the SharkTank origin", async (t) => {
  const routes = [
    "/admin",
    "/admin/users",
    "/audit.json",
    "/audit.jsonl",
    "/audit/status.json",
    "/audit/game/abc",
    "/audit/replay/abc/2"
  ];
  for (const path of routes) {
    await t.test(path, async () => {
      const response = await fetchWorker(`${path}?trace=wg037`);
      assert.equal(response.status, 308);
      assert.equal(response.headers.get("location"), `${SHARK}${path}?trace=wg037`);
    });
  }
});

test("machine routes proxy to SharkTank with path/query, method, origin rewrite, proxy header, and manual redirects", async () => {
  const originalFetch = globalThis.fetch;
  const captured = [];
  globalThis.fetch = async (request) => {
    captured.push(request);
    return new Response("proxied", { status: 202 });
  };

  try {
    const routes = [
      "/api",
      "/api/widgets",
      "/room/room-7",
      "/php-room",
      "/php-api",
      "/php-api/widgets",
      "/docs/openapi.json",
      "/openapi.json",
      "/status.json",
      "/roadmap.json",
      "/incidents.json",
      "/spend.json",
      "/inquiry.json",
      "/logs.json",
      "/audit/manifest.json",
      "/policies.json",
      "/logs/game/match-17.txt"
    ];

    for (const [index, path] of routes.entries()) {
      const method = index === 1 ? "DELETE" : "GET";
      const request = new Request(`${SITE}${path}?source=wg037`, {
        method,
        headers: { Origin: SITE, "x-client-proof": "present" }
      });
      const response = await worker.fetch(request, assetEnv());
      assert.equal(response.status, 202, `${path} did not proxy`);
      const proxied = captured.at(-1);
      assert.equal(proxied.url, `${SHARK}${path}?source=wg037`);
      assert.equal(proxied.method, method);
      assert.equal(proxied.headers.get("x-wizardgang-migration-proxy"), "1");
      assert.equal(proxied.headers.get("origin"), SHARK);
      assert.equal(proxied.headers.get("x-client-proof"), "present");
      assert.equal(proxied.redirect, "manual");
    }
    assert.equal(captured.length, routes.length);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("a non-WizardGang Origin is not rewritten by the machine proxy", async () => {
  const originalFetch = globalThis.fetch;
  let captured;
  globalThis.fetch = async (request) => {
    captured = request;
    return new Response(null, { status: 204 });
  };
  try {
    const response = await worker.fetch(new Request(`${SITE}/status.json`, { headers: { Origin: "https://example.com" } }), assetEnv());
    assert.equal(response.status, 204);
    assert.equal(captured.headers.get("origin"), "https://example.com");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

const humanRoutes = new Map([
  ["/play", "/play/"],
  ["/ts", "/ts/"],
  ["/php", "/php/"],
  ["/docs", "/docs/"],
  ["/trust", "/trust/"],
  ["/status", "/status/"],
  ["/roadmap", "/status/#delivery"],
  ["/incidents", "/status/#incidents"],
  ["/inquiry", "/spend/"],
  ["/spend", "/spend/"],
  ["/logs", "/logs/"],
  ["/audit", "/audit/"],
  ["/policies", "/policies/"]
]);

test("SharkTank human routes permanently redirect to their exact current destinations", async (t) => {
  for (const [path, destination] of humanRoutes) {
    await t.test(path, async () => {
      const withFragment = destination.includes("#");
      const query = withFragment ? "" : "?source=wg037";
      const response = await fetchWorker(`${path}${query}`);
      assert.equal(response.status, 308);
      assert.equal(response.headers.get("location"), `${SHARK}${destination}${query}`);
    });
  }
});

test("ordinary SharkTank human redirects preserve query strings", async () => {
  for (const path of ["/play", "/ts", "/php", "/docs", "/trust", "/status", "/inquiry", "/spend", "/logs", "/audit", "/policies"]) {
    const response = await fetchWorker(`${path}?one=1&two=2`);
    assert.match(response.headers.get("location") || "", /\?one=1&two=2$/);
  }
});

test("policy child routes permanently preserve the matching SharkTank path and query", async () => {
  for (const path of ["/policies/access-control", "/policies/ai/governance"]) {
    const response = await fetchWorker(`${path}?version=current`);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `${SHARK}${path}?version=current`);
  }
});

test("ordinary canonical pages and static assets fall through untouched to ASSETS", async () => {
  for (const [url, method] of [[`${SITE}/about/?source=wg037`, "GET"], [`${SITE}/assets/styles.css?v=current`, "HEAD"]]) {
    const calls = [];
    const env = assetEnv(calls);
    const request = new Request(url, { method, headers: { "x-fallback-proof": "1" } });
    const response = await worker.fetch(request, env);
    assert.equal(response.status, 200);
    assert.equal(calls.length, 1);
    assert.strictEqual(calls[0], request, "asset fallback must receive the original Request object unchanged");
    assert.equal(calls[0].url, url);
    assert.equal(calls[0].method, method);
    assert.equal(calls[0].headers.get("x-fallback-proof"), "1");
  }
});

test("machine proxy retains request bodies while preserving method and headers", async () => {
  const originalFetch = globalThis.fetch;
  let captured;
  globalThis.fetch = async (request) => {
    captured = request;
    return new Response("proxied", { status: 202 });
  };

  try {
    const response = await worker.fetch(new Request(`${SITE}/api/widgets?source=wg040`, {
      method: "POST",
      headers: {
        Origin: SITE,
        "content-type": "application/json",
        "x-client-proof": "body-present"
      },
      body: JSON.stringify({ source: "wg040" })
    }), assetEnv());

    assert.equal(response.status, 202);
    assert.equal(captured.url, `${SHARK}/api/widgets?source=wg040`);
    assert.equal(captured.method, "POST");
    assert.equal(captured.headers.get("content-type"), "application/json");
    assert.equal(captured.headers.get("x-client-proof"), "body-present");
    assert.equal(captured.headers.get("origin"), SHARK);
    assert.equal(captured.headers.get("x-wizardgang-migration-proxy"), "1");
    assert.equal(captured.redirect, "manual");
    assert.deepEqual(await captured.json(), { source: "wg040" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("unknown non-intercepted routes fall through to ASSETS unchanged", async () => {
  const calls = [];
  const env = assetEnv(calls);
  const request = new Request(`${SITE}/not-a-worker-route?source=wg040`, {
    headers: { "x-fallback-proof": "unknown-route" }
  });
  const response = await worker.fetch(request, env);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-asset-fallback"), "1");
  assert.equal(calls.length, 1);
  assert.strictEqual(calls[0], request);
  assert.equal(calls[0].url, request.url);
  assert.equal(calls[0].headers.get("x-fallback-proof"), "unknown-route");
});
