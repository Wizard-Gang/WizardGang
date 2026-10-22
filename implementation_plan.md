# Implementation plan

## Open tasks

### WG-146 — [FEAT] Replace public homepage with a panda picture

Replace the visible homepage at `/` with one accessible panda image, without navigation, portfolio copy, or other visible UI. Keep responsive layout, semantic alternative text, no external image dependencies, and existing security headers, 404 behavior, redirects, and wg-edge operational routes. Update frontend tests and current documentation to reflect the new public contract. Validate using canonical checks and a deployment dry-run; deliver through an exact-head verified squash merge.

### WG-147 — [RELEASE] Release and deploy panda homepage

After WG-146 is merged and resulting-main CI is green, follow the repository's immutable release identity and protected production deployment process. Update the version only as required by the release authority, create the governed release commit/tag and published GitHub Release, obtain required protected production approval, deploy, and verify 100% traffic and public `/version.json` at the released commit. Do not bypass required checks or environment approval.
