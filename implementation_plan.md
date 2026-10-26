# Implementation plan

## Open tasks

### WG-162 — [FIX] Show one v in the footer version and drop the duplicate source link

The live footer reads `vv1.7.1`: `SiteFooter` in `src/components/SiteChrome.tsx` prefixes `v` to `build.release`, which already carries it (the `vX.Y.Z` release identity from `scripts/release-identity.mjs`). Its published-release test expects bare semver, so the version never links to its GitHub Release. Show `build.release` as it is and test it against `vX.Y.Z`, so a release build shows `v1.7.1` linked to `/releases/tag/v1.7.1` and a development build shows `0.0.0-dev` unlinked. Remove the footer's "Demo source" link, which repeats the header's GitHub icon link to the same URL; the headerless `/sl` page loses it too, which the owner accepted on 2026-10-25. Drop the now-unused "Demo source" translation in `src/browser/translations.ts` and update the footer assertions in `tests/accessibility-contract.test.mjs`. No release, version change or deployment.
