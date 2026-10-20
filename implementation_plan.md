# Implementation plan

## Open tasks

### WG-134 — [FEAT] Replace the home page with a service-first single-page narrative

- Dependency: WG-133 controlled plan-only queue change merged with green resulting-main CI.
- Goal: Make `/` useful from top to bottom without requiring a second page, taking inspiration from phantom.im's direct small-agency presentation but retaining WizardGang's own identity and copy.
- Scope: Rebuild the home content as five readable sections in order: (1) short, concrete hero, (2) four service offerings — custom software, system integrations, data and reporting, workflow automation — (3) concise enterprise experience, (4) brief about/approach, and (5) direct contact. Use stable fragment IDs `#services`, `#experience`, `#about`, and `#contact`. Each service gets a useful one-sentence outcome, not a product taxonomy, certification claim, or wall of logos. Feature one prominent `mailto:jacob@wizardgang.ai` action.
- Content: Speak to prospective clients, not to employers or game players. Enterprise warehouse, WMS/WCS, ERP, logistics, reporting, public-sector applications and system-integration background may support capability claims, but experience performed while employed elsewhere must be explicitly distinguished from WizardGang client work. Do not invent clients, testimonials, credentials, certifications, results, revenue, or endorsements.
- Exclusions: Do not feature, mention, preview, or link to Hexframe, SharkTank, YarReader, other personal games, or portfolio case studies on the new home page. No pricing table, form backend, animation-driven hero, social proof without permission, or multi-page call-to-action.
- Transitional boundary: Existing legacy pages, navigation, and controls may remain temporarily functional until WG-135/WG-136. Keep existing public paths and tests valid for this scoped change; do not republish or deploy.
- Acceptance: The generated homepage reads as one complete, coherent scroll; all four fragment targets and contact action exist; semantic headings and responsive layouts work without client JS; focused content, accessibility, navigation and link tests and canonical `npm run check` pass; exact-head `verify` and `change-id` pass; squash merge, resulting-main CI, branch cleanup. No release or production deployment.

### WG-135 — [REFACTOR] Make the root the only canonical company page

- Dependency: WG-134 merged and resulting-main CI green.
- Scope: Point the primary navigation at `/#services`, `/#experience`, `/#about` and `/#contact` (or same-page fragments), with a simple desktop and accessible mobile treatment; remove hover/focus dropdown submenus. Collapse `src/app/pageRegistry.ts` to `index.html` plus the ordinary noindex `404.html`, and derive a sitemap with only `/`.
- Retire `/solutions/`, `/projects/`, `/projects/hexframe/`, and `/about/` from generated page inventory; return normal 404 for former pages, not an invented forwarding chain. Remove first-party links to those paths, the Hexframe case study/project catalog and live project preview UI, associated dead source/data/assets and any orphaned references to SharkTank/YarReader. Do not touch the actual external project repositories or independent app deployments.
- Preserve necessary honest attribution and public company contact. Keep `/github`, `/compliance`, `/accessibility` and `/security` outward shortcuts only where their existing destination remains valid; preserve shared `wg-edge` behavior, host guard, `www` redirect, `/health.json`, `/version.json`, operator gate, CSP and secrets boundary.
- Acceptance: Generated route inventory is exactly root + noindex 404; old paths are absent from sitemap and public navigation, tested as unsupported; both keyboard and touch navigation reach real fragment IDs; no dead imports/assets; update authoritative tests/docs with the new real state; `npm run check`, exact-head CI and post-merge CI pass. No release or deployment.

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
