# Contributing

WizardGang.ai is a production company site. Keep changes narrow, current-state, and consistent with the repository contract in [AGENTS.md](AGENTS.md).

## Install and local development

Install the locked dependency graph:

```bash
npm ci
```

The exact shared Node/npm pin is not yet repository authority; WG-080 owns that normalization. Do not invent a version requirement before it lands.

Start the safe checkout-owned local environment:

```bash
npm run dev
```

The lifecycle builds the site, starts the local Vite/Cloudflare Worker processes, opens the local URL, and only cleans up processes proven to belong to this checkout.

## Acceptance and focused tests

The canonical credential-free acceptance gate is:

```bash
npm run check
```

Useful focused checks include:

```bash
npm run test:docs
npm run test:accessibility
npm run test:frontend-authority
npm run test:navigation
npm run test:browser
npm run test:dev
```

Run `git diff --check` and inspect the complete diff before opening a PR.

For visual or interaction changes, verify the affected canonical routes, keyboard behavior, responsive behavior, text resizing, motion/reduced-motion behavior, and accessibility expectations in [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md). Do not fabricate visual evidence for documentation-only work.

## Controlled changes

Follow [AGENTS.md](AGENTS.md) for full automation semantics.

In short:

- take only the first open task from `implementation_plan.md`;
- use `wg-nnn-short-kebab-summary`;
- title the commit and PR as `[WG-NNN] [TYPE] Imperative summary`;
- keep one controlled task per delivery;
- record validation and evidence truthfully;
- remove the delivered task from the active plan;
- target one squash result on `main`.

GitHub provider state is separate from local repository validation. A normal merged change is not a release, and a release is not a production deployment. Production is Cloudflare-only.

## Security, ownership, and architecture

Report vulnerabilities using [SECURITY.md](SECURITY.md); do not open public issues for unpatched security defects.

Source/system ownership and the professional-record attribution boundary are documented in [docs/OWNERSHIP.md](docs/OWNERSHIP.md). Current route and frontend/runtime architecture are documented in [docs/INFORMATION-ARCHITECTURE.md](docs/INFORMATION-ARCHITECTURE.md). Source, font, and third-party mark licensing boundaries are documented in [LICENSE.md](LICENSE.md).
