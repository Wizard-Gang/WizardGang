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
2. Resets only generated `dist/`, `tmp/dev/`, and `tmp/frontend-foundation/` state.
3. Runs the finite frontend foundation build and the existing authoritative `npm run build` site build.
4. Removes HTTPS-only directives from the generated `dist/_headers` copy for plain-HTTP local development while leaving `public/_headers` unchanged for deployment.
5. Starts the Vite frontend build watcher in the background. It writes only to `tmp/frontend-foundation/` and does not expose a second browser-facing server.
6. Safely validates the requested public port, then starts `wrangler dev --local --ip 127.0.0.1` on port `8790` by default.
7. Waits until the actual Wrangler-served WizardGang site responds successfully at `http://127.0.0.1:8790`.
8. Opens that URL in the default browser and supervises both required child processes until the environment is stopped.

Override the local port when needed:

```bash
WIZARDGANG_PORT=9123 npm run dev
```

If the requested port belongs to an unrelated process, startup fails with the port and available process information rather than terminating it. Running `npm run dev` again safely replaces only stale Wrangler/frontend processes proven to belong to the same checkout; unrelated Node, Vite, Wrangler, or other processes are never intentionally killed.

The reset is intentionally narrow. It removes `dist/`, `tmp/dev/`, and the disposable `tmp/frontend-foundation/` build; it preserves source files, `public/`, documentation, `node_modules/`, `.dev.vars`, `.env`, `.wrangler/`, credentials, developer-authored fixtures, and anything outside this checkout. The repository currently has no disposable local database bootstrap or migration step.
Local development sanitizes only the generated `dist/_headers` file so HTTP loopback does not inherit HSTS or `upgrade-insecure-requests`. The production source file `public/_headers` is never modified.

Stop the local environment with `Ctrl-C` in the terminal running `npm run dev`. The orchestrator stops both checkout-owned child processes together. If the process is terminated abruptly, the next `npm run dev` invocation recovers stale owned runtime metadata before starting again.

## Frontend migration foundation

TypeScript, React, Vite, and Tailwind CSS are available for incremental frontend migration, but they do not own production rendering yet.

The existing generated-site build remains authoritative:

```bash
npm run build
```

The isolated migration harness can still be checked directly with:

```bash
npm run typecheck
npm run build:frontend
npm run check:frontend
```

`npm run build:frontend` builds only the migration harness under `src/app/foundation/` and writes disposable output to the gitignored `tmp/frontend-foundation/` directory. It does not write to `dist/`, does not create a public route, and is not part of the Cloudflare deployment input.

During normal `npm run dev`, that same Vite configuration runs in build-watch mode automatically so TypeScript/React/Tailwind source changes rebuild the disposable frontend foundation without a second terminal, server, or browser URL. Tailwind is integrated through its Vite plugin and `src/styles/globals.css`. Existing `src/styles.css` and `src/portfolio-cleanup.css` remain the styles for generated production pages.

## Verify

```bash
npm run build
npm run check
```

`npm run check` verifies the TypeScript/React/Vite/Tailwind foundation and then runs the generated-site, accessibility, Worker-routing, and development-lifecycle acceptance suite.

## Structure

- `src/site.mjs` builds the current production site pages.
- `src/projects.mjs` contains project metadata.
- `src/professional.mjs` contains professional history.
- `src/worker/index.ts` is the TypeScript Worker authority for static delivery, compatibility redirects, and SharkTank proxy routing.
- `src/app/foundation/` contains the disposable React migration harness.
- `src/styles/globals.css` is the Tailwind entry point for new frontend code.
- `vite.config.ts` isolates Vite output from the production `dist/` build.
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
