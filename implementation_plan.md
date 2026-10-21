# Implementation plan

## Open tasks

### WG-144 — [CONTENT] Restore the concise historical integrations inventory

- Dependency: WG-143 merged and resulting-main CI green.
- Source of truth: The retired /solutions/ integration record at `src/data/professional-systems.ts` in commit `e7944ff21609d24d09e08df110bdd6aa3ac0383d`. The WG-141 narrative cases are not an authorized replacement for that historical inventory.
- Scope: Replace the lengthy invented case-study prose and outcome claims with a concise, scannable, category-and-platform inventory drawn from the actual old record. Explicitly preserve Shipium and other verifiable historic systems, employer-work attribution, root-only navigation, no-contact/email CTA, accessible mobile and 200% layouts, and Spanish. Retain the current typographic design; remove old cards/chips and unnecessary outbound product links.
- Acceptance: Cite precise historical provenance in source; tests protect legacy entries, prohibit invented case studies and email CTAs, verify root/404, translations, visual CSS constraints and security. Pinned install, full `npm run check`, focused tests, deploy dry-run, exact-head `verify`/`change-id`, squash merge and green resulting-main CI. No version change, release, or deployment.
