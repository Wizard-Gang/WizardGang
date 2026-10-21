# WizardGang

[WizardGang.ai](https://wizardgang.ai) is the company site for WizardGang. The public website is a single, scrollable engineering portfolio featuring selected integrations delivered in prior professional roles. It has no email solicitation or contact form.

```text
/                       #services, #integrations, #about
404.html                generated noindex fallback; not a canonical route
```

The navigation links directly to anchors on `/`. The retired `/solutions/`, `/projects/`, `/projects/hexframe/`, and `/about/` paths have no generated pages and fall through to the ordinary 404. No compatibility redirects are added. The Worker retains the outward shortcuts `/github`, `/compliance`, `/accessibility`, and `/security`. The `www` host redirects to the apex.

**[Live site](https://wizardgang.ai)**

## Architecture

WizardGang.ai is a static-first React and TypeScript application:

```text
React + TypeScript page composition
→ typed page registry
→ Vite static build
→ complete HTML + generated CSS/browser module
→ Cloudflare assets behind the wg-edge Worker shell
```

React renders complete static documents during the build. There is no client React hydration and no SPA router. Browser TypeScript progressively enhances language, display preferences, and mobile navigation.

The site runs as the `wizardgang` Worker on baseline's shared `wg-edge` shell, vendored verbatim under `platform/` and pinned by `platform/vendor.lock.json`. The shell runs before the assets on every request. It owns the host guard, the `www` → apex 308, TLS, `/version.json`, `/health.json`, `/robots.txt`, the `/admin` operator gate, security headers and errors. The TypeScript Worker adds the outward shortcuts and serves everything else from Cloudflare assets. Never edit `platform/`; re-vendor it from a merged baseline commit instead.

## Presentation

The site uses a mobile-first, light-default portfolio layout with dark/light preferences and two authored stylesheets:

- `src/styles/tokens.css` — the light/dark palette, blue interaction accent, display typography, spacing, radius and self-hosted fonts. It may declare only `:root` custom properties and `@font-face`.
- `src/styles/globals.css` — spacious portfolio presentation consuming those tokens, including integration case studies, enlarged text, contrast, reduced motion, mobile navigation and display preferences. The stylesheet contains only components used by the single-page site and the generated 404.

Instrument Sans is the primary typeface, with JetBrains Mono for machine-readable build information. Both remain self-hosted under the SIL Open Font License because the production CSP allows fonts only from the site origin.

## Content ownership

- Home — concise capabilities, substantive integrations from prior professional roles, and an about section, all in one document.
- Navigation — links to `/#services`, `/#integrations`, and `/#about`. Non-email links lead to official platform sites or developer profiles.
- Retired personal-project pages — not generated, listed or linked from company navigation. Independent project runtimes and their repositories are outside this site's deployment boundary.

Integration examples are explicitly attributed to previous professional roles, not WizardGang client engagements. The website does not invent customer endorsements, certifications, or delivered company engagements.

## Run locally

Install the locked dependencies and start the normal local environment:

```bash
npm ci
npm run dev
```

`npm run dev` is checkout-scoped. It:

1. stops stale Wrangler/Vite processes only when their saved process metadata proves they belong to this checkout;
2. resets generated `dist/`, `tmp/dev/`, and `tmp/frontend-shell/` state;
3. runs the production static build;
4. sanitizes only the generated local `dist/_headers` copy for plain HTTP;
5. starts Vite build watch;
6. starts `wrangler dev --local` at `http://127.0.0.1:8790`, presenting requests to the Worker as `https://wizardgang.ai` so the shell's host guard admits them;
7. waits for the Wrangler-served site to respond;
8. opens the local URL and remains attached to both required child processes.

Use another port when needed:

```bash
WIZARDGANG_PORT=9123 npm run dev
```

If a requested port belongs to an unrelated process, startup fails rather than terminating that process. Stop the environment with `Ctrl-C`.

Production security policy remains in `public/_headers`. Local development removes HSTS and `upgrade-insecure-requests` only from the generated `dist/_headers` copy; do not weaken `public/_headers` to make localhost work.

## WizardGang-specific controlled work

Use `WG-NNN` controlled IDs, branches named `wg-nnn-short-kebab-summary`, and `[WG-NNN] [TYPE] Imperative summary` for the commit and pull request. The required exact-head checks are `verify` and `change-id`. [Ownership](docs/OWNERSHIP.md), [information architecture](docs/INFORMATION-ARCHITECTURE.md), and the source authorities below govern site-specific changes. The first-parent history and committed queue checks run inside `npm run check`.

Normal merges do not create releases. Production is Cloudflare-only and is reached only from an accepted immutable release tag after GitHub Release publication and the protected `production` environment. The exact release and production identity path is documented below; ordinary process work does not publish or deploy.

## Build and verify

Build the complete static site:

```bash
npm run build
```

The build emits the static HTML pages, public assets, generated CSS/browser JavaScript and `sitemap.xml` into `dist/`. The sitemap is a projection of the page registry, never a second route list. It also writes the Worker entry `build/worker.mjs`, which hands the shell the release it serves at `/version.json`. A plain build is `0.0.0-dev` at the checked-out commit. Baseline's deploy workflow builds with `WG_VERSION` and `WG_COMMIT`, which must match `package.json` and the checkout.

The authoritative repository acceptance gate is:

```bash
npm run check
```

It includes the vendored `platform/` pin and `wrangler.jsonc` conformance checks (`npm run check:platform`), strict TypeScript checking, the production build, frontend-architecture authority, generated-page contracts, accessibility, browser behavior, project and solution ownership, Worker routing, local-development lifecycle, metadata, links, security/header boundaries, and bounded tracked-file and reachable-history credential scanning.

Useful focused checks include:

```bash
npm run test:accessibility
npm run test:frontend-authority
npm run test:navigation
npm run test:docs
```

## Source layout

```text
src/
  app/         document metadata, typed navigation, page registry
  browser/     progressive enhancement for display/language and mobile navigation
  components/  shared header, preferences and footer
  data/        company contact and outward links
  pages/       Home and NotFound
  styles/      tokens and CSS
  worker/      redirects and asset handler
platform/      pinned baseline wg-edge Worker shell; never edit it here
scripts/       builds, local development and verification
tests/         repository acceptance
public/        static branding, fonts and security headers
docs/          current architecture, ownership and accessibility records
```

Key authorities:

- `src/app/pageRegistry.ts` — the two generated HTML outputs (root and 404).
- `src/app/navigation.ts` — root fragment navigation.
- `src/pages/Home.tsx` — services, selected integrations and about; no public mailto links.
- `src/app/Document.tsx` — static document, metadata and derived sitemap.
- `src/styles/tokens.css` and `src/styles/globals.css` — presentation.
- `src/worker/index.ts` — outward shortcuts and asset fallback.
- `public/_headers` — production security headers.
- `vite.config.ts` — static build pipeline.

## Documentation

- [Current information and technical architecture](docs/INFORMATION-ARCHITECTURE.md)
- [Source and system ownership](docs/OWNERSHIP.md)
- [Accessibility](docs/ACCESSIBILITY.md)
- [Compliance management record](docs/COMPLIANCE.md)
- [Security policy](SECURITY.md)

## Deployment

`wrangler.jsonc` declares the one `wizardgang` Worker: custom domains `wizardgang.ai` and `www.wizardgang.ai`, the assets and the shared `WG_OPS_TOKEN` and `WG_SESSION_KEY` from the Secrets Store. There is no staging Worker. Validate deploy packaging without publishing:

```bash
npm run deploy:dry-run
```

Production has no checkout-owned deploy command. Canonical CI waits for the exact immutable GitHub Release, then calls baseline's `deploy-worker.yml`, pinned to the same baseline commit as `platform/`, with the tag and its commit. The call passes `secrets: inherit`, because a called workflow sees only the secrets its caller passes; this repository keeps no repository-level secrets, so only the `production` environment's `CLOUDFLARE_API_TOKEN` reaches it. The call grants `actions: read` and `contents: read`, because that workflow does not run `npm run check` again: it re-verifies the tag, proves from the Actions API that this run's `verify` job ran `npm ci` and `npm run check` at the tag commit and that the Release is published, and runs the conformance checks. So the CI `verify` job is the one job before the call that reproduces the commit, and the run must be at the tag commit. The workflow then enters this repository's protected `production` environment and deploys with the locked Wrangler. It confirms that the new version serves 100% of traffic and that public `/version.json` reports `wizardgang`, the release version and the tag commit. A workflow dispatch at a release tag ref reruns that tag: it verifies, never creates, the existing Release and deploys it after the production review. Rollback is such a run at the previous tag, which works only for tags whose own `ci.yml` has this shape. No dispatch deploys a tag from another commit. Cloudflare tokens are minted, rotated and discovered with baseline's runbooks and tooling, not from this repository.

## GitHub auto-merge

The committed repository settings enable per-PR auto-merge. Enabling this repository capability does not enroll a PR: an authorized contributor chooses auto-merge for that PR. GitHub then waits for required reviews and exact-head checks and uses the repository's squash-only merge policy. Run `npm run verify:github-settings` for a read-only live check; `npm run apply:github-settings` applies the committed authority and independently verifies it.
