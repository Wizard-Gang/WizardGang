# TEMPORARY EXECUTION SPEC — DELETE WHEN COMPLETE

> **This file is temporary.** Read it fully before changing the site. Implement the cleanup on the current `portfolio-cleanup` branch. When the implementation, build, verification, responsive review, and link checks are complete, **delete this file in the final WG-017 implementation commit before merge**. This prompt must not survive into `main`.
>
> Keep the repository's existing `[WG-###] [TYPE]` commit convention. This cleanup is WG-017. Do not commit unrelated changes.

# WizardGang.ai Portfolio Cleanup — Professional Systems Pass

We are cleaning up the professional-work portion of `wizardgang.ai`.

This is a **content and information-architecture cleanup**, not a visual redesign from scratch.

The current site has redundant concepts around:

- Work
- Professional Work
- Independent Work
- Case Studies
- Featured Work
- Project summaries
- Homepage project previews

We want the site to become much leaner.

The core rule is:

> The homepage is the portfolio. Individual project pages exist only for deeper technical detail.

Do not create new redundant landing pages or taxonomies.

---

# 1. Target Site Structure

The intended top-level structure is:

```text
wizardgang.ai
│
├── /
│   ├── Hero
│   ├── Featured Projects
│   ├── Professional Systems
│   ├── Experience
│   └── About
│
├── /projects/
│   ├── sharktank/
│   ├── hexframe/
│   └── yarreader/
│
├── /resume/
│
└── External Links
    ├── GitHub
    ├── Shark Tank deployment
    └── Hexframe deployment
```

The following concepts should no longer exist as separate destinations unless required temporarily for redirects:

```text
/work/
/professional/
/about/
```

Eventually:

```text
/work/          -> /#projects
/professional/  -> /#professional
/about/         -> /#about
```

Existing project URLs should migrate toward:

```text
/work/sharktank/ -> /projects/sharktank/
/work/hexframe/  -> /projects/hexframe/
/work/yarreader/ -> /projects/yarreader/
```

Do not break URLs during this cleanup pass. Preserve compatibility with redirects where appropriate.

---

# 2. Remove Redundant / Nonfunctional Copy

Perform a deep copy cleanup.

Delete or heavily condense text that only says things like:

- I build systems
- I solve problems
- I work end-to-end
- Explore my work
- Selected work
- Featured work
- Professional work
- Independent work
- Case studies
- What I do
- My approach
- Engineering philosophy
- This project demonstrates...
- This case study explores...
- I focus on...
- I believe...
- I am passionate about...

Do not repeat concepts already demonstrated by the actual projects, deployments, technologies, or system history.

Prefer facts, systems, deployments, integrations, technology, outcomes, live demos, source code, architecture, and evidence over generic prose.

The portfolio should feel like an engineering record, not marketing copy.

---

# 3. Homepage Professional Systems Section

Replace the current professional-work cruft with one canonical section.

Use this structure:

```markdown
## Professional Systems

Warehouse, fulfillment, logistics, justice, public-sector, and enterprise software delivered from requirements through production.

### Deployments

[deployment brands]

### Integrations

[integration groups]

### Systems

[system capability groups]
```

Keep this section dense, scannable, and evidence-driven.

Do not create a separate `/professional/` content experience containing the same material.

---

# 4. Deployments

Use the following deployment history. Order brands in a sensible way, not based on when they were added to this prompt.

Current canonical list:

```text
GNC
Jerry Leigh
Hybrid Apparel
Manhattan Beachwear
Obermeyer
Solutions 2 GO
FamBrands
Custom Integrated Designs
BAMKO
Brixton
Dot Foods
Snap-on Tools
IPSY
Younique
BuySeasons
Bulk Reef Supply
Seeds 'N Such
Waytek Wire
Saddle Creek Logistics Services
SpartanNash
A Beka Book
Salon Service Group
```

Do NOT create a separate "Cloud IMS" section. Those projects are simply deployments.

Do not imply that all deployments came from one employer.

Do not add employers beside each deployment unless that mapping already exists elsewhere in verified site data.

---

# 5. Deployment Brand Links

Every deployment brand should link to the company's official website.

Requirements:

- Use the company's canonical official domain.
- Do not link to Wikipedia.
- Do not link to LinkedIn.
- Do not link to Crunchbase.
- Do not link to Google search results.
- Do not link to reseller/distributor pages when an official site exists.
- Open external links safely.
- Use appropriate `rel` attributes.
- Keep link styling subtle.
- Make links keyboard accessible and preserve visible focus states.

The visual behavior should be normal text at rest with a slight underline / brightness / accent on hover or focus. Do not turn this section into a wall of blue hyperlinks.

If a company has been acquired or renamed, prefer the most appropriate currently maintained official corporate/brand URL while preserving the historic deployment name shown above.

---

# 6. Integrations

Use grouped integration categories.

## ERP Integrations

```text
NetSuite
Microsoft Dynamics
Sage
Fishbowl
QuickBooks POS
RedPrairie
Blue Yonder
Canbar
```

RedPrairie and Blue Yonder may represent related product history, but preserve both because they reflect systems encountered professionally. Do not over-explain vendor history in the UI.

## Commerce & Fulfillment

```text
Shopify
Amazon Direct Fulfillment
ShipStation
Shipium
ProShip
```

## Warehouse Automation

```text
A360
Locus
6 River Systems
AutoStore
Corvus
Pendant
```

## Carrier Integrations

```text
USPS
UPS
FedEx
```

## EDI & B2B

Do not list EDI as a vendor. Represent it as protocol/workflow experience:

```text
EDI Orders
Acknowledgements
ASNs
Invoices
Inventory & Fulfillment Flows
```

Avoid unnecessary acronym soup. If the site already has evidence of specific EDI transaction sets, retain those only where technically useful.

## Warehouse Hardware

```text
Zebra
Honeywell
```

## Development & Workflow

```text
GitHub
Jira
Zapier
```

---

# 7. Integration Links

Every named integration vendor/platform should link to its official website. This includes:

```text
NetSuite
Microsoft Dynamics
Sage
Fishbowl
QuickBooks POS
RedPrairie
Blue Yonder
Canbar
Shopify
Amazon Direct Fulfillment
ShipStation
Shipium
ProShip
A360
Locus
6 River Systems
AutoStore
Corvus
Pendant
USPS
UPS
FedEx
Zebra
Honeywell
GitHub
Jira
Zapier
```

Do not link generic concepts such as EDI Orders, ASNs, Invoices, or Inventory Flows.

---

# 8. Systems

Organize system experience by actual domain.

## Warehouse & Fulfillment

```text
Fulfillment
Inventory
Lot Tracking
Barcode Workflows
Warehouse Automation
Quality Control
Shipping
RMA
```

## Logistics

```text
Yard Management
Truck & Trailer Workflows
```

Yard Management refers to physical truck/trailer movement and yard operations. Do not make this sound like generic project/task management.

## Justice & Court Systems

```text
Case Management
Prosecutor Systems
Public Defense Systems
Probate Court Systems
Public Inquiry
```

These should be presented as software system domains. Do not add legal claims or descriptions beyond what is necessary.

"Public Inquiry" refers to citizen/public-facing inquiry access associated with court/probate systems.

## Public-Sector Workflows

```text
Solicitation
Tax Appeals
```

This refers to workflow/software used around public-sector solicitation and tax-appeal processes. Keep wording factual.

## Enterprise & AI Infrastructure

```text
ERP Integration
MCP Servers
```

MCP refers to Model Context Protocol infrastructure. Do not expand this into generic AI marketing copy.

If a tooltip or detail exists, this is sufficient:

```text
Designed and implemented an MCP server for controlled system/tool access.
```

Do not turn the homepage into a full MCP case study.

---

# 9. Canonical Professional Section

The finished homepage content should be conceptually equivalent to:

```markdown
## Professional Systems

Warehouse, fulfillment, logistics, justice, public-sector, and enterprise software delivered from requirements through production.

### Deployments

GNC · Jerry Leigh · Hybrid Apparel · Manhattan Beachwear · Obermeyer ·
Solutions 2 GO · FamBrands · Custom Integrated Designs · BAMKO · Brixton ·
Dot Foods · Snap-on Tools · IPSY · Younique · BuySeasons · Bulk Reef Supply ·
Seeds 'N Such · Waytek Wire · Saddle Creek Logistics Services · SpartanNash ·
A Beka Book · Salon Service Group

### Integrations

**ERP Integrations**
NetSuite · Microsoft Dynamics · Sage · Fishbowl · QuickBooks POS · RedPrairie · Blue Yonder · Canbar

**Commerce & Fulfillment**
Shopify · Amazon Direct Fulfillment · ShipStation · Shipium · ProShip

**Warehouse Automation**
A360 · Locus · 6 River Systems · AutoStore · Corvus · Pendant

**Carrier Integrations**
USPS · UPS · FedEx

**EDI & B2B**
EDI Orders · Acknowledgements · ASNs · Invoices · Inventory & Fulfillment Flows

**Warehouse Hardware**
Zebra · Honeywell

**Development & Workflow**
GitHub · Jira · Zapier

### Systems

**Warehouse & Fulfillment**
Fulfillment · Inventory · Lot Tracking · Barcode Workflows · Warehouse Automation · Quality Control · Shipping · RMA

**Logistics**
Yard Management · Truck & Trailer Workflows

**Justice & Court Systems**
Case Management · Prosecutor Systems · Public Defense Systems · Probate Court Systems · Public Inquiry

**Public-Sector Workflows**
Solicitation · Tax Appeals

**Enterprise & AI Infrastructure**
ERP Integration · MCP Servers
```

Do not blindly render this as Markdown text if the site's component system supports a better layout. Preserve the information hierarchy.

---

# 10. UI Treatment

This information should not become giant cards for every item.

Prefer a compact hierarchy:

```text
PROFESSIONAL SYSTEMS

Deployments
────────────────────────
GNC · Jerry Leigh · Hybrid Apparel · ...

Integrations
────────────────────────
ERP
NetSuite · Dynamics · Sage · ...

Warehouse Automation
AutoStore · Locus · ...

Systems
────────────────────────
Warehouse & Fulfillment
Inventory · Lot Tracking · ...

Justice & Court
Case Management · Prosecutor · ...
```

Use spacing and typography to establish hierarchy.

Do not add giant logos, vendor logo grids, unnecessary icons, badges around every keyword, individual cards for every deployment, carousels, accordions for short lists, or excessive hover animation.

The section should communicate scale through density.

---

# 11. Homepage Project Taxonomy

While touching this area, normalize project terminology across the site.

Use `Projects` as the canonical term.

Remove interchangeable use of:

```text
Work
Selected Work
Featured Work
Independent Work
Case Studies
Portfolio Work
Professional Work
```

A project can carry metadata indicating `Independent` or `Professional` context, but do not make visitors navigate through an "Independent Work" category just to reach a project.

---

# 12. Keep Independent Projects Prominent

The homepage should still prioritize:

```text
Shark Tank
Hexframe
YarReader
```

These are the primary independent engineering artifacts.

Recommended order:

```text
Hero
Featured Projects
├── Shark Tank
├── Hexframe
└── YarReader
Professional Systems
Experience
About
Footer
```

Professional systems should reinforce credibility without competing with the interactive project portfolio.

---

# 13. Shark Tank

Do not substantially rewrite the Shark Tank case study in this task unless necessary to remove duplicated homepage copy.

Its primary story remains:

```text
real multiplayer software
+
ISO/IEC 27001 security governance
+
ISO/IEC 42001 AI governance
+
live operational evidence
```

Gameplay should remain prominent. Governance capability should remain at the forefront.

---

# 14. Hexframe

Keep Hexframe focused on deterministic fighting-game systems, 60 Hz simulation, hitboxes, training/lab tooling, rollback-ready architecture, and SVG/vector rendering.

Do not duplicate these explanations repeatedly between homepage and project page. Homepage = concise proof. Project page = detail.

---

# 15. YarReader

Keep YarReader focused on portable/offline media pipeline, normalization, static HTML export, offline operation, deterministic processing, and portable device use.

It should be the smallest/lowest-priority of the three project cards. Do not let it dominate homepage vertical space.

---

# 16. About Cleanup

If the `/about/` page content is folded into the homepage, reduce it to approximately 2–3 useful paragraphs maximum.

Delete generic philosophy. Keep only information that adds something not already demonstrated elsewhere.

Good:

```text
I work across requirements, architecture, implementation, testing, deployment, and operational handoff.
```

Bad:

```text
I believe great engineering begins with understanding the problem and collaborating with stakeholders to create meaningful solutions...
```

No corporate filler.

---

# 17. Resume Boundary

The portfolio should not attempt to contain the complete employment history.

Rule:

```text
Portfolio = evidence
Resume    = completeness
```

The homepage should show the breadth of professional systems. The resume can preserve employers, dates, roles, complete project histories, education, certifications, and detailed responsibilities.

Do not rebuild the resume inside the homepage.

---

# 18. Cleanup Existing Components

Search the codebase for components, sections, strings, or routes corresponding to:

```text
work
professional work
case studies
featured work
selected work
independent work
what I do
approach
philosophy
project overview
professional projects
```

Determine whether each is KEEP, MERGE, DELETE, or REDIRECT.

Prefer deletion over preserving redundant components. Remove dead code after the replacement implementation is working. Do not leave unused legacy sections hidden in the source.

---

# 19. Data Model

Where practical, drive deployments and integrations from structured data rather than hardcoding repeated markup.

Example:

```ts
type ExternalReference = {
  name: string;
  url: string;
};

type IntegrationGroup = {
  title: string;
  items: ExternalReference[];
};

type CapabilityGroup = {
  title: string;
  items: string[];
};
```

Something conceptually similar is preferred. We should be able to add/remove a deployment or integration in one location.

Do not over-engineer this into a CMS. A local JavaScript/TypeScript data object is sufficient.

---

# 20. External Link Behavior

For external links use `target="_blank" rel="noopener noreferrer"` or the project's existing safe equivalent.

Make links keyboard accessible. Maintain visible focus states. Do not rely solely on hover to communicate interactivity.

---

# 21. Responsive Behavior

Verify the professional section at mobile, tablet, and desktop.

Long brand lists must wrap naturally.

Do not allow horizontal scrolling, tiny text to force content onto one line, truncated company names, overlapping separators, or broken mid-word wrapping.

The separator-dot format should gracefully wrap. If necessary, render each entry as an inline element with spacing rather than using one giant text node.

---

# 22. SEO / Semantics

Maintain proper semantic hierarchy:

```text
h1 — page identity
h2 — Professional Systems
h3 — Deployments / Integrations / Systems
h4 — ERP Integrations / Warehouse Automation / etc.
```

Do not use headings solely for visual styling.

External company links should retain useful anchor text such as `GNC`, `NetSuite`, and `AutoStore`, not `click here`, `website`, or `learn more`.

---

# 23. Do Not Invent Experience

Critical: do not add any employer, deployment, integration, platform, technology, protocol, or system that is not explicitly listed in this task or already verified in the repository.

Do not infer additional WMS systems from industry experience.

Do not infer SAP, Oracle, Manhattan Associates, Körber, Infor, Epicor, CommerceHub, SPS Commerce, etc. unless they already exist in verified source material.

The professional section must remain defensible.

---

# 24. Verification Pass

After implementing:

1. Run the application build.
2. Run the repository verification/check command.
3. Check the homepage.
4. Check all navigation.
5. Check responsive layouts.
6. Verify every external brand link.
7. Verify no duplicate professional sections remain.
8. Verify no visible references to removed taxonomy remain.
9. Verify old URLs still resolve or redirect appropriately.
10. Check for dead components/imports.
11. Check build/lint/typecheck where applicable.
12. Confirm no content was accidentally removed from the resume.
13. Confirm the three independent projects remain prominent.
14. Run `git diff --check`.
15. **Delete `PORTFOLIO_CLEANUP_PROMPT.md` before the final implementation commit / merge.**

---

# 25. Desired Result

The final visitor experience should feel like:

```text
Here's who I am.
Here's what I've built.
Here are the production systems I've worked with.
Here are the companies and platforms I've deployed/integrated.
Here's proof.
Here's my resume if you need the full history.
```

Not:

```text
Home
→ Work
→ Professional Work
→ Selected Work
→ Case Studies
→ Project
→ About the Project
```

Reduce navigation. Reduce prose. Increase evidence density.

Use real systems, deployments, integrations, and live artifacts as the portfolio.
