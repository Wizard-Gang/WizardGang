# WizardGang

WizardGang is Jacob Yongue's software engineering portfolio. It publishes project overviews, case studies, professional work, and portfolio assets at [wizardgang.ai](https://wizardgang.ai).

**[Live site](https://wizardgang.ai)** · **[Projects](https://wizardgang.ai/projects/)** · **[Professional work](https://wizardgang.ai/work/)**

## Run locally

```bash
npm ci
npm run dev
```

The local Worker serves the generated static site on port 8790.

## Verify

```bash
npm run build
npm run check
```

## Structure

- `src/site.mjs` builds the site pages.
- `src/projects.mjs` contains project metadata.
- `src/professional.mjs` contains professional history.
- `src/worker.mjs` handles static delivery and compatibility redirects.
- `scripts/` contains build and verification commands.

## Documentation

- [Ownership boundaries](docs/OWNERSHIP.md)
- [Boundary migration record](docs/BOUNDARY-MIGRATION.md)
- [Compliance management record](docs/COMPLIANCE.md)
- [Accessibility record](docs/ACCESSIBILITY.md)
- [Security reporting](SECURITY.md)

## Deployment

Cloudflare configuration lives in `wrangler.jsonc`. Use the production dry run before a release:

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
