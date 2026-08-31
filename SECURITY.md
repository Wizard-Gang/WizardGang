# Security policy

## Supported surface

Security reports for the current `wizardgang.ai` portfolio and its stateless compatibility Worker
are accepted. SharkTank, Hexframe, and YarReader are separate products; report product-specific
issues through their canonical public repositories or operating sites.

## Report privately

Email `jacob@wizardgang.ai` with the affected URL, impact, and minimal reproduction steps.
Please do not open a public issue for an unpatched vulnerability and do not include passwords,
private records, credentials, destructive proof, or data belonging to another person.

Reports are reviewed by Jacob Yongue. A useful report identifies the affected surface, explains the
expected and observed behavior, and includes a safe proof when one is available.

## Portfolio boundary

The portfolio serves generated HTML, CSS, a first-party preferences script, and public media through
Cloudflare. It does not accept visitor accounts, passwords, payments, uploads, or form submissions.
Security headers, automated release checks, a development deployment, versioned source, and rollback
reduce the public attack surface. These controls reduce risk; they do not guarantee that defects or
incidents cannot occur.
