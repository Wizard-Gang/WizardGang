# WizardGang.ai current architecture

Status: current-state authority for the public site structure, content ownership, canonical routes, and frontend/runtime boundaries.

Implementation authority remains the typed source and acceptance tests. This document explains those contracts for contributors without duplicating generated output.

## Public hierarchy

The site is five pages. The primary navigation is Work, Services, About, Contact; Home is reached through the wordmark.

```text
/
├── /work/
├── /services/
├── /about/
└── /contact/
```

The build also emits `404.html`. It is noindex, has no canonical URL, and is not a sitemap entry.

`src/app/pageRegistry.ts` is the generated-page inventory, and `sitemap.xml` is a projection of it rather than a second list.

Everything deeper than a page is a fragment on the page that owns it. A project is `/work/#<slug>`, a service is `/services/#<slug>`, and the professional record is `/about/#jacob`. Fragments come from the typed authorities, so a route and its anchor cannot drift apart.

## Content ownership

Each concept has one public owner:

| Concept | Authority | Typed source |
| --- | --- | --- |
| orientation and the work itself | `/` | `src/data/projects.ts` |
| project problem, build, architecture, approach, result | `/work/` | `src/data/projects.ts` |
| websites, Demo Framework, integration capability | `/services/` | `src/data/solutions.ts`, `src/data/integrations.ts` |
| company, the person, career record, attribution | `/about/` | `src/data/team.ts`, `src/data/professional.ts` |
| how to make contact | `/contact/` | `src/data/site.ts` |
| detailed Demo Framework application and evidence | `demo.wizardgang.ai` | linked outward, not mirrored |

The home page shows each project's preview, a one-line tagline and a link. `/work/` owns the substance. A project's overview and its case study used to be separate routes that restated each other; they are one entry now.

Company capability and professional evidence remain separate domains. Employer roles and customer deployments belong to the professional record on `/about/`, where the boundary is stated once. They may support a capability claim with attribution; they are not WizardGang client work, and that statement does not belong in a section heading on another page.

## Typed authorities

- `src/app/navigation.ts` — primary navigation and current-section matching.
- `src/app/pageRegistry.ts` — generated page inventory.
- `src/data/projects.ts` — project records, `/work/` anchors, actions, previews, metadata.
- `src/data/integrations.ts` — integration capability taxonomy.
- `src/data/solutions.ts` — website packages and the Demo Framework boundary.
- `src/data/team.ts`, `src/data/professional.ts`, `src/data/professional-systems.ts` — people, career history, attributed evidence.

Pages project these authorities. They do not create parallel catalogs.

## Presentation

Two authored stylesheets, with one job each:

- `src/styles/tokens.css` — the design system. One palette with a four-step surface ladder and a three-level text ramp, one type scale, one spacing scale, and the self-hosted faces. It may declare only `:root` custom properties and `@font-face`, which `npm run check` enforces, so it cannot become a second place where presentation is decided.
- `src/styles/globals.css` — every rule, consuming those tokens.

Headings resolve to one of four scale tokens. A page that wants a different size changes the scale, not the page.

Instrument Sans and JetBrains Mono ship from `public/fonts/` as latin-subset variable WOFF2 under the SIL Open Font License. The production policy is `default-src 'none'` with `font-src 'self'`, so a font served from another origin would not load at all.

## Route policy

Canonical identity is path-based.

- Canonical pages come from the typed page registry.
- First-party UI links directly to canonical paths and their fragments.
- Redirect-only paths do not enter the page registry or sitemap, and no canonical page links to one.
- Canonical metadata and Open Graph URLs use the current canonical path.
- Explicitly unsupported paths fall through to the normal 404 behavior.

Supported compatibility behavior lives in `src/worker/index.ts`, which carries 71 permanent redirects. Every route the site has published lands on the page or fragment that now owns its content:

- former project routes, including the separate case studies, and the older `/projects/*` and `/work/<slug>` paths → `/work/#<slug>`;
- `/software/` and `/software/projects/` → `/work/`;
- `/software/integrations/` → `/services/#integrations`;
- `/solutions/`, `/solutions/websites/`, `/solutions/demo-framework/` → `/services/` and its anchors;
- `/about/company/`, `/about/team/`, `/about/team/jacob/`, `/resume`, `/professional` → `/about/` and `/about/#jacob`;
- `/glossary/` → `/`;
- `/github` → the WizardGang GitHub organization;
- `/compliance`, `/accessibility`, `/security` → the demo assurance and security surfaces.

Internal redirects preserve query strings and place them before any fragment. Destinations are direct: a redirect never lands on another redirect.

The Worker also preserves the SharkTank compatibility and proxy boundary covered by Worker routing acceptance.

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

`src/browser/` owns first-party progressive enhancement for mobile navigation, language, display and theme preferences, readable layout, text size, and project-preview motion. Failure or absence of browser JavaScript must not erase primary content or navigation.

### Build and styling

`npm run build` invokes Vite through `scripts/build.mjs`. Vite compiles the server-side renderer, processes the stylesheets, emits the browser module, copies public assets, renders the page registry, writes `version.json` and the generated `sitemap.xml`, then publishes the tree into `dist/`.

### Worker and Cloudflare

`src/worker/index.ts` is the Wrangler entry point and owns compatibility redirects and product-boundary behavior. `wrangler.jsonc` defines local, staging, and production configuration. Production serves `wizardgang.ai` as a custom domain.

## Local development

```bash
npm ci
npm run dev
```

The orchestrator performs checkout-owned teardown, narrow generated-state reset, production build, local header preparation, Vite build watch, Wrangler startup, readiness verification, browser open, and attached supervision.

The default local origin is `http://127.0.0.1:8790`. Use `WIZARDGANG_PORT` to select another port. The process manager refuses to kill a port owner it cannot prove belongs to the same checkout.

Production headers are authored in `public/_headers`. Local development sanitizes only the generated `dist/_headers` copy so plain HTTP does not receive HSTS or `upgrade-insecure-requests`.

## Verification and guardrails

`npm run check` is the merge acceptance gate. It includes strict TypeScript checking, the production build, and every `tests/*.test.mjs`.

The enforced architecture includes:

- TypeScript-first application source;
- React static composition without client hydration;
- one canonical page registry, and a sitemap derived from it;
- one typed primary-navigation authority;
- one canonical route per concept, and one type scale for every heading;
- direct internal canonical links, never through a redirect;
- company and personal attribution boundaries;
- accessibility and progressive-enhancement behavior;
- Worker compatibility behavior;
- metadata correctness;
- safe checkout-scoped local development.

## External boundaries

- `wizardgang.ai` — the company site owned by this repository.
- `demo.wizardgang.ai` — the detailed architecture, assurance, and evidence application.
- `sharktank.wizardgang.ai` and `hexframe.wizardgang.ai` — product runtimes.
- WizardGang GitHub repositories — source and releases.

Product runtime implementation, operational data, and product-specific evidence stay with their owning systems rather than being duplicated here.
