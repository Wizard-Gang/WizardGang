# Implementation plan

## Open tasks

### WG-172 — [CONTENT] Tear down the /sl travel page and release v1.8.0

On 2026-11-01 the owner asked to tear down wizardgang.ai/sl and purge it from R2. Remove everything the /sl page added in WG-155, WG-159, WG-166, WG-167 and WG-170: `src/pages/SriLanka.tsx`, `src/pages/SriLankaSlides.tsx`, `src/styles/sl.css` and its `globals.css` import, the deck's font faces in `tokens.css` and their files and OFL entries under `public/fonts/`, the deck script in `src/browser/`, the page's `pageRegistry.ts` entry, the `hideSiteHeader` and `hideSiteFooter` switches that only /sl sets, the Worker's `/sl/media/` route and `WG_R2` type, and the `WG_R2` binding in `wrangler.jsonc`, which only /sl reads. Every generated page then carries the site header and footer again, `/sl/` and `/sl/media/*` return the normal asset 404 like the other retired paths, and the site binds no R2 bucket. Update `README.md`, `docs/INFORMATION-ARCHITECTURE.md` and the contract tests that list, exempt or exercise /sl. Bump `package.json` and `package-lock.json` from 1.7.4 to 1.8.0. After production serves v1.8.0 and `/sl/` returns 404, the owner deletes every object under `sl/` in the shared `wizardgang` R2 bucket, leaving the other prefixes alone, and the delivery confirms that `sl/` lists empty. The repository never held the photos, so nothing is purged from Git.
