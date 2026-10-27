# WizardGang.ai current architecture

Status: current-state authority for the public site structure, content ownership, canonical routes, and frontend/runtime boundaries.

## Public hierarchy

One canonical public document: `/`. The navigation targets `/#capabilities`, `/#integrations` and `/#about` in that document; Industries (`#industries`) and Delivery experience (`#delivery`) sit between them on the same page. The only other generated HTML is the noindex `/sl/` travel page, "What to Do in Sri Lanka" (the owner's deck as one continuous scroll, outside the navigation and sitemap, rendered without the site header or footer), and the ordinary noindex `404.html`. The `/sl` photos are not static assets: the Worker reads them from the shared `wizardgang` R2 bucket under `sl/` at `/sl/media/<8 hex>.webp`, read-only, and answers 404 for anything else under `/sl/media/`. Retired `/solutions/`, `/projects/`, `/projects/hexframe/` and `/about/` paths are not rendered and return the normal asset 404 without a compatibility redirect.

`src/app/pageRegistry.ts` is the generated-page inventory; `sitemap.xml` is a projection of it, with `/` as its sole entry. `src/app/navigation.ts` is the only primary navigation authority. Both desktop and mobile menus use real anchors; mobile is visible without JavaScript and becomes button-controlled when enhancement runs. There are no dropdown submenus.

## Content ownership

`src/pages/Home.tsx` renders the page from `src/data/portfolio.ts`. Capabilities are WizardGang's own and link to their live demonstrations on `demo.wizardgang.ai`. Industries, the eight compact historical integration rows and the deployments grouped by employer (Supply Chain Technologies, Spartan Technology Solutions and Fastfetch Corporation) are grounded in the retired `src/data/professional-systems.ts` at commit `e7944ff21609d24d09e08df110bdd6aa3ac0383d` and represent prior professional roles. This work is not presented as WizardGang client engagements or as case studies. Deployed organizations link to their own websites, and courts to a map search; vendor marks are not links. There is no Contact section or public email CTA. The header links the architecture demo and its source repository, About links LinkedIn, and the footer links the release and build commit on GitHub; personal-project galleries and software previews are not published here.

Independent products and `demo.wizardgang.ai` retain their own code, runtime and operating evidence outside this repository. This site does not claim another organization's project as a WizardGang engagement.

## Presentation and accessibility

`src/styles/tokens.css` declares only `:root` custom properties and `@font-face`. `src/styles/globals.css` uses a restrained, type-led, light-default portfolio presentation with generous spacing inspired by Phantom Insights; no third-party assets or licensed fonts are copied. Instrument Sans and JetBrains Mono remain self-hosted under the SIL Open Font License. Preferences support English/Spanish, optional dark theme, readable layout and 200% text. Reduced motion follows the system preference; enlarged text must produce zero horizontal overflow.

The complete page, navigation, main heading, integration examples, section anchors and portfolio links exist before JavaScript. The browser enhances menu controls and saved preferences only. There is no SPA router and no React hydration.

## Route policy

The canonical site identity is path-based. `/` has canonical metadata. The noindex 404 has no canonical URL, is not in the sitemap, and is the fallback for previously published pages. The noindex `/sl/` page likewise has no canonical URL and is not in the sitemap.

Compatibility redirects have been retired. Removed public pages `/solutions/`, `/projects/`, `/projects/hexframe/`, `/about/`, and older routes fall through to the ordinary 404 when absent from generated assets. `/github`, `/compliance`, `/accessibility`, and `/security` have permanent outward shortcuts to their existing external owners; none of them were ever pages on this site.

## Technical architecture

```text
React + TypeScript static document
→ typed page registry and navigation
→ Vite static build
→ HTML + CSS + browser TypeScript bundle in dist/
→ wg-edge Worker shell, pinned under platform/
→ TypeScript site Worker and Cloudflare static assets
```

`src/app/Document.tsx` renders complete static HTML with `react-dom/server`. `src/worker/index.ts` keeps only outward shortcuts and asset fallback. The pinned `wg-edge` shell owns the host guard, TLS, `www` redirect, `/version.json`, `/health.json`, `/robots.txt`, `/admin` access boundary, security headers and error handling. The single production Worker is configured by `wrangler.jsonc`. No changes here alter `platform/`, secrets, production bindings or release identity.

## Local development and verification

Run `npm ci`, then `npm run dev` to start Vite watching and local Wrangler at `http://127.0.0.1:8790`. `WIZARDGANG_PORT` may change the port. The checkout-scoped dev lifecycle only terminates processes it owns. Production headers remain authored in `public/_headers`, and dev sanitizes only `dist/_headers` for local HTTP.

`npm run check` verifies strict TypeScript, the static build, page/fragment/link metadata, responsive accessibility controls, current authorities, documented behavior, Worker routes, release/deployment boundaries, secrets, and controlled Git history. Current functionality is tested, not copied from removed pages. The production path remains through protected GitHub release and Cloudflare deployment, not a direct local deploy.
