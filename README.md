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

## Deployment

Cloudflare configuration lives in `wrangler.jsonc`. Use the production dry run before a release:

```bash
npm run deploy:production:dry-run
```
