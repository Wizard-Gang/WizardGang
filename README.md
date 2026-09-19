# WizardGang

WizardGang publishes inspectable software projects, clearly attributed systems and integration experience, and reusable engineering solutions at [wizardgang.ai](https://wizardgang.ai). The Home page, global navigation, and About → Company / Team hierarchy are company-first. Detailed career content remains on `/work/`, while Projects and Services remain on their current transitional routes until later controlled migrations.

**[Live site](https://wizardgang.ai)** · **[Software](https://wizardgang.ai/software/)** · **[Solutions](https://wizardgang.ai/solutions/)**

## Run locally

```bash
npm ci
npm run dev
```

`npm run dev` is the normal local-development entry point. It stays local-only and performs this checkout-scoped lifecycle:

1. Stops stale Wrangler and frontend-watch processes previously started by this checkout, using ignored PID/process metadata under `tmp/dev/`.
2. Resets only generated `dist/`, `tmp/dev/`, and `tmp/frontend-shell/` state.
3. Runs the authoritative static production build. Vite compiles the server-only React shell renderer and writes the complete static site to `dist/`.
4. Removes HTTPS-only directives from the generated `dist/_headers` copy for plain-HTTP local development while leaving `public/_headers` unchanged for deployment.
5. Starts the same Vite build in watch mode. React page, typed site/project/professional data, shared component, or browser TypeScript edits regenerate `dist/` without exposing a second browser-facing server, and watched local rebuilds keep the HTTP-only header sanitization intact.
6. Safely validates the requested public port, then starts `wrangler dev --local --ip 127.0.0.1` on port `8790` by default.
7. Waits until the actual Wrangler-served WizardGang site responds successfully at `http://127.0.0.1:8790`.
8. Opens that URL in the default browser and supervises both required child processes until the environment is stopped.

Override the local port when needed:

```bash
WIZARDGANG_PORT=9123 npm run dev
```

If the requested port belongs to an unrelated process, startup fails with the port and available process information rather than terminating it. Running `npm run dev` again safely replaces only stale Wrangler/frontend processes proven to belong to the same checkout; unrelated Node, Vite, Wrangler, or other processes are never intentionally killed.

The reset is intentionally narrow. It removes `dist/`, `tmp/dev/`, and the disposable `tmp/frontend-shell/` build; it preserves source files, `public/`, documentation, `node_modules/`, `.dev.vars`, `.env`, `.wrangler/`, credentials, developer-authored fixtures, and anything outside this checkout. The repository currently has no disposable local database bootstrap or migration step.
Local development sanitizes only the generated `dist/_headers` file so HTTP loopback does not inherit HSTS or `upgrade-insecure-requests`. The production source file `public/_headers` is never modified.

Stop the local environment with `Ctrl-C` in the terminal running `npm run dev`. The orchestrator stops both checkout-owned child processes together. If the process is terminated abruptly, the next `npm run dev` invocation recovers stale owned runtime metadata before starting again.

## Frontend architecture

React and TypeScript own the shared production document shell: document/head metadata, skip navigation, Header, desktop/mobile navigation, Preferences markup, Footer, and shared outer composition. TypeScript/Vite also owns first-party browser behavior for preferences, language, and mobile-navigation enhancement. The browser receives complete static HTML plus one small generated module and does not load or hydrate a React client application.

React/TypeScript owns every canonical production page body, including Home, Projects and case studies, Work, About, Services, the staged Software and Solutions navigation landings, Glossary, and the static 404 page. A single typed page registry feeds the static renderer. Home consumes the canonical typed project data/components and derives its systems summary from the professional-systems authority rather than duplicating project or career facts.

The shared primary navigation is company-first: About, Software, and Solutions, with Home on the WizardGang wordmark. About now owns `/about/`, `/about/company/`, `/about/team/`, and the concise `/about/team/jacob/` profile; detailed professional history intentionally remains canonical at `/work/` until its next controlled migration. `/software/` and `/solutions/` remain narrow transitional orientation pages, while `/projects/` and `/services/` remain canonical until their later migrations.

The authoritative production build remains:

```bash
npm run build
```

Frontend validation can also be run directly with:

```bash
npm run typecheck
npm run check:frontend
```

There is one authoritative static build. Vite compiles the server-side React renderer, processes `src/styles/globals.css`, emits the first-party browser module and stylesheet, and publishes the generated site to `dist/` through the repository build pipeline. There is no parallel frontend build or public React test route.

Tailwind is integrated through the Vite frontend toolchain without replacing authored CSS that is clearer for project-preview animation, accessibility states, and specialized responsive layouts. Browser behavior lives under `src/browser/`; Vite emits the hashed first-party browser module consumed by the static React document.

## Verify

```bash
npm run build
npm run check
```

`npm run check` is the authoritative repository acceptance gate. It verifies TypeScript, the Vite production build, frontend authority, canonical pages, content, accessibility, browser behavior, Worker routing, the development lifecycle, security boundaries, links, and metadata.

Run focused authority checks independently with:

```bash
npm run test:frontend-authority
npm run test:navigation
npm run test:home
npm run test:about
```

## Structure

- `src/app/Document.tsx` owns the shared static production document and metadata composition.
- `src/components/SiteChrome.tsx` owns Header, navigation, Preferences, and Footer markup.
- `src/app/contracts.ts` defines the typed shell, metadata, navigation, and build contracts.
- `src/app/navigation.ts` is the single typed primary-navigation and current-section authority.
- `src/browser/` owns first-party browser preferences, language behavior, and mobile-navigation enhancement in TypeScript.
- `src/data/projects.ts` owns typed project metadata and relationships.
- `src/data/professional.ts` owns typed professional roles, project history, and skills.
- `src/data/professional-systems.ts` owns typed systems, integrations, and deployment references.
- `src/data/team.ts` owns the current typed WizardGang team-member relationship.
- `src/data/site.ts`, `src/data/services.ts`, and `src/data/glossary.ts` own structured current-site data where reuse or repeated records justify it.
- `src/pages/` owns every canonical production page body in React/TypeScript.
- `src/app/pageRegistry.ts` is the typed output/route registry for the current 18 canonical static HTML files.
- `src/worker/index.ts` is the TypeScript Worker authority for static delivery, compatibility redirects, and SharkTank proxy routing.
- `src/styles/globals.css` is the single production stylesheet authority for Tailwind integration and authored presentation CSS.
- `vite.config.ts` compiles the server-only React renderer and generates the canonical static site into `dist/`.
- `tsconfig.json` defines strict checking for new TypeScript and TSX sources.
- `scripts/` contains repeatable build, local-development, verification, and maintenance commands.
- `tests/` contains automated acceptance and development-control tests.

## Documentation & evidence

- [Ownership boundaries](docs/OWNERSHIP.md)
- [Approved company-first information architecture](docs/INFORMATION-ARCHITECTURE.md) — target contract; company-first navigation, Home, and About → Company / Team are implemented. Career detail remains transitional at `/work/`; Software, Solutions, and later route migrations remain staged.
- [Portfolio governance record](docs/COMPLIANCE.md)
- [Accessibility record](docs/ACCESSIBILITY.md)
- [Security reporting](SECURITY.md)
- [Architecture compliance and assurance evidence](https://demo.wizardgang.ai/compliance)

## Deployment

Cloudflare configuration lives in `wrangler.jsonc`. Local development uses the base configuration with `wrangler dev --local`; it does not deploy or select the staging or production environments. Use the production dry run before a release:

```bash
npm run deploy:production:dry-run
```

## Shared Cloudflare token rotation

Preview every active repository or protected environment that stores or references the shared GitHub Actions token:

```bash
npm run secrets:cloudflare:discover
```

Rotate all discovered targets in one interactive pass:

```bash
npm run secrets:cloudflare:rotate
```

The rotation command requires authenticated `gh`, plus `jq` and `curl`. It reads the token twice without echo, validates it with Cloudflare, displays every target, and requires an explicit `ROTATE` confirmation. The token is never written to disk or passed as a command-line argument. Use `npm run secrets:cloudflare:rotate -- --dry-run` for a read-only preview.
