# WizardGang

[WizardGang.ai](https://wizardgang.ai) is the company site for WizardGang. It presents WizardGang software, integration capability, reusable solutions, and the people behind the work without treating prior-employer experience as WizardGang client work.

The public site is company-first:

```text
/
├── about/
│   ├── company/
│   └── team/
│       └── jacob/
├── software/
│   ├── integrations/
│   └── projects/
│       ├── sharktank/
│       ├── hexframe/
│       └── yarreader/
├── solutions/
│   ├── websites/
│   └── demo-framework/
└── glossary/
```

Project case studies live beneath their project routes. The generated 404 is noindex and is not a sitemap entry. The authoritative route inventory is the typed page registry; compatibility-only paths are handled by the Worker rather than generated as duplicate pages.

**[Live site](https://wizardgang.ai)** · **[Software](https://wizardgang.ai/software/)** · **[Solutions](https://wizardgang.ai/solutions/)**

## Architecture

WizardGang.ai is a static-first React and TypeScript application:

```text
React + TypeScript page composition
→ typed page registry
→ Vite static build
→ complete HTML + generated CSS/browser module
→ Cloudflare assets + TypeScript Worker
```

React renders complete static documents during the build. There is no client React hydration and no SPA router. Browser TypeScript progressively enhances language, display preferences, and mobile navigation.

The TypeScript Worker owns runtime routing that cannot be expressed as static assets alone, including supported compatibility redirects and product-boundary routing. Wrangler owns local runtime and Cloudflare deployment configuration.

Styling is built through Vite with Tailwind available in the toolchain and authored production CSS in `src/styles/globals.css`.

## Content ownership

- Home — WizardGang orientation.
- About / Company — company identity, principles, and public claims.
- About / Team — people and professional background. `/about/team/jacob/` is the professional-history authority.
- Software / Integrations — the single company-facing integration capability catalog.
- Software / Projects — WizardGang-owned project facts, project pages, and case studies.
- Solutions — reusable approaches. Demo Framework is explained on the main site; the detailed executable/evidence application lives at [demo.wizardgang.ai](https://demo.wizardgang.ai).
- Glossary — supporting technical definitions.

Typed domain data lives under `src/data/`. Employer/customer evidence remains attributed to professional data and must not be presented as WizardGang client work.

## Run locally

Install the locked dependencies and start the normal local environment:

```bash
npm ci
npm run dev
```

`npm run dev` is checkout-scoped. It:

1. stops stale Wrangler/Vite processes only when their saved process metadata proves they belong to this checkout;
2. resets generated `dist/`, `tmp/dev/`, and `tmp/frontend-shell/` state;
3. runs the production static build;
4. sanitizes only the generated local `dist/_headers` copy for plain HTTP;
5. starts Vite build watch;
6. starts `wrangler dev --local` at `http://127.0.0.1:8790`;
7. waits for the Wrangler-served site to respond;
8. opens the local URL and remains attached to both required child processes.

Use another port when needed:

```bash
WIZARDGANG_PORT=9123 npm run dev
```

If a requested port belongs to an unrelated process, startup fails rather than terminating that process. Stop the environment with `Ctrl-C`.

Production security policy remains in `public/_headers`. Local development removes HSTS and `upgrade-insecure-requests` only from the generated `dist/_headers` copy; do not weaken `public/_headers` to make localhost work.

## Build and verify

Build the complete static site:

```bash
npm run build
```

The build emits the static HTML pages, public assets, generated CSS/browser JavaScript, and `version.json` into `dist/`.

The authoritative repository acceptance gate is:

```bash
npm run check
```

It includes strict TypeScript checking, the production build, frontend-architecture authority, generated-page contracts, company-first IA, accessibility, browser behavior, project/integration/solution ownership, Worker routing, local-development lifecycle, metadata, links, and security/header boundaries.

Useful focused checks include:

```bash
npm run test:company-ia
npm run test:accessibility
npm run test:frontend-authority
npm run test:docs
```

## Source layout

```text
src/
  app/         document, contracts, navigation, canonical page registry
  browser/     progressive enhancement
  components/  shared presentation
  data/        typed content authorities
  pages/       canonical React page bodies
  styles/      production CSS
  worker/      Cloudflare runtime routing
scripts/       build, local development, verification, maintenance
tests/         repository acceptance
public/        deployable static assets and production headers
docs/          current operating and architecture documentation
```

Key authorities:

- `src/app/pageRegistry.ts` — generated page inventory.
- `src/app/navigation.ts` — primary navigation and current-section model.
- `src/data/projects.ts` — project facts, routes, actions, and metadata.
- `src/data/integrations.ts` — company integration capability.
- `src/data/team.ts`, `src/data/professional.ts`, and `src/data/professional-systems.ts` — people, career history, and attributed professional evidence.
- `src/data/solutions.ts` — Websites and Demo Framework solution data.
- `src/components/ProjectSurfaces.tsx` — shared project presentation contract.
- `src/app/Document.tsx` — static document and metadata composition.
- `src/worker/index.ts` — compatibility/runtime routing.
- `vite.config.ts` — static build pipeline.
- `wrangler.jsonc` — local/staging/production Cloudflare configuration.

## Documentation

- [Current information and technical architecture](docs/INFORMATION-ARCHITECTURE.md)
- [Source and system ownership](docs/OWNERSHIP.md)
- [Accessibility](docs/ACCESSIBILITY.md)
- [Compliance management record](docs/COMPLIANCE.md)
- [Security policy](SECURITY.md)

## Deployment

Cloudflare environments are defined in `wrangler.jsonc`. Validate deploy packaging without publishing:

```bash
npm run deploy:staging:dry-run
npm run deploy:production:dry-run
```

Real staging or production deployment is a separate release action and is not part of `npm run check`.
