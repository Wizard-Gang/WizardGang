# WizardGang

WizardGang is Jacob Yongue's software engineering portfolio. It publishes project overviews, case studies, professional work, and portfolio assets at [wizardgang.ai](https://wizardgang.ai).

**[Live site](https://wizardgang.ai)** · **[Projects](https://wizardgang.ai/projects/)** · **[Professional work](https://wizardgang.ai/work/)**

## Run locally

```bash
npm ci
npm run dev
```

`npm run dev` is the normal local-development entry point. It stays local-only and performs this checkout-scoped lifecycle:

1. Stops a stale Wrangler runtime previously started by this checkout, using ignored PID/process metadata under `tmp/dev/`.
2. Resets only generated `dist/` output and `tmp/dev/` runtime metadata.
3. Runs the existing `npm run build` build.
4. Removes HTTPS-only directives from the generated `dist/_headers` copy for plain-HTTP local development while leaving `public/_headers` unchanged for deployment.
5. Confirms the local Wrangler installation is available.
6. Starts `wrangler dev --local --ip 127.0.0.1` on port `8790` by default.
7. Waits until the site responds successfully at `http://127.0.0.1:8790`.
8. Opens the local URL in the default browser and remains attached to Wrangler for watch/hot-reload behavior.

Override the local port when needed:

```bash
WIZARDGANG_PORT=9123 npm run dev
```

If the requested port belongs to an unrelated process, startup fails with the port and available process information rather than terminating it. Running `npm run dev` again safely replaces the runtime previously started by the same checkout.

The reset is intentionally narrow. It removes `dist/` and `tmp/dev/`; it preserves source files, `public/`, documentation, `node_modules/`, `.dev.vars`, `.env`, `.wrangler/`, credentials, developer-authored fixtures, and anything outside this checkout. The repository currently has no disposable local database bootstrap or migration step.
Local development sanitizes only the generated `dist/_headers` file so HTTP loopback does not inherit HSTS or `upgrade-insecure-requests`. The production source file `public/_headers` is never modified.

Stop the local environment with `Ctrl-C` in the terminal running `npm run dev`. If that process is terminated abruptly, the next `npm run dev` invocation recovers stale runtime metadata before starting again.

## Verify

```bash
npm run build
npm run check
```

`npm run check` runs the existing generated-site verification and the checkout-scoped development-lifecycle tests.

## Structure

- `src/site.mjs` builds the site pages.
- `src/projects.mjs` contains project metadata.
- `src/professional.mjs` contains professional history.
- `src/worker.mjs` handles static delivery and compatibility redirects.
- `scripts/` contains repeatable build, local-development, verification, and maintenance commands.
- `tests/` contains automated development-control tests.

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
