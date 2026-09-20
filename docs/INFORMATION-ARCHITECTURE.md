# WizardGang.ai current architecture

Status: current-state authority for the public site structure, content ownership, canonical routes, and frontend/runtime boundaries.

Implementation authority remains the typed source and acceptance tests. This document explains those contracts for contributors without duplicating generated output.

## Public hierarchy

Six canonical pages. The primary navigation is Solutions, Projects and About. Projects is a disclosure menu rather than an index page; Solutions is a single page with three sections. Home is reached through the wordmark, and contact lives in the footer.

```text
/
├── /solutions/            #industries, #integrations, #deployments
├── /projects/sharktank/
├── /projects/hexframe/
├── /projects/yarreader/
└── /about/
```

There is no `/projects/` landing page. A section index would restate what its menu already says, which is exactly the redundancy between a home page and a work listing that this structure removes; `/projects/` redirects to its first entry.

The build also emits `404.html`. It is noindex, has no canonical URL, and is not a sitemap entry.

`src/app/pageRegistry.ts` is the generated-page inventory, and `sitemap.xml` is a projection of it rather than a second list. The menus are projections too: the Software menu comes from `src/data/projects.ts` and the Solutions menu from `src/data/solutions-menu.ts`, so navigation and routes cannot drift apart.

## Content ownership

Each concept has one public owner:

| Concept | Authority | Typed source |
| --- | --- | --- |
| industries, integrations and projects, as scannable lists | `/` | `src/data/projects.ts`, `src/data/professional-systems.ts` |
| one project's problem, build, architecture, approach, result | `/projects/<slug>/` | `src/data/projects.ts` |
| the full professional record | `/solutions/` | `src/data/professional-systems.ts` |
| the argument, the person, the career record | `/about/` | `src/data/team.ts`, `src/data/professional.ts` |
| detailed Demo Framework application and evidence | `demo.wizardgang.ai` | linked outward, not mirrored |

The home page carries each project's preview, a one-line tagline, its tags and a link. The case study owns the substance. A project's overview and its case study used to be separate routes that restated each other; they are one page now.

Solutions is the public view of professional evidence that previously had no surface: the domains worked in, the systems connected, and the organizations those systems ran for. Every deployment record carries the solution delivered and the employer it was delivered under, and the page opens with a note saying the whole record is employment rather than WizardGang client work. That claim is made where the evidence is, not in a footnote on another page.

### Motion

Every row on the home page — industry, integration and project alike — is a closed `details` built from the same component. A project's preview animates only while its panel is open, and each list shares a `name`, so at most one panel per list is open and at most one preview runs at a time. Nothing moves on load. `src/styles/globals.css` pauses `.project-visual *` unconditionally and resumes it only inside `details[open]` or a case study's `.case-visual`, with the preview toggle still respected.

## Typed authorities

- `src/app/navigation.ts` — primary navigation and current-section matching.
- `src/app/pageRegistry.ts` — generated page inventory.
- `src/data/projects.ts` — project records, `/projects/` routes, displayed tags, actions, previews, metadata, and the Projects menu.
- `src/data/solutions-menu.ts` — the Solutions page sections.
- `src/data/professional-systems.ts` — the domains, systems and organizations Solutions projects.
- `src/data/integrations.ts` — the company integration taxonomy.
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

Supported compatibility behavior lives in `src/worker/index.ts`, which carries 79 permanent redirects. Every route the site has published lands on the page that now owns its content:

- former project routes, the separate case studies, and the older `/software/<slug>` and `/work/<slug>` paths → `/projects/<slug>/`;
- `/software/`, `/software/projects/`, `/projects/` → `/projects/sharktank/`;
- the former Solutions sub-pages, `/software/integrations/`, `/services/`, `/solutions/websites/` and `/solutions/demo-framework/` → the matching `/solutions/#section`;
- `/about/company/`, `/about/team/`, `/about/team/jacob/`, `/resume`, `/professional`, `/contact/` → `/about/`;
- `/work/` and `/glossary/` → `/`;
- `/github` → the WizardGang GitHub organization;
- `/compliance`, `/accessibility`, `/security` → the demo assurance and security surfaces.

Internal redirects preserve query strings and place them before any fragment. Destinations are direct: a redirect never lands on another redirect, and no canonical page links to a redirect-only path.

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
- navigation menus that open with the keyboard and without JavaScript;
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
