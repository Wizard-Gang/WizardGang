# WizardGang

[WizardGang.ai](https://wizardgang.ai) is the company site for WizardGang. It leads with the work — SharkTank, Hexframe and YarReader — and keeps everything else to what a visitor actually needs.

The public site is five pages:

```text
/            orientation, and the three projects as live previews
/work/       each project: problem, build, architecture, approach, result
/services/   websites, the Demo Framework, integration capability
/about/      the company, the person, and the attribution boundary
/contact/    how to reach WizardGang
```

Anything deeper is a fragment on the page that owns it: a project is `/work/#<slug>`, a service is `/services/#<slug>`, the professional record is `/about/#jacob`. Every route the site has ever published still resolves — the Worker carries 71 permanent redirects to the page or anchor that now owns that content. The generated 404 is noindex and is not a sitemap entry.

**[Live site](https://wizardgang.ai)** · **[Work](https://wizardgang.ai/work/)** · **[Services](https://wizardgang.ai/services/)**

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

The TypeScript Worker owns runtime routing that cannot be expressed as static assets alone, including compatibility redirects and product-boundary routing. Wrangler owns local runtime and Cloudflare deployment configuration.

## Presentation

Two authored stylesheets, one job each:

- `src/styles/tokens.css` — the design system: one palette, one type scale, one spacing scale, and the self-hosted faces. It may declare only `:root` custom properties and `@font-face`, which the acceptance gate enforces.
- `src/styles/globals.css` — every rule, consuming those tokens.

Every heading resolves to one of four scale tokens, so a page cannot invent its own display size. Instrument Sans and JetBrains Mono ship from `public/fonts/` as latin-subset variable WOFF2 under the SIL Open Font License; the production policy is `default-src 'none'` with `font-src 'self'`, so a font from another origin would not load.

## Content ownership

- Home — orientation, and the work itself.
- Work — WizardGang-owned project facts and substance.
- Services — reusable offers and integration capability. The Demo Framework is explained here; the executable application lives at [demo.wizardgang.ai](https://demo.wizardgang.ai).
- About — company identity, the person, and the professional record.
- Contact — email and the public profiles.

Typed domain data lives under `src/data/`. Employer and customer evidence stays attributed to the professional record and is not presented as WizardGang client work; that boundary is stated once, on About.

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

The build emits the static HTML pages, public assets, generated CSS/browser JavaScript, `sitemap.xml` and `version.json` into `dist/`. The sitemap is a projection of the page registry, never a second route list.

The authoritative repository acceptance gate is:

```bash
npm run check
```

It includes strict TypeScript checking, the production build, frontend-architecture authority, generated-page contracts, accessibility, browser behavior, project and service ownership, Worker routing, local-development lifecycle, metadata, links, and security/header boundaries.

Useful focused checks include:

```bash
npm run test:accessibility
npm run test:frontend-authority
npm run test:navigation
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
  styles/      design tokens and production CSS
  worker/      Cloudflare runtime routing
scripts/       build, local development, verification, maintenance
tests/         repository acceptance
public/        deployable static assets, fonts, and production headers
docs/          current operating and architecture documentation
```

Key authorities:

- `src/app/pageRegistry.ts` — generated page inventory.
- `src/app/navigation.ts` — primary navigation and current-section model.
- `src/data/projects.ts` — project facts, anchors, actions, and metadata.
- `src/data/integrations.ts` — integration capability.
- `src/data/solutions.ts` — website packages and the Demo Framework boundary.
- `src/data/team.ts`, `src/data/professional.ts`, `src/data/professional-systems.ts` — people, career history, and attributed evidence.
- `src/components/ProjectSurfaces.tsx` — shared project presentation contract.
- `src/app/Document.tsx` — static document, metadata, and sitemap composition.
- `src/worker/index.ts` — compatibility and runtime routing.
- `src/styles/tokens.css` — the design system.
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
