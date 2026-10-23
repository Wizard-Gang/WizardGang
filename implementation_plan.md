# Implementation plan

## Open tasks

### WG-155 — [FEAT] Publish the Sri Lanka travel page at /sl

Add a noindex `/sl/` page, "What to Do in Sri Lanka", converted from the owner's 51-slide deck into one continuous scroll: every slide becomes a full-width section, in deck order, with no slide controls. Desktop keeps each slide's composition scaled to the viewport width; narrow screens reflow rows into columns. Port the slide styles to classes in the site stylesheet (no inline styles, CSP unchanged) and self-host DM Serif Display, DM Sans, Noto Sans Sinhala and Noto Sans Tamil. The 185 photos live in the `wizardgang` R2 bucket under `sl/`; bind it as `WG_R2` and have the Worker serve `GET /sl/media/<name>.webp` from that prefix only, immutable-cached, 404 for anything else. Keep the deck's photo credits section. The page stays out of the sitemap and the primary navigation. Update the public-contract tests for the second canonical page and the media route. No release, version change or deployment.

### WG-156 — [RELEASE] Release the Sri Lanka page as v1.7.0

Bump `package.json` and `package-lock.json` to 1.7.0 and publish through the governed release-tag, GitHub Release and protected `production` approval path. Hand back the exact pending run URL; the owner approves the deployment. Verify the live version, `/sl/` and a media object after approval.
