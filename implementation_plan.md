# Implementation plan

## Open tasks

### WG-167 — [FIX] Fit the /sl page to phone orientation and show its photo-backed headings

On a phone turned sideways (for example 844×390), `/sl` still applies the portrait reflow, because the stylesheet switches it on width alone (`max-width: 899px`); `src/browser/deck.ts` then zooms the 1000px reflow to 0.844, so headings fill the screen and each slide runs two to three screens tall. Apply the reflow only to narrow viewports no wider than 4:3, so landscape phones show each slide's 16:9 composition fitted to the width, as on desktop. Keep the deck refitting on every resize and orientation change, and make the no-script stepped zoom fit landscape phones and widths from 900px to 1099px instead of clipping them. The "The basics of Sri Lanka" and "Ayubowan" headings are hidden at every width: they sit in flow under their absolutely positioned photo and gradient, which paint above them. Paint each slide's children in document order, as the deck does, so those headings show. In the narrow reflow, keep the `close` photo inside its slide (it now collapses to a 115px strip and spills over the credits), as `basics` already does. Cover it in `tests/browser-behavior.test.mjs`, or the contract test that owns the deck, with portrait, landscape and rotation checks. No release, version change or deployment.

### WG-168 — [RELEASE] Release the updated /sl page as v1.7.3

Bump `package.json` and `package-lock.json` from 1.7.2 to 1.7.3 so WG-166 and WG-167 reach wizardgang.ai through the protected `production` approval. Before merging, confirm that `https://wizardgang.ai/sl/media/<name>.webp` returns 200 for all 32 new photos. The release must not ship slides whose photos are missing from R2.
