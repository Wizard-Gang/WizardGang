# WizardGang

WizardGang is Jacob Yongue's software engineering portfolio. It publishes project overviews, case studies, professional work, and portfolio assets at [wizardgang.ai](https://wizardgang.ai).

**[Live site](https://wizardgang.ai)** · **[Projects](https://wizardgang.ai/projects/)** · **[Professional work](https://wizardgang.ai/work/)**

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
5. Starts the same Vite build in watch mode. Shared React shell edits regenerate `dist/` without exposing a second browser-facing server, and watched local rebuilds keep the HTTP-only header sanitization intact.
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

React and TypeScript now own the shared production document shell: document/head metadata, skip navigation, Header, desktop/mobile navigation, Preferences markup, Footer, and shared outer composition. Vite performs the build-time React server render; the browser receives complete static HTML and does not load or hydrate a React client application.

Page-specific bodies still come from the legacy `src/site.mjs` generator during this controlled intermediate state. The build uses one explicit trusted compatibility boundary to insert those repository-authored body strings into the React shell without adding an extra DOM wrapper. Later page migrations can remove that boundary incrementally.

The authoritative production build remains:

```bash
npm run build
```

Frontend validation can also be run directly with:

```bash
npm run typecheck
npm run build:frontend
npm run check:frontend
```

`npm run build:frontend` is an alias for the same authoritative static build; there is no parallel migration site or public React test route. Vite writes only its server-side renderer artifact to the gitignored `tmp/frontend-shell/` directory while the generated production site is written to `dist/`.

Tailwind remains integrated through the Vite frontend toolchain and `src/styles/globals.css`, while the React shell deliberately preserves the existing `src/styles.css` and `src/portfolio-cleanup.css` presentation for this migration slice. Browser interaction remains in `public/assets/site.js` until a later controlled change.

## Verify

```bash
npm run build
npm run check
```

`npm run check` verifies the TypeScript/React/Vite/Tailwind production shell and then runs the generated-site, accessibility, Worker-routing, React-shell, and development-lifecycle acceptance suite.

## Structure

- `src/app/Document.tsx` owns the shared static production document and metadata composition.
- `src/components/SiteChrome.tsx` owns Header, navigation, Preferences, and Footer markup.
- `src/app/contracts.ts` defines the typed shell, metadata, navigation, and build contracts.
- `src/site.mjs` temporarily generates page-specific body HTML and page definitions only.
- `src/projects.mjs` contains project metadata.
- `src/professional.mjs` contains professional history.
- `src/worker/index.ts` is the TypeScript Worker authority for static delivery, compatibility redirects, and SharkTank proxy routing.
- `src/styles/globals.css` is the Tailwind entry point for frontend code; existing production presentation still comes from the legacy CSS files.
- `vite.config.ts` compiles the server-only React renderer and generates the canonical static site into `dist/`.
- `tsconfig.json` defines strict checking for new TypeScript and TSX sources.
- `scripts/` contains repeatable build, local-development, verification, and maintenance commands.
- `tests/` contains automated acceptance and development-control tests.

## Documentation & evidence

- [Ownership boundaries](docs/OWNERSHIP.md)
- [Boundary migration record](docs/BOUNDARY-MIGRATION.md)
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
