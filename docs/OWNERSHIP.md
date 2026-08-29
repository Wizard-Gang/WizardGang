# Public source ownership

Effective date: 2026-08-29 (America/New_York)

WizardGang is the portfolio boundary. Product implementations, operational controls, tests,
reconstruction evidence, and releases belong to their canonical public repositories.

| Surface | Canonical source | Public release at verification | Ownership |
| --- | --- | --- | --- |
| `wizardgang.ai` | [`Wizard-Gang/WizardGang`](https://github.com/Wizard-Gang/WizardGang) | `main` | Static portfolio, project metadata, presentation assets, and temporary stateless compatibility routes |
| `sharktank.wizardgang.ai` | [`SouthernGentlemen/SharkTank`](https://github.com/SouthernGentlemen/SharkTank) | `v1.0.2` | Runtime, Cloudflare infrastructure, Durable Objects, WebSockets, APIs, security, operations, governance, evidence, tests, and deployment |
| `hexframe.wizardgang.ai` | [`SouthernGentlemen/Hexframe`](https://github.com/SouthernGentlemen/Hexframe) | `v0.7.2` | Deterministic combat runtime, authored content, rollback, training lab, tests, and deployment |
| YarReader offline workspace | [`SouthernGentlemen/YarReader`](https://github.com/SouthernGentlemen/YarReader) | `v1.0.1` | Ingestion, inspection, classification, review, normalization, crash-recoverable archive, static export, portable reader, tests, and reconstruction record |

## Retired sources

`WizardGangLocal` is retired. It is not a canonical source, deployment input, or recovery
dependency. The public SharkTank repository contains the reconstructed product code and the
architecture, controls, tests, provenance, and release records needed to maintain the product.

ShadowMoney is retired as a product identity. Its public traffic redirects to Hexframe; historical
rollback evidence remains separate from the portfolio.

## Data boundary

Git contains source, configuration, documentation, synthetic fixtures, and reproducible tests.
Cloudflare runtime state, credentials, operator secrets, personal library metadata, publication
files, and publisher-owned media do not belong in public history.

Product-specific recovery procedures live with each product. WizardGang must link to those records
rather than duplicate the implementation or become a second source of truth.

## Verification

The ownership cutover is complete when all of the following remain true:

- each product case study links to the exact canonical repository root;
- the portfolio build rejects retired or non-canonical source URLs;
- product code is absent from WizardGang;
- the SharkTank, Hexframe, and YarReader repositories are public and publish their own releases;
- no production secret, runtime state, private catalog value, or copyrighted publication asset is
  copied into portfolio source or generated output.
