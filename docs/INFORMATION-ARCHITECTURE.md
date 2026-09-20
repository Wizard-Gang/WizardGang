# WizardGang.ai current architecture

Status: current-state authority for the public site structure, content ownership, canonical routes, and frontend/runtime boundaries.

Implementation authority remains the typed source and acceptance tests. This document explains those contracts for contributors without duplicating generated output.

## Public hierarchy

WizardGang is the primary public entity. The global primary navigation is:

- About
- Software
- Solutions

Home is reached through the WizardGang wordmark. Contact and GitHub remain available contextually and in the Footer rather than as primary navigation peers.

The canonical public route hierarchy is:

```text
/
├── /about/
│   ├── /about/company/
│   └── /about/team/
│       └── /about/team/jacob/
├── /software/
│   ├── /software/integrations/
│   └── /software/projects/
│       ├── /software/projects/sharktank/
│       │   └── /software/projects/sharktank/case-study/
│       ├── /software/projects/hexframe/
│       │   └── /software/projects/hexframe/case-study/
│       └── /software/projects/yarreader/
│           └── /software/projects/yarreader/case-study/
├── /solutions/
│   ├── /solutions/websites/
│   └── /solutions/demo-framework/
└── /glossary/
```

The build also emits `404.html`. It is noindex and has no canonical URL. It is not a sitemap entry.

`src/app/pageRegistry.ts` is the generated-page inventory. Project descendants are produced from the typed project authority rather than maintained as a second route list.

## Content ownership

Each major concept has one public owner:

| Concept | Authority | Supporting surfaces |
| --- | --- | --- |
| WizardGang orientation | `/` | About, Software, Solutions |
| company identity and principles | `/about/company/` | Home, About |
| people | `/about/team/` | About |
| Jacob professional history | `/about/team/jacob/` | Team, Home credibility links |
| integration capability | `/software/integrations/` | Software, Home, attributed professional evidence |
| WizardGang project catalog | `/software/projects/` | Software, Home |
| project facts | `src/data/projects.ts` | project pages, cards, case studies, metadata |
| website solution | `/solutions/websites/` | Solutions, Home |
| Demo Framework explanation | `/solutions/demo-framework/` | Solutions, Company |
| detailed Demo Framework application/evidence | `demo.wizardgang.ai` | linked from the main-site summary |
| technical definitions | `/glossary/` | contextual links |

Company capability and professional evidence are separate domains. Employer roles, employer/customer deployments, and professional outcomes belong to Jacob's Team/professional data. They may support a capability claim with clear attribution, but they are not WizardGang client work.

## Typed authorities

The current data and configuration model is intentionally singular:

- `src/app/navigation.ts` — global primary navigation and current-section matching.
- `src/app/pageRegistry.ts` — generated page inventory.
- `src/data/projects.ts` — WizardGang project records, route helpers, actions, previews, case-study availability, and metadata.
- `src/data/integrations.ts` — company integration taxonomy and evidence relationships.
- `src/data/team.ts` — team membership and profile routes.
- `src/data/professional.ts` — career roles, professional projects, and skills.
- `src/data/professional-systems.ts` — attributed professional deployments/system evidence.
- `src/data/solutions.ts` — solution records, website packages, Demo Framework process, and external demo boundary.

Pages and shared components project these authorities. They should not create parallel full catalogs.

## Project presentation

`/software/projects/` is the only canonical WizardGang project catalog.

Each project record provides its canonical slug, facts, source/live destinations, preview behavior, and optional case study. `src/pages/Projects.tsx` derives project page definitions from that authority. `src/components/ProjectSurfaces.tsx` provides shared cards, facts, actions, headers, architecture presentation, and preview framing.

Project-specific narrative remains project-specific; shared presentation does not require identical case-study sections.

## Integrations

`/software/integrations/` is the single company-facing integration capability surface. It renders the typed integration taxonomy.

Jacob's Team page carries the professional record that supports those capabilities. Project pages may describe project-specific integrations. Neither is a second generic integration catalog.

## Solutions and Demo Framework

Software and Solutions are separate concepts:

```text
Software
→ Integrations
→ Projects

Solutions
→ Websites
→ Demo Framework
```

The main-site Demo Framework page explains the reusable approach and links outward. `demo.wizardgang.ai` owns the detailed interactive architecture, assurance, security, and evidence application. The primary site does not mirror that application's route tree or operational data.

## Route policy

Canonical identity is path-based.

- Canonical pages come from the typed page registry.
- First-party UI links directly to canonical paths.
- Redirect-only paths do not enter the page registry or sitemap.
- Canonical metadata and Open Graph URLs use the current canonical path.
- Query strings may represent non-identity state or tracking, but not alternate canonical pages.
- Explicitly unsupported/retired paths fall through to the normal 404 behavior.

Supported compatibility behavior lives in `src/worker/index.ts`. Current company-site compatibility includes:

- `/work[/]`, `/professional[/]`, and `/resume[/]` → `/about/team/jacob/`;
- `/projects[/]` and the supported former project paths → their final `/software/projects/.../` destinations;
- supported former `/work/<project>` project paths → their final `/software/projects/.../` destinations;
- `/services[/]` and `/services/example[/]` → `/solutions/websites/`;
- `/github[/]` → the WizardGang GitHub organization;
- `/compliance[/]` and `/accessibility[/]` → the demo assurance surface;
- `/security[/]` → the demo security surface.

The Worker also preserves the product-specific SharkTank compatibility/proxy boundary that is covered by Worker routing acceptance. Internal company-site moves preserve query strings. Redirect destinations are direct; compatibility paths are not canonical pages.

There is no canonical `/contact/` route. Contact remains available through the Footer and contextual mail links; `/contact/` uses normal not-found behavior.

## Technical architecture

WizardGang.ai is static-first:

```text
React + TypeScript
→ render complete documents
→ typed page registry
→ Vite build
→ static HTML + assets in dist/
→ Cloudflare static assets
→ TypeScript Worker for runtime routing boundaries
```

### React and TypeScript

`src/app/Document.tsx` uses React server rendering to produce complete HTML documents. Canonical page bodies are React/TypeScript definitions under `src/pages/`.

The browser does not hydrate a React application. There is no SPA router. Static content, navigation, links, metadata, and primary page meaning exist before browser JavaScript runs.

### Browser enhancement

`src/browser/` owns first-party progressive enhancement for:

- mobile navigation;
- language behavior;
- display/theme preferences;
- readable layout and text size;
- project-preview motion preferences.

Failure or absence of browser JavaScript must not erase primary content or navigation.

### Build and styling

`npm run build` invokes Vite through `scripts/build.mjs`.

Vite:

- compiles the server-side React renderer;
- processes `src/styles/globals.css` through the current Vite/Tailwind toolchain;
- emits the first-party browser module and CSS;
- copies public assets;
- renders the typed page registry;
- writes `version.json`;
- publishes the completed tree into `dist/`.

### Worker and Cloudflare

`src/worker/index.ts` is the Wrangler entry point. It owns compatibility redirects and product-boundary behavior while static assets remain the normal page-delivery path.

`wrangler.jsonc` defines the local, staging, and production Cloudflare configuration. Production serves `wizardgang.ai` as a custom domain.

## Local development

The normal workflow is:

```bash
npm ci
npm run dev
```

The local orchestrator performs checkout-owned teardown, narrow generated-state reset, production build, local header preparation, Vite build watch, Wrangler startup, readiness verification, browser open, and attached supervision.

The default local origin is:

```text
http://127.0.0.1:8790
```

Use `WIZARDGANG_PORT` to select another port. The process manager refuses to kill a port owner that it cannot prove belongs to the same checkout.

Production headers are authored in `public/_headers`. Local development sanitizes only the generated `dist/_headers` copy so plain HTTP does not receive HSTS or `upgrade-insecure-requests`.

## Verification and guardrails

`npm run check` is the merge acceptance gate. It includes the production build and all `tests/*.test.mjs`.

The enforced architecture includes:

- TypeScript-first application source;
- React static composition without client hydration;
- one canonical page registry;
- one typed primary-navigation authority;
- one canonical route per concept;
- direct internal canonical links;
- company/personal attribution boundaries;
- accessibility and progressive-enhancement behavior;
- Worker compatibility behavior;
- metadata and sitemap correctness;
- safe checkout-scoped local development.

Focused debugging commands include `npm run test:frontend-authority`, `npm run test:company-ia`, `npm run test:accessibility`, and `npm run test:docs`.

## External boundaries

- `wizardgang.ai` — company/orientation site owned by this repository.
- `demo.wizardgang.ai` — detailed architecture/demo/assurance application.
- `sharktank.wizardgang.ai` — SharkTank product/runtime destination.
- `hexframe.wizardgang.ai` — Hexframe product/runtime destination.
- WizardGang GitHub repositories — source and release destinations.
- YarReader — repository/offline-product surface rather than a WizardGang web runtime.

Product runtime implementation, recovery procedures, operational data, and product-specific evidence stay with their owning systems rather than being duplicated here.
