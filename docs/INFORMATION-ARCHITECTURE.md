# WizardGang company-first information architecture

Status: approved future-state information architecture for WG-049 and later implementation changes.

Baseline reviewed: WG-047 merge ab59fab06116c0a3e6ca7039cb95e2b5928b1137.

This document is intentionally future-state. It does not describe the current public route inventory as though the restructuring has already shipped. Until the later controlled changes land, the current React/TypeScript page registry, navigation, redirects, sitemap, metadata, and generated output remain authoritative.

## Purpose

WizardGang.ai is moving from a site organized primarily around Jacob Yongue's personal software-engineering portfolio to a company-first site organized around WizardGang software, systems, integrations, projects, and reusable solutions.

The target hierarchy of meaning is:

1. WizardGang builds software.
2. WizardGang works across software systems, integrations, independent projects, delivery/process, and reusable solution frameworks.
3. WizardGang products and project evidence show what the organization builds.
4. Jacob Yongue's professional background supports credibility as Team content.
5. Employer-owned work remains attributed to Jacob's employment history and must not be presented as WizardGang client work unless that relationship is factually true.

The restructuring is an information-architecture change, not a new frontend migration. The WG-047 TypeScript-first authority remains the technical foundation:

- React + TypeScript own canonical static pages.
- The typed page registry owns canonical page inventory.
- TypeScript owns browser enhancement, structured application data, and Worker routing.
- Vite owns frontend build/assets.
- The current Vite/Tailwind/authored-CSS pipeline owns styling.
- Wrangler/Cloudflare own runtime/deployment.
- npm run dev remains the local-development entry point.
- npm run check remains the authoritative repository acceptance gate.

## Current-state baseline

At the WG-047 baseline, the public generated inventory is 13 HTML outputs:

- /
- /projects/
- /projects/sharktank/
- /projects/sharktank/case-study/
- /projects/hexframe/
- /projects/hexframe/case-study/
- /projects/yarreader/
- /projects/yarreader/case-study/
- /work/
- /services/
- /about/
- /glossary/
- the generated noindex 404 output

Current primary navigation is Projects, Work, About, Contact, and GitHub. Current Home and About are Jacob-first. Work is the professional portfolio. Services is a fixed-scope website offering. The product pages and case studies already have distinct project identities and should remain substantive rather than being flattened into a generic company brochure.

WG-048 changes none of that implementation.

## Target public story

The target site should answer four questions in order:

1. What is WizardGang?
2. What software does WizardGang build or maintain?
3. What integration/system capability can WizardGang credibly demonstrate?
4. What reusable solutions/process frameworks can WizardGang apply?

Jacob's biography and career record answer a supporting fifth question: who is behind the work and what professional experience supports it?

The site must not fall back to using Jacob's résumé as the top-level navigation model after the restructure.

## Target primary navigation

The approved top-level navigation is:

- About
- Software
- Solutions

Home is reached through the WizardGang wordmark/logo. There is no separate Home navigation item.

Projects, Work, Contact, and GitHub are not top-level navigation items in the target architecture:

- Projects belongs under Software.
- Work/career belongs under About → Team → Jacob.
- Contact remains available in the footer and contextual calls to action.
- GitHub remains available in the footer and contextually on project/source surfaces.

The typed navigation authority must remain singular. Later implementation must change the existing navigation source rather than hard-code copies in pages.

## Target sitemap

The approved canonical public route target is:

~~~text
/
├── /about/
│   ├── /about/company/
│   └── /about/team/
│       └── /about/team/jacob/
├── /software/
│   ├── /software/integrations/
│   └── /software/projects/
│       ├── /software/projects/sharktank/
│       │   └── /software/projects/sharktank/case-study/
│       ├── /software/projects/hexframe/
│       │   └── /software/projects/hexframe/case-study/
│       └── /software/projects/yarreader/
│           └── /software/projects/yarreader/case-study/
├── /solutions/
│   ├── /solutions/websites/
│   └── /solutions/demo-framework/
└── /glossary/
~~~

The generated 404 page remains part of the build but is noindex and is not a sitemap entry.

External destinations are not canonical wizardgang.ai sitemap entries:

- https://demo.wizardgang.ai — detailed architecture/demo application and evidence.
- https://sharktank.wizardgang.ai — SharkTank product/runtime surface.
- https://hexframe.wizardgang.ai — Hexframe product/runtime surface.
- WizardGang GitHub organization and individual repositories — source destinations.
- YarReader remains an offline/product repository surface rather than a wizardgang.ai runtime destination.

## Route-depth principle

The target remains shallow:

- one segment for major sections such as /about/, /software/, and /solutions/;
- two segments for section children such as /software/integrations/;
- three segments for people or project entities such as /about/team/jacob/ and /software/projects/sharktank/;
- one intentional fourth segment for project case studies.

No future public route should exceed the project-case-study depth without a separate controlled IA decision. Query parameters must not be used to avoid creating a clear canonical path.

## Home responsibility

Route: /

Home becomes the WizardGang company/software overview. It should summarize, not reproduce, child sections.

The target structural order is:

1. WizardGang identity and concise statement of what it builds.
2. Software overview with a path into /software/.
3. Representative projects with a path into /software/projects/.
4. Integrations/systems capability summary with a path into /software/integrations/.
5. Solutions summary with paths into Websites and Demo Framework.
6. A compact credibility/evidence section that points to Company, Team, source, or detailed evidence rather than embedding career history.
7. A contact call to action.

Home must not carry the complete project catalog, complete integration catalog, complete career record, or complete solution documentation.

## About responsibility

Route: /about/

About is an orientation page with exactly two primary destinations:

- Company
- Team

It explains the distinction between the organization and the people behind it. It does not duplicate Company policy/process content or Jacob's full career record.

### Company

Route: /about/company/

Company owns the WizardGang organizational story:

- what WizardGang is;
- software/system focus;
- working principles;
- accessibility expectations;
- delivery/process and governance approach at a summary level;
- source/evidence philosophy where relevant;
- links to deeper public records or executable evidence.

Company is not a compliance-document dump. Detailed management-system and assurance evidence stays in the relevant repository/document or on the architecture demo. Company may summarize those commitments and link outward.

The current personal About principles may be reused only when they are genuinely organizational principles. Personal biography belongs under Team/Jacob.

### Team

Route: /about/team/

Team owns people and contributor discovery. Initially it contains Jacob only. That is an acceptable complete state.

Each person entry may include a concise role, focus, and link to a person page. The structure must be able to add future contributors without changing the top-level IA, but no fictional team members, positions, or relationships may be invented.

### Jacob

Route: /about/team/jacob/

Jacob owns the detailed personal/professional record.

The current /work/ material moves here:

- career history and roles;
- representative professional projects where factual and useful;
- professional skills;
- employer-attributed deployments;
- employer-attributed integration/system experience;
- implementation, QA, migration, delivery, and production-support background.

The current personal material in /about/ that describes Jacob's approach may also move here where it is biographical rather than organizational.

The page should be evidence-oriented but not a giant résumé dump. Repeated integration catalogs should not remain here once /software/integrations/ owns the capability catalog. Jacob's page may link to the integration capability page and keep the employment attribution/evidence needed to explain where experience came from.

## Company versus personal evidence boundary

The distinction is mandatory:

WizardGang work/products/capabilities:
- WizardGang-owned independent projects and repositories;
- current WizardGang software and reusable solution offerings;
- present company capability statements that can be supported;
- WizardGang process, accessibility, and governance commitments.

Jacob professional evidence:
- employment roles;
- employer-owned projects;
- customer/employer deployments completed while employed elsewhere;
- professional integrations performed in those roles;
- personal skills and career history.

Employer names, logos, integrations, deployments, and outcomes may demonstrate Jacob's experience. They must not be described or visually framed as WizardGang clients, WizardGang contracts, or WizardGang-delivered commercial projects unless source evidence supports that exact relationship.

Cross-linking is encouraged. Reassigning ownership is prohibited.

## Software responsibility

Route: /software/

Software is the catalog/orientation page for things WizardGang builds and the technical capabilities that directly support those things.

Software has two primary children:

- Integrations
- Projects

The landing page should summarize those two branches and direct users to them. It should not duplicate every project card, every integration platform, and every system category.

Conceptual boundary:

- Software = things WizardGang builds and the software/integration capability used to build them.
- Solutions = reusable packaged approaches/frameworks WizardGang applies.

## Integrations responsibility

Route: /software/integrations/

Integrations owns the company-facing integration/system capability catalog.

The current systemGroups and integrationGroups material is the starting source, but later implementation must distinguish capability from employment evidence before presenting it as WizardGang capability.

The page may organize by areas such as:

- ERP/WMS and enterprise systems;
- commerce/fulfillment;
- warehouse automation;
- carriers/logistics;
- EDI/B2B;
- identity/API/integration patterns;
- development/workflow platforms;
- justice/legal integrations where still relevant.

Rules:

- A platform may appear as a WizardGang capability only when current capability can be supported.
- Employer/customer deployment lists remain on Jacob's professional page.
- Specific employer-owned project outcomes remain on Jacob's professional page.
- Where a capability is experience-backed primarily by Jacob's prior employment, attribution must make that clear rather than implying a WizardGang client engagement.
- The integration catalog has one future data authority; do not maintain duplicate full catalogs under Team and Software.

Later implementation may split the current professional-systems data into company capability records and professional evidence records if necessary. That split must preserve factual provenance.

## Projects responsibility

Route: /software/projects/

Projects is the catalog of WizardGang-owned independent software projects.

Current projects move without changing their identity:

- SharkTank
- Hexframe
- YarReader

Canonical targets:

- /software/projects/sharktank/
- /software/projects/sharktank/case-study/
- /software/projects/hexframe/
- /software/projects/hexframe/case-study/
- /software/projects/yarreader/
- /software/projects/yarreader/case-study/

Case-study child routes remain useful because current content already separates concise project orientation from deeper architecture/tradeoff/evidence detail. They should remain separate canonical pages.

### Project presentation contract

Every project overview should make the following discoverable when applicable:

- what the project is;
- why it exists;
- the primary capability it demonstrates;
- major stack/architecture boundaries;
- accessibility characteristics;
- source repository;
- live/demo surface when one exists;
- deeper case study when one is useful;
- operational/process evidence when the project actually publishes it.

Every project case study should deepen the project rather than restating the overview.

Project-specific differences remain valid. SharkTank may expose operating/governance evidence that YarReader does not. YarReader may emphasize offline/recovery architecture. Hexframe may emphasize deterministic simulation and lab tooling. Consistency means predictable information relationships, not identical sections.

Project facts should remain in the typed project authority and be projected into overview, Home summary, and case-study surfaces rather than copied into multiple independent sources.

## Solutions responsibility

Route: /solutions/

Solutions is distinct from Software.

Approved boundary:

- Software = products/projects/capabilities WizardGang builds.
- Solutions = reusable delivery approaches or frameworks WizardGang applies to a problem.

Solutions has two target children:

- Websites
- Demo Framework

The landing page summarizes the available solution types without duplicating their full detail.

### Websites

Route: /solutions/websites/

The current /services/ content moves here.

This route owns the current fixed-scope small-business website concept:

- Starter, Business, and Owner+ package definitions;
- owner-controlled source, GitHub, Cloudflare, domain, and deployment model;
- handoff/ownership principles;
- delivery process;
- scope boundaries;
- pricing while pricing remains intentionally published;
- contact call to action.

This resolves the Services/Solutions overlap by retiring Services as a canonical category. There will not be both a top-level Services section and a Solutions section describing the same offering.

### Demo Framework

Route: /solutions/demo-framework/

This main-site page explains the reusable architecture/demo framework and why it exists. It should be a concise company-facing solution summary, not a copy of the demo application.

The detailed executable/evidence surface remains https://demo.wizardgang.ai.

At the reviewed demo baseline, that application intentionally exposes a small browser surface centered on:

- / — orientation and compact live proof;
- /demos — executable architecture demonstrations;
- /assurance — assessment/evidence workbench;
- /security — vulnerability-reporting/advisory boundary.

Operational machine contracts and protected administration remain concerns of the demo repository, not content to reproduce on the primary company site.

The main-site Demo Framework page should explain what the framework demonstrates, identify the external application as the detailed proof surface, and link to it. The main site must not become a second authority for demo routes, assurance records, or operational data.

## Services disposition

Current /services/ is not retained as a canonical target.

Disposition: move to /solutions/websites/.

Meaningful current concepts map as follows:

| Current Services concept | Future owner |
| --- | --- |
| fixed-scope website packages and pricing | /solutions/websites/ |
| source/domain/deployment ownership | /solutions/websites/ |
| GitHub + Cloudflare delivery model | /solutions/websites/ |
| handoff/documentation | /solutions/websites/ |
| build/test/deploy delivery steps | /solutions/websites/ |
| future growth into forms/data/automation | /solutions/websites/ with links to Software where appropriate |
| general WizardGang engineering principles | /about/company/ when genuinely company-wide |
| contact action | contextual CTA plus global footer |

After the new solution exists, /services/ becomes a permanent compatibility redirect. It must not remain an independently canonical duplicate.

## Contact disposition

There is no target /contact/ route.

Contact remains available through:

- the global footer;
- contextual CTAs on Home;
- Company/About where appropriate;
- Team/Jacob;
- Websites and other solution pages where a commercial conversation is relevant.

The current Contact top-level mailto navigation item is removed when WG-049 implements the new global navigation. The email destination remains available and accessible.

## GitHub disposition

GitHub is not a target primary-navigation item.

The WizardGang organization remains the primary general code destination and should appear:

- in the global footer;
- on project/source actions;
- where Company discusses public source/evidence;
- where a solution has a relevant canonical repository.

Individual product pages should continue linking to the exact canonical repository rather than only to the organization root.

The existing /github compatibility redirect may remain.

## Glossary disposition

Route: /glossary/

Disposition: retain.

Glossary is a supporting utility, not a top-level business section and not a primary-navigation item. It remains useful for accessibility, plain-language support, and technical definitions across Software, Solutions, Company, and Team content.

Future metadata/copy should refer to the WizardGang site rather than a personal portfolio once the restructure ships.

## Route migration map

Every current generated route has one target disposition.

| Current route/output | Target | Disposition | Notes |
| --- | --- | --- | --- |
| / | / | rewrite | Company-first Home; URL remains stable. |
| /projects/ | /software/projects/ | move | Old URL becomes permanent redirect after replacement exists. |
| /projects/sharktank/ | /software/projects/sharktank/ | move | Preserve product identity and source/live relationships. |
| /projects/sharktank/case-study/ | /software/projects/sharktank/case-study/ | move | Preserve case-study separation. |
| /projects/hexframe/ | /software/projects/hexframe/ | move | Preserve product identity and source/live relationships. |
| /projects/hexframe/case-study/ | /software/projects/hexframe/case-study/ | move | Preserve case-study separation. |
| /projects/yarreader/ | /software/projects/yarreader/ | move | Preserve offline/source relationships. |
| /projects/yarreader/case-study/ | /software/projects/yarreader/case-study/ | move | Preserve case-study separation. |
| /work/ | /about/team/jacob/ | move | Career becomes supporting Team evidence. |
| /services/ | /solutions/websites/ | move | Services category is replaced by a specific solution. |
| /about/ | /about/ | rewrite | Becomes About orientation to Company and Team. |
| /glossary/ | /glossary/ | retain | Supporting utility outside primary navigation. |
| generated 404 output | generated 404 output | retain | Rewrite messaging later for company-first context; remain noindex and outside sitemap. |

No current canonical content route is intentionally hard-retired to 404 because each has a clear retained or moved successor.

## Redirect and retirement policy

Canonical moves use permanent HTTP 308 redirects after the replacement page is canonical and verified.

Rules:

1. Never redirect an old canonical URL before its target exists.
2. Preserve query strings when redirecting moved canonical URLs.
3. Do not use query strings as alternate page identities.
4. Redirect-only URLs are excluded from the canonical sitemap.
5. New target pages emit canonical metadata for the new URL only.
6. Old redirected pages must not continue to build as independent canonical HTML.
7. Routes with no meaningful successor should return the ordinary 404 instead of being redirected to a vaguely related page.
8. Fragment links should be preserved by maintaining meaningful target IDs when possible; the redirect policy must not invent a second fragment-routing system.
9. Existing product/migration compatibility behavior remains separate from the company-site IA unless a later change explicitly modifies it.

Existing compatibility routes should be adjusted only when their current target moves:

| Compatibility route | Future destination |
| --- | --- |
| /resume and /resume/ | /about/team/jacob/ |
| /professional and /professional/ | /about/team/jacob/ |
| /work/shadowmoney[/] | /software/projects/hexframe/ |
| /work/hexframe[/] | /software/projects/hexframe/ |
| /work/shark-tank[/] | /software/projects/sharktank/ |
| /work/sharktank[/] | /software/projects/sharktank/ |
| /projects/shark-tank[/] | /software/projects/sharktank/ |
| /work/yarreader[/] | /software/projects/yarreader/ |
| /services/example[/] | /solutions/websites/ |

The following existing boundaries remain conceptually valid and are not redefined by the company IA:

- /github[/] → WizardGang GitHub organization.
- /compliance[/], /accessibility[/], and /security[/] → detailed demo/evidence destinations.
- SharkTank human compatibility routes and machine/API proxy boundaries.
- retired game-route behavior.

WG-057 may remove obsolete generated source routes after redirects are authoritative, but permanent compatibility redirects for previously canonical public URLs should remain unless a later evidence-based decision explicitly retires them.

## Target sitemap membership

After restructuring, the canonical wizardgang.ai XML sitemap should contain:

- /
- /about/
- /about/company/
- /about/team/
- /about/team/jacob/
- /software/
- /software/integrations/
- /software/projects/
- /software/projects/sharktank/
- /software/projects/sharktank/case-study/
- /software/projects/hexframe/
- /software/projects/hexframe/case-study/
- /software/projects/yarreader/
- /software/projects/yarreader/case-study/
- /solutions/
- /solutions/websites/
- /solutions/demo-framework/
- /glossary/

The 404 output, redirect-only legacy URLs, /github, and external subdomain destinations are not canonical sitemap entries.

## Information ownership

Each major concept has one future content authority.

| Concept | Future authority | Supporting/cross-link surfaces |
| --- | --- | --- |
| WizardGang company story | /about/company/ | Home, About |
| top-level orientation | / | About, Software, Solutions |
| people/team | /about/team/ | About |
| Jacob biography/career | /about/team/jacob/ | Team, Home credibility summary |
| professional roles/projects/deployments | /about/team/jacob/ | Integration capability may cite experience without duplicating full records |
| software capability overview | /software/ | Home |
| integration/system capability catalog | /software/integrations/ | Software, Home |
| employer-specific integration/deployment evidence | /about/team/jacob/ | Integrations may link/cite with attribution |
| WizardGang project catalog | /software/projects/ | Software, Home |
| project facts | typed project data → project overview/case study | Home summaries, source/live actions |
| website offering | /solutions/websites/ | Solutions, Home |
| architecture/demo framework summary | /solutions/demo-framework/ | Solutions, Company |
| executable demo/evidence application | demo.wizardgang.ai | Demo Framework summary |
| accessibility/process/governance positioning | /about/company/ summary plus current records/evidence | Demo Framework and repository docs |
| contact information | shared contact authority projected into footer/contextual CTAs | Home, Team/Jacob, Solutions |
| technical definitions | /glossary/ | contextual links from other pages |

Cross-links are projections of one authority. They are not permission to create a second full copy.

## External-domain boundaries

wizardgang.ai is the company/orientation site.

demo.wizardgang.ai is the detailed executable architecture, demo, assurance, and security/evidence application. The primary site summarizes and links; it does not copy its route inventory, assurance records, or operational contracts.

sharktank.wizardgang.ai and hexframe.wizardgang.ai remain product/runtime destinations owned by their product repositories. WizardGang project pages describe and link to those products; they do not become runtime authorities.

YarReader remains repository/offline-product oriented. The main project page explains it and links to its canonical source.

## Query-string policy

Distinct public documents use canonical paths.

Query parameters are reserved for non-identity state such as filtering, tracking, or interface state where a future feature genuinely needs them. They must not represent an alternate canonical page, substitute for section routes, or create indexable duplicates.

Moved-route redirects preserve query strings unless a specific query is known to be unsafe or meaningless and a later controlled change documents that exception.

Canonical metadata never includes incidental query parameters.

## Content-consolidation rules

WG-049 and later changes must follow these rules:

- one canonical home for each concept;
- one typed navigation authority;
- one project-fact authority;
- one career-history authority;
- one integration-capability authority;
- one company/About story authority;
- use summaries and cross-links instead of repeating full sections;
- do not preserve obsolete duplicate content merely because Git can display its history;
- delete obsolete source after migration and verification rather than keeping hidden fallback authorities;
- Git history is the historical record;
- moved URLs may remain only as redirect contracts, not duplicate canonical pages.

## Structural presentation principles

WG-048 does not define a visual redesign. Later implementation should preserve these structural rules:

- summary first;
- evidence/detail second;
- section landings orient and route rather than duplicate children;
- one clear primary action per major content block where possible;
- consistent project/source/live/case-study relationships;
- descriptive navigation labels;
- deep evidence remains on child pages or canonical external evidence surfaces.

Colors, typography, exact spacing, animation design, component appearance, and pixel layout are outside this IA contract.

## Accessibility requirements

The company-first implementation must preserve or strengthen the WG-037/WG-047 behavioral contract.

Every canonical page must retain:

- semantic landmarks;
- exactly one meaningful H1;
- logical heading hierarchy;
- keyboard-operable desktop and mobile navigation;
- visible focus and usable skip navigation;
- descriptive link names;
- meaningful current-page state;
- reduced-motion support;
- 200% text support and responsive reflow;
- readable-layout support;
- English/Spanish language behavior while language support remains part of the product;
- no information communicated only through color or motion;
- meaningful static content before browser enhancement executes.

Moving routes or changing navigation is not permission to weaken current accessibility tests.

## Metadata and SEO contract

All target pages continue using the shared typed metadata authority.

### Home

Title and description identify WizardGang as the primary entity and summarize software/solutions scope. Canonical URL remains https://wizardgang.ai/.

### Section landings

About, Software, and Solutions titles/descriptions explain section purpose and use their own canonical URLs.

### Company and Team

Company metadata describes WizardGang. Team/Jacob metadata clearly distinguishes organizational information from Jacob's professional record.

### Projects

Project overview and case-study metadata retain project identity and move canonical URLs to /software/projects/... . Social metadata remains project-appropriate and source/live links are not canonical substitutes.

### Integrations

Metadata describes integration/system capability without presenting employer-specific customers as WizardGang clients.

### Websites solution

Metadata describes the fixed-scope website solution rather than a generic Services category.

### Demo Framework

Metadata describes the main-site solution summary. The canonical remains on wizardgang.ai; demo.wizardgang.ai is the external detailed application, not a duplicate canonical.

### Glossary

Glossary remains indexable unless a later SEO review decides otherwise and uses its retained /glossary/ canonical.

### 404

The generated 404 remains noindex with no canonical or og:url, consistent with the current metadata contract.

Old moved URLs become redirect-only and must not continue emitting independent canonical metadata.

## Approved implementation sequence

The company-first implementation proceeds in this order. Later changes may make small mechanical adjustments discovered during implementation, but they must not reopen the structural decisions in this document without explicitly changing this authority.

### WG-049 — REFACTOR — Rebuild global company navigation

Goal: replace Projects/Work/About/Contact/GitHub primary navigation with About/Software/Solutions while keeping Home on the wordmark.

Affects: shared navigation contracts and current-page state.

Depends on: WG-048.

Becomes authoritative: typed global navigation model for the company-first hierarchy.

Out of scope: page rewrites, route moves, content consolidation.

May delete afterward: old top-level nav keys/items once no longer referenced.

### WG-050 — REFACTOR — Rebuild homepage around WizardGang

Goal: rewrite / around WizardGang identity, Software, Integrations, Projects, Solutions, evidence, and contact paths.

Affects: Home only plus reused summary components/data.

Depends on: WG-049.

Becomes authoritative: company-first Home composition.

Out of scope: creating child-section canonical routes.

May delete afterward: Jacob-first Home-only copy and obsolete Home-specific portfolio summaries.

### WG-051 — REFACTOR — Establish About → Company / Team

Goal: redefine /about/ as orientation and create /about/company/, /about/team/, and the basic /about/team/jacob/ profile surface.

Affects: About route family and typed page registry.

Depends on: WG-050.

Becomes authoritative: Company and Team ownership boundaries.

Out of scope: full Work/career migration.

May delete afterward: personal About copy that has a clear new Company or Jacob owner.

### WG-052 — REFACTOR — Move personal career content into Team

Goal: move the substantive /work/ professional record into /about/team/jacob/ and make /work/ plus resume/professional aliases permanent redirects to that canonical page.

Affects: Work page/data projections, Worker compatibility targets, Team/Jacob content.

Depends on: WG-051.

Becomes authoritative: /about/team/jacob/ for career/professional evidence.

Out of scope: company integration catalog restructuring.

May delete afterward: canonical Work page definition and duplicate professional presentation content; keep required redirects.

### WG-053 — REFACTOR — Establish Software → Integrations / Projects

Goal: create /software/, /software/integrations/, and /software/projects/ as the Software route family and move the Projects index to its target parent.

Affects: Software landing, integration landing, project index, page registry.

Depends on: WG-052.

Becomes authoritative: Software section hierarchy.

Out of scope: final integration evidence split and individual project route moves.

May delete afterward: old /projects/ canonical page after its redirect is active and verified.

### WG-054 — REFACTOR — Consolidate integration content

Goal: make /software/integrations/ the single company-facing capability catalog while keeping employer-specific deployment/history evidence under Jacob with explicit attribution.

Affects: professional-systems data ownership, integration/system presentation, cross-links.

Depends on: WG-053.

Becomes authoritative: integration capability data/surface.

Out of scope: project-page redesign.

May delete afterward: duplicate full integration/system catalogs from Jacob/legacy Work presentation once required professional evidence is retained.

### WG-055 — REFACTOR — Standardize project presentation

Goal: move project overview and case-study canonicals to /software/projects/{project}/... and enforce the shared project presentation contract.

Affects: project routes, project index links, metadata, typed project relationships, redirects.

Depends on: WG-053 and WG-054.

Becomes authoritative: /software/projects/... project route family.

Out of scope: Solutions.

May delete afterward: old /projects/{project}/ generated page definitions; keep permanent redirects and canonical project data.

### WG-056 — REFACTOR — Establish Solutions → Websites / Demo Framework

Goal: create /solutions/, move current /services/ content to /solutions/websites/, and create /solutions/demo-framework/ as the main-site explanation/link to demo.wizardgang.ai.

Affects: Solutions route family, services data/presentation, external demo relationship.

Depends on: WG-055.

Becomes authoritative: Solutions hierarchy, Websites solution, Demo Framework summary.

Out of scope: copying demo application/evidence into the primary site.

May delete afterward: canonical Services page definition and obsolete Services-only naming; keep /services/ redirect.

### WG-057 — REFACTOR — Retire redundant portfolio routes/content

Goal: remove remaining obsolete canonical source/content after all replacements exist; finalize permanent redirect targets and canonical sitemap.

Affects: page registry, Worker compatibility map, sitemap, stale content/data projections, 404 behavior.

Depends on: WG-052 through WG-056.

Becomes authoritative: final company-first route inventory and compatibility policy.

Out of scope: accessibility redesign.

May delete afterward: obsolete route definitions, duplicate content projections, retired portfolio-only navigation/content sources. Do not delete required permanent redirects.

### WG-058 — A11Y — Verify company-first frontend

Goal: perform route-by-route and shared-navigation accessibility verification on the complete company-first implementation.

Affects: accessibility fixes only where verification finds regressions.

Depends on: WG-057.

Becomes authoritative: accessibility evidence for the new route/navigation structure.

Out of scope: IA changes or new features.

May delete afterward: obsolete accessibility fixtures tied only to removed canonical routes, after equivalent new coverage exists.

### WG-059 — TEST — Enforce company-first IA acceptance

Goal: update automated acceptance so the target navigation, canonical route inventory, redirects, metadata, content ownership, sitemap, links, and TypeScript-first authority cannot drift.

Affects: focused acceptance tests and route fixtures.

Depends on: WG-058.

Becomes authoritative: executable company-first IA contract.

Out of scope: content redesign.

May delete afterward: WG-037/WG-047 assertions that freeze the old route/nav inventory, but only after equivalent behavioral/architecture protection is carried forward.

### WG-060 — DOCS — Align documentation to resulting current state

Goal: update README, ownership, accessibility, compliance/governance scope, and this document to describe the now-implemented current state rather than a future target.

Affects: documentation only.

Depends on: WG-059.

Becomes authoritative: current-state documentation for the company-first site.

Out of scope: route/content implementation.

May delete afterward: obsolete migration wording and planning-only text that no longer provides current or operating value. Git retains history.

### WG-061 — RELEASE — Release company-first WizardGang.ai

Goal: execute the controlled production release after implementation, accessibility, acceptance, and documentation are complete.

Affects: release/deployment only.

Depends on: WG-060 and all required release gates.

Becomes authoritative: released company-first production baseline.

Out of scope: additional restructuring.

May delete afterward: nothing solely because of release; rollback evidence must remain available through normal release/source controls.

## Migration sequencing rules

- Replacement surfaces must exist and pass acceptance before old canonical routes redirect.
- Old canonical route source may be deleted only after its target and redirect are verified.
- Sitemap entries change when canonicals change, not before.
- Metadata canonicals change with the route move.
- Home/navigation may link to only routes that already exist in the same change or an accepted prerequisite.
- No temporary duplicate canonical route should be indexed.
- Existing product and migration compatibility behavior must not be casually removed as part of presentation cleanup.

## Acceptance criteria for the completed company-first phase

The implementation is complete only when all of the following are true:

### Positioning

- WizardGang is the primary public entity.
- Software, integrations, projects, and solutions are primary organizational concepts.
- Jacob's career is supporting Team content.
- Employer experience is explicitly distinguished from WizardGang-owned work.

### Navigation

- Primary navigation is About, Software, Solutions.
- Home is available through the wordmark.
- Contact is available without a top-level Contact item.
- GitHub is available without a top-level GitHub item.

### Routes

- The target sitemap in this document is the canonical generated inventory.
- Every old moved canonical has the documented permanent redirect.
- Redirect-only paths are absent from the sitemap and canonical registry.
- 404 remains a normal noindex error output.
- Route depth stays within the documented limits.

### Content ownership

- Company, Team, Jacob career, Integrations, Projects, Websites, and Demo Framework each have one canonical owner.
- Full career history is not duplicated into Software.
- Full integration catalog is not duplicated under Team.
- Employer work is not presented as WizardGang client work.
- demo.wizardgang.ai remains the detailed executable/evidence authority.

### Technical and behavioral contract

- React/TypeScript remains the page authority.
- The typed registry remains the canonical route authority.
- Browser behavior, Worker routing, and structured data remain TypeScript-first.
- npm run dev remains the local-development contract.
- npm run check remains the merge acceptance gate.
- Accessibility, metadata, link integrity, security/header boundaries, and static-first delivery remain protected.

## WG-048 completion boundary

WG-048 itself is complete when this document is approved and linked from README with no public implementation changes.

WG-048 must not change:

- React pages or components;
- navigation implementation;
- current page registry;
- Worker redirects;
- sitemap;
- metadata;
- browser TypeScript;
- Vite/build behavior;
- CSS;
- generated public output;
- deployment configuration.

The first implementation change is WG-049.
