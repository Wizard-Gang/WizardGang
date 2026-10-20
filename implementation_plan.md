# Implementation plan

## Open tasks

### WG-137 — [TEST] Verify the lean single-page public contract

- Dependency: WG-136 merged and resulting-main CI green.
- Scope: Add or refine explicit acceptance for the four anchored sections, service copy and mail contact, employer attribution, accessible labels and focus, responsive and no-JS behavior, supported language behavior, generated page/sitemap inventory, 404 of retired paths, outbound link integrity, metadata, security header/CSP and the preserved `wg-edge` operational surface. Audit mobile and desktop presentation for clarity, visual consistency, and unnecessary dependencies.
- Acceptance: All focused tests and pinned `npm ci`, `npm run check`, `npm run deploy:dry-run`, source/patch/history integrity pass; exact-head CI, squash merge and resulting-main CI green. No release or production deployment.

### WG-138 — [RELEASE] Publish the one-page WizardGang refresh as v1.4.0

- Dependency: WG-137 merged and resulting-main CI green.
- Scope: Release only the verified one-page site using the repository's immutable annotated `v1.4.0` tag, canonical GitHub Release and pinned baseline workflow. No direct Wrangler publish, DNS/settings/secrets change or bypass of protected production approval.
- Acceptance: Exact-head and post-merge CI green; canonical release/tag identity verified; authorized protected-environment approval recorded; Cloudflare rollout reaches 100%; live `https://wizardgang.ai/version.json` matches `wizardgang`, `1.4.0` and the released commit; live root responds with the anchored one-page content, old pages are 404, and runtime health/assets are checked. Document the actual evidence in the PR/release rather than inventing a PASS.
