# Implementation plan

## Open tasks

### WG-150 — [DOCS] Establish owner-directed hot-fix release and deployment protocol

Update `AGENTS.md` and the relevant release-management documentation to define a one-prompt `hot fix <feature>` workflow. A hot fix is explicit owner authorization to prioritize the named feature, deliver it through governed branch, tests, exact-head CI, squash merge, immutable versioned release, and protected production deployment approval. Automatically follow the release CI run through to its exact pending production approval URL and return that URL, rather than a generic Actions link. Distinguish an existing-tag redeploy from a new version release. Document the observed lessons: inspect the real CI YAML and current run; GitHub's main-push release tag job triggers the release and protected deployment; a connector missing dispatch controls is not evidence deployment is impossible; do not fabricate run IDs, approvals or completion. Preserve security and protected approval, report an actual blocker with run/PR links if one prevents reaching approval. Add appropriate focused tests or contract checks for this behavior.
