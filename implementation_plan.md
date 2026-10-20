# Implementation plan

## Open tasks

### WG-138 — [RELEASE] Publish the one-page WizardGang refresh as v1.4.0

- Dependency: WG-137 merged and resulting-main CI green.
- Scope: Release only the verified one-page site using the repository's immutable annotated `v1.4.0` tag, canonical GitHub Release and pinned baseline workflow. No direct Wrangler publish, DNS/settings/secrets change or bypass of protected production approval.
- Acceptance: Exact-head and post-merge CI green; canonical release/tag identity verified; authorized protected-environment approval recorded; Cloudflare rollout reaches 100%; live `https://wizardgang.ai/version.json` matches `wizardgang`, `1.4.0` and the released commit; live root responds with the anchored one-page content, old pages are 404, and runtime health/assets are checked. Document the actual evidence in the PR/release rather than inventing a PASS.
