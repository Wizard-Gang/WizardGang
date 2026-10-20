# Implementation plan

## Open tasks

### WG-136 — [REFACTOR] Strip redundant presentation and client behavior

- Dependency: WG-135 merged and resulting-main CI green.
- Scope: Remove unreachable preview, case-study, dropdown/menu, and project-specific CSS/JS; trim unused typed authorities and component code. Refactor `src/styles/globals.css` toward a small, mobile-first page style with bounded content width, readable spacing, restrained zinc-and-accent palette, and reusable heading/button/section treatments. Retain `src/styles/tokens.css` as the sole token authority and current self-hosted font/license boundaries.
- Remove nonessential display widgets if doing so preserves expected accessibility and language support; do not sacrifice keyboard focus, text resizing, contrast, reduced-motion behavior, no-JS reading or real mobile navigation to shave code. Preserve statically rendered React + TypeScript, no SPA router and no hydration.
- Update frontend/browser/accessibility acceptance tests and all current-state README/docs so they describe the new design, not old previews or menus.
- Acceptance: No dead preview or retired product presentation in generated output, source imports or public assets; 320px and enlarged 200% text layouts have no horizontal overflow; desktop/phone interaction and reduced-motion checks pass; `npm run check`, exact-head CI and post-merge CI pass. No release or deployment.

### WG-137 — [TEST] Verify the lean single-page public contract

- Dependency: WG-136 merged and resulting-main CI green.
- Scope: Add or refine explicit acceptance for the four anchored sections, service copy and mail contact, employer attribution, accessible labels and focus, responsive and no-JS behavior, supported language behavior, generated page/sitemap inventory, 404 of retired paths, outbound link integrity, metadata, security header/CSP and the preserved `wg-edge` operational surface. Audit mobile and desktop presentation for clarity, visual consistency, and unnecessary dependencies.
- Acceptance: All focused tests and pinned `npm ci`, `npm run check`, `npm run deploy:dry-run`, source/patch/history integrity pass; exact-head CI, squash merge and resulting-main CI green. No release or production deployment.

### WG-138 — [RELEASE] Publish the one-page WizardGang refresh as v1.4.0

- Dependency: WG-137 merged and resulting-main CI green.
- Scope: Release only the verified one-page site using the repository's immutable annotated `v1.4.0` tag, canonical GitHub Release and pinned baseline workflow. No direct Wrangler publish, DNS/settings/secrets change or bypass of protected production approval.
- Acceptance: Exact-head and post-merge CI green; canonical release/tag identity verified; authorized protected-environment approval recorded; Cloudflare rollout reaches 100%; live `https://wizardgang.ai/version.json` matches `wizardgang`, `1.4.0` and the released commit; live root responds with the anchored one-page content, old pages are 404, and runtime health/assets are checked. Document the actual evidence in the PR/release rather than inventing a PASS.
