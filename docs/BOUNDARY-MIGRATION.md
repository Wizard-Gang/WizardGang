# WizardGang boundary migration

Inventory date: 2026-08-28 (America/New_York)

## CURRENT ROUTE MAP

### Ownership and deployment

- `wizardgang.ai` is a Cloudflare Worker Custom Domain owned by Worker `wizardgangprod` in
  `../WizardGangLocal`.
- The active deployment inspected through Wrangler is version
  `d6bb01fd-3f2c-492c-8542-b889e893fe53`, created 2026-08-28T16:38:08Z.
- The Worker currently combines four concerns: the WizardGang portfolio, the Shark Tank client,
  the Shark Tank HTTP/WebSocket API, and the Shark Tank trust/operations estate.
- Its production bindings include `ROOM` and `LOBBY` Durable Objects, `R2_ASSETS`, a daily cron,
  static game assets, version metadata, and operator secrets.
- Static assets use `run_worker_first: true`. Unknown routes no longer receive the SPA: only
  `/play/`, `/ts[/]`, `/php[/]`, `/assets/*`, and `/og.png` may reach the asset binding. Other
  unknown paths receive a real portfolio 404.
- `shadowmoney.wizardgang.ai` is live on Worker `shadowmoney` from `../ShadowMoney`.
- `sharktank.wizardgang.ai` and `hexframe.wizardgang.ai` did not resolve during the live check.
- `../Hexframe/wrangler.jsonc` declares `hexframe.wizardgang.ai` as a production Custom Domain,
  but the `hexframe` Worker does not yet exist in the product account.

### Portfolio routes currently embedded in the Shark Tank Worker

| Route | Current behavior |
| --- | --- |
| `/` | WizardGang portfolio homepage |
| `/work/shadowmoney/` | ShadowMoney case study |
| `/work/yarreader/` | YarReader case study |
| `/work/shark-tank/` | Shark Tank case study |
| `/resume/` | Portfolio resume page |
| `/styles/portfolio-*.css` | Embedded portfolio stylesheet |
| `/robots.txt` | Portfolio crawler policy |
| `/sitemap.xml` | Portfolio plus `/play/` sitemap |
| `/og.png` | Shared portfolio/game social asset |

Slashless case-study and resume routes permanently redirect to their trailing-slash form.

### Shark Tank public application and interface routes

| Surface | Routes |
| --- | --- |
| Game documents | `/play/`, `/ts[/]`, `/php[/]` |
| Game assets | `/assets/*` |
| Realtime | `/room/:id/ws`, `/php-room` |
| PHP compatibility facade | `/php-api`, `/php-api/*` |
| Core API | `/api/health`, `/api/tank`, `/api/lobby`, `/api/leaderboard`, `/api/profile` |
| Public writes | `POST /api/profile`, `POST /api/audit`, `POST /api/security-report` |
| API documentation | `/docs[/]`, `/docs/openapi.json`, `/openapi.json` |
| Trust index | `/trust[/]` |
| Operations | `/status[/]`, `/status.json` |
| Delivery | `/roadmap.json`; `/roadmap[/]` redirects to `/status/#delivery` |
| Incidents | `/incidents.json`; `/incidents[/]` redirects to `/status/#incidents` |
| Spend | `/spend[/]`, `/spend.json`; `/inquiry[/]` redirects to `/spend/`; `/inquiry.json` aliases `/spend.json` |
| Evidence logs | `/logs[/]`, `/logs.json`, `/logs/game/:id.txt` |
| Conformance | `/audit[/]`, `/audit/manifest.json` |
| Governance | `/policies[/]`, `/policies.json`, `/policies/:document[/]` |

The governance document slugs are `context`, `security-policy`, `roles`, `risk-assessment`,
`risk-treatment`, `statement-of-applicability`, `risk-treatment-plan`, `objectives`,
`access-and-suppliers`, `legal-register`, `secure-development`, `ai-policy`, `ai-lifecycle`,
`documented-information`, `nonconformity`, `asset-inventory`, `continuity`,
`operating-records`, `operational-planning`, and `audit-and-review`.

### Shark Tank protected routes

The Worker requires operator authentication for `/admin`, every `/admin/*` route, and the legacy
private audit aliases below. The public `/audit/` page is not protected.

| Surface | Routes |
| --- | --- |
| Operator UI | `/admin[/]` |
| Controls | `POST /admin/maintenance`, `/admin/billing-reset`, `/admin/security-report`, `/admin/security-resolve`, `/admin/test-alert` |
| Backend switch | `/admin/switch` |
| Full status | `/admin/status.json`, legacy alias `/audit/status.json` |
| Backup and restore | `/admin/backup.json`, `POST /admin/backup/run`, `POST /admin/backup/drill` |
| Service log | `/admin/log.json`, `/admin/log.jsonl`, legacy aliases `/audit.json`, `/audit.jsonl` |
| Room log | `/admin/game/:id[.json|.jsonl]`, legacy alias `/audit/game/:id[.json|.jsonl]` |
| Replay | `/admin/replay/:id[.json]`, legacy alias `/audit/replay/:id[.json]` |

### Current retired-route behavior

`/arena*`, `/uno*`, `/x4*`, `/21*`, `/game*`, `/checkers*`, `/battleship*`, `/3d*`, and
`/shark-run*` redirect to the portfolio root. They are not portfolio projects and will remain
retired.

## TARGET ROUTE MAP

```text
wizardgang.ai
├── /                         portfolio
├── /work/
├── /work/hexframe/
├── /work/yarreader/
├── /work/sharktank/
├── /about/
└── /resume/

sharktank.wizardgang.ai       Shark Tank application, APIs, WebSockets, controls, and evidence
hexframe.wizardgang.ai        Hexframe application and protected lab
shadowmoney.wizardgang.ai     path-preserving permanent redirect to Hexframe after verification
```

The root portfolio has no login, account, database, Durable Object, R2 binding, cron, billing
meter, audit register, status dashboard, or product API. A small stateless Worker is permitted only
as a migration boundary: it serves static assets, redirects human-facing legacy URLs, and
temporarily proxies machine-facing Shark Tank routes whose response behavior must not change.

## CLOUDFLARE CUTOVER PLAN

1. Add `sharktank.wizardgang.ai` as a second Custom Domain on `wizardgangprod`; retain
   `wizardgang.ai` on the same deployment.
2. Deploy the unchanged Shark Tank bundle and verify its game, WebSocket, core API, public evidence,
   protected 401 boundary, static assets, and security headers on the new hostname.
3. Build the standalone portfolio Worker `wizardgang-portfolio` with a `workers.dev` staging URL.
4. Verify portfolio routes, internal/external links, 404s, redirects, metadata, sitemap, headers,
   keyboard behavior, reduced motion, and desktop/mobile layouts on staging.
5. Move only the `wizardgang.ai` Custom Domain from `wizardgangprod` to
   `wizardgang-portfolio`. Keep `sharktank.wizardgang.ai` on `wizardgangprod` with all existing
   bindings and secrets.
6. Verify the root portfolio and every migration rule externally. Keep machine-route proxies until
   dependency review shows no remaining consumers.
7. Deploy a release-tagged Hexframe build to `hexframe.wizardgang.ai` and verify `/`, `/play/`,
   `/training/`, `/lab/`, saves, and protected lab behavior.
8. Only after Hexframe verification, make `shadowmoney.wizardgang.ai` a path-preserving permanent
   redirect to Hexframe, with explicit exceptions only where a destination path does not exist.

Rollback is one domain reassignment: restore `wizardgang.ai` to `wizardgangprod`. No Shark Tank
data migration, binding change, or secret rotation is part of the root cutover.

## REDIRECT MATRIX

### Root-domain human routes after cutover

| From | To | Status |
| --- | --- | --- |
| `/play[/]` | `https://sharktank.wizardgang.ai/play/` | 308 |
| `/ts[/]` | `https://sharktank.wizardgang.ai/ts/` | 308 |
| `/php[/]` | `https://sharktank.wizardgang.ai/php/` | 308 |
| `/docs[/]` | `https://sharktank.wizardgang.ai/docs/` | 308 |
| `/trust[/]` | `https://sharktank.wizardgang.ai/trust/` | 308 |
| `/status[/]` | `https://sharktank.wizardgang.ai/status/` | 308 |
| `/roadmap[/]` | `https://sharktank.wizardgang.ai/status/#delivery` | 308 |
| `/incidents[/]` | `https://sharktank.wizardgang.ai/status/#incidents` | 308 |
| `/inquiry[/]`, `/spend[/]` | `https://sharktank.wizardgang.ai/spend/` | 308 |
| `/logs[/]` | `https://sharktank.wizardgang.ai/logs/` | 308 |
| `/audit[/]` | `https://sharktank.wizardgang.ai/audit/` | 308 |
| `/policies[/]`, `/policies/:document[/]` | same path on `sharktank.wizardgang.ai` | 308 |
| `/admin[/]`, `/admin/*` | same path on `sharktank.wizardgang.ai` | 308; credentials are never forwarded |
| `/work/shadowmoney[/]` | `/work/hexframe/` | 308 |
| `/work/shark-tank[/]` | `/work/sharktank/` | 308 |
| retired module-launcher paths | `/` | 308 |

### Root-domain machine routes after cutover

The compatibility Worker proxies, rather than redirects, these routes so status codes, methods,
bodies, and WebSocket upgrades remain stable during migration:

- `/api`, `/api/*`
- `/room/:id/ws`
- `/php-api`, `/php-api/*`, `/php-room`
- `/openapi.json`
- `/status.json`, `/roadmap.json`, `/incidents.json`, `/spend.json`, `/inquiry.json`, `/logs.json`
- `/logs/game/:id.txt`
- `/audit/manifest.json`, `/policies.json`

Private `/audit.json`, `/audit.jsonl`, `/audit/status.json`, `/audit/game/*`, and
`/audit/replay/*` are redirected without forwarding `Authorization`. Operator tooling should move
to the corresponding `sharktank.wizardgang.ai/admin/*` names.

### ShadowMoney retirement

After Hexframe passes live verification:

```text
https://shadowmoney.wizardgang.ai/:splat
  -> https://hexframe.wizardgang.ai/:splat 308
```

Review `/play/`, `/training/`, `/lab/`, `/codex/`, and `/loadouts/` individually before activation.

## FILES/REPOS THAT WILL CHANGE

- `../WizardGangLocal`: add the Shark Tank Custom Domain, then remove portfolio ownership and the
  root Custom Domain after cutover. Product runtime, data bindings, and controls stay intact.
- `../WizardGang` (this repository): static portfolio, project metadata, build/verification scripts,
  stateless compatibility Worker, Cloudflare configuration, and migration records.
- `../Hexframe`: no reconstruction; only release-safe deployment/configuration changes if required
  to activate the already-declared production domain.
- `../ShadowMoney`: after Hexframe verification, replace its public response behavior with the
  path-preserving retirement redirect while preserving recoverability of the old deployment.

## FILES/REPOS THAT WILL NOT CHANGE

- `../YarReader`: its local/offline architecture remains independent; the portfolio links to public
  source and architecture evidence only.
- `../ModuleReact3Fiber`: no gameplay or engine work is part of this migration.
- `../wizardgang-recovered` and `../wizardgang-governance`: recovery and historical evidence remain
  unchanged.
- Hexframe, Shark Tank, and YarReader source is never copied into the portfolio repository.

## RISKS

- **Custom Domain takeover:** moving the root too early can replace Shark Tank before its subdomain
  is usable. The plan requires dual-domain verification first.
- **Protected-route credentials:** cross-host redirects must not forward Basic/Bearer credentials.
  The portfolio compatibility Worker discards them and does not proxy protected aliases.
- **Machine consumers:** redirecting APIs can change POST or client behavior. Machine routes are
  temporarily proxied and separately inventoried.
- **WebSocket origins:** a legacy root WebSocket proxy must normalize the upstream `Origin` to the
  Shark Tank hostname or the existing same-origin check will correctly reject it.
- **Same-zone recursion:** the compatibility Worker may fetch only the Shark Tank Custom Domain,
  never the root hostname.
- **Stale SEO identity:** all portfolio canonicals, Open Graph URLs, sitemap entries, and page titles
  must use WizardGang/Hexframe names and portfolio routes; Shark Tank owns its own metadata.
- **Uncommitted prior work:** `../WizardGangLocal` already contains deployed but uncommitted portfolio
  changes and one modified submodule worktree. Migration commits must not discard or misattribute
  that work.
- **Hexframe release policy:** Hexframe production deploys release tags only. Domain activation must
  not bypass that repository contract.
- **Redirect permanence:** 308 responses are cached. ShadowMoney retirement is activated only after
  Hexframe destinations are confirmed working.

