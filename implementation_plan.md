# Active implementation plan

This is WizardGang.ai's current/future process-convergence wave under WG-ARCH-001 §27.

The current company-site architecture, React/TypeScript presentation, route ownership, accessibility contracts, Cloudflare Worker boundary, and local-development lifecycle are already established. This wave does not reopen the landed frontend or information-architecture work. Its purpose is to bring repository governance, npm/toolchain use, controlled changes, CI, merge behavior, tagging, GitHub Releases, and Cloudflare production deployment onto the shared WizardGang delivery model.

Existing history remains immutable and is not retroactively rewritten. The active queue begins at WG-081; the WG-078 planning delivery and WG-079 repository-contract delivery are retained only in Git/GitHub history.

The target delivery path is:

```text
branch
→ npm ci
→ npm run check
→ pull request
→ exact-head CI
→ squash merge
→ verify main
→ explicit version-bump release change
→ annotated immutable tag
→ reproduce tagged source
→ GitHub Release
→ deploy exact released tag
→ verify deployed release + commit
```

A release is initiated through an ordinary controlled version-bump PR rather than an untracked manual production command. This keeps tagging, publication, and deployment reachable through the same reviewed GitHub path used for every other change.

Production remains Cloudflare-only. No normalization task introduces another hosting or deployment provider.

## Open tasks

### WG-081 — [BUILD] Enforce prospective controlled history and patch integrity

- Dependency: WG-080 merged.
- Why: WG IDs currently exist by convention but are not mechanically enforced.
- Scope: Establish the pre-WG-078 history as immutable legacy history and validate prospective WG sequencing, controlled commit structure, active-plan lifecycle, and committed patch integrity. Add deterministic fixture tests and compose the credential-free portions into `npm run check`.
- Non-goals: No rewriting old WG history and no provider-authenticated checks inside `check`.
- Acceptance: Missing, duplicate, or out-of-sequence prospective WG identities, malformed controlled records, completed tasks retained in the active plan, and committed whitespace defects fail focused tests.
- Validation: Focused validator tests; `npm run check`; `git diff --check`.

### WG-082 — [TEST] Commit pure GitHub repository-settings expectations

- Dependency: WG-081 merged.
- Why: Provider behavior currently has no committed source of truth.
- Scope: Add `config/github-repository-settings.json` plus credential-free comparison logic and tests.
- Expected state:
  - default branch `main`;
  - squash merge enabled;
  - merge commits disabled;
  - rebase merges disabled;
  - merged branches deleted automatically;
  - branch updates allowed;
  - `main` requires pull requests and required CI;
  - deletion and force/non-fast-forward changes blocked;
  - `v*` tags cannot be updated or deleted.
- Non-goals: Do not mutate GitHub settings in this task.
- Acceptance: Pure tests fail on representative merge-policy, required-check, branch, or tag-ruleset drift.
- Validation: Settings comparison tests; `npm run check`; `git diff --check`.

### WG-083 — [BUILD] Run canonical acceptance on pull requests and main

- Dependency: WG-082 merged.
- Why: WizardGang currently has no GitHub Actions workflow.
- Scope: Add `.github/workflows/ci.yml` for PRs targeting `main` and pushes to `main`. Check out the exact revision, resolve the committed Node/npm toolchain, run `npm ci`, and invoke canonical `npm run check` once. Validate controlled PR identity through a named CI boundary.
- Security: Add the explicit registry-backed dependency-advisory gate required by the shared baseline while keeping credential-free repository acceptance distinct from live/provider checks.
- Non-goals: No release, production deployment, or repository-settings mutation.
- Acceptance: PR-head and merged-main CI exercise the same repository acceptance contract and expose stable required status contexts.
- Validation: Workflow contract tests where practical; exact-head CI; merged-main CI; `npm run check`; `git diff --check`.

### WG-084 — [OPS] Normalize live GitHub settings and branch hygiene

- Dependency: WG-083 merged and stable CI status contexts exist.
- Why: `main` is currently unprotected; merge, squash, and rebase are all enabled; merged-branch deletion is disabled; old WG branches remain.
- Scope: Add documented provider-aware verify/apply commands, then reconcile live GitHub state to the committed settings authority. Enable squash-only controlled merges, automatic branch deletion, `main` protection, required CI, and immutable `v*` tag rules. Remove stale `wg-*` branches only after proving they contain no unmerged work.
- Non-goals: Never delete an unmerged branch merely because it is old. Never weaken protection to simplify automation.
- Acceptance: Read-only live verification exactly matches committed expectations. Historical merged branches are removed or any branch with unique work is explicitly retained and reported.
- Blocker rule: If the available credential/provider cannot perform a required admin action, leave the task open and record the exact blocker rather than claiming parity.
- Validation: Pure settings tests; live verification; `npm run check`; provider evidence; `git diff --check`.

### WG-085 — [BUILD] Make release identity reproducible

- Dependency: WG-084 merged.
- Why: Current `version.json` records a commit and build timestamp but has no authoritative released SemVer identity.
- Scope: Align build metadata with the shared release identity contract, including product, release/version, exact commit, and build time. Add an exact release-identity validator requiring semantic `vMAJOR.MINOR.PATCH`, matching `package.json` version, an annotated tag, and the tag resolving to the checked-out commit.
- Local behavior: Ordinary development builds remain possible without pretending to be releases.
- Non-goals: Do not create a tag, GitHub Release, or production deployment.
- Acceptance: A mismatched package version, lightweight tag, wrong commit, malformed tag, or forged release build fails before publication.
- Validation: Release-identity fixtures; production build; `npm run check`; `git diff --check`.

### WG-086 — [BUILD] Create immutable release tags from merged version changes

- Dependency: WG-085 merged.
- Why: Release initiation should use the normal controlled PR/merge path instead of requiring a separate manual tagging operation.
- Scope: Add release automation that detects an accepted `package.json` version change on `main`, proves the version transition is intentional and unreleased, and creates the corresponding annotated `vX.Y.Z` tag on that exact merged commit.
- Safety: Ordinary pushes to `main` without a version change create no tag. Reruns are idempotent. An existing tag pointing elsewhere is a hard failure and is never rewritten.
- Non-goals: No production deployment yet.
- Acceptance: A normal controlled version-bump PR can cause exactly one immutable annotated tag to be created after merge, with no manual workstation tagging step.
- Validation: Tagging-contract tests; workflow validation; `npm run check`; controlled provider test where safe.

### WG-087 — [BUILD] Publish GitHub Releases from exact tagged state

- Dependency: WG-086 merged.
- Why: GitHub Releases must become the historical release authority.
- Scope: Reproduce the newly annotated tag with the committed toolchain, `npm ci`, and `npm run check`; validate exact tag/package/commit identity; then publish the GitHub Release with GitHub CLI using `gh release create --verify-tag`.
- Ordering: Publication must succeed before any production deployment is eligible to run.
- Retry behavior: A rerun must verify existing matching immutable release state rather than rewriting history.
- Non-goals: No `CHANGELOG.md` or per-version Markdown archive.
- Acceptance: Every published release corresponds to one immutable annotated tag, one exact commit, and the matching package version.
- Validation: Release workflow tests; exact tagged reproduction; GitHub Release provider evidence.

### WG-088 — [OPS] Deploy production only from accepted release state

- Dependency: WG-087 merged.
- Why: `npm run deploy:production` can currently publish whatever checkout invoked it.
- Scope: Make production deployment reachable only after successful release publication. Deploy the exact annotated/released tag through the protected `production` environment with Cloudflare Wrangler. Preserve staging and safe dry-run capabilities, but remove or fail-closed guard any arbitrary-checkout path to production.
- Concurrency: Production deployments serialize and do not cancel an in-progress deployment.
- Non-goals: No alternative hosting platform and no deployment from arbitrary `main`.
- Acceptance: An untagged checkout, mismatched release identity, or unpublished tag cannot deploy production.
- Validation: Deployment-boundary tests; Wrangler dry run; `npm run check`; workflow validation.

### WG-089 — [TEST] Prove release and deployed identity end to end

- Dependency: WG-088 merged.
- Why: Release identity and deployment evidence are distinct controls and both need regression protection.
- Scope: Add focused tests for tag → reproduce → publish → deploy ordering and fail-closed production prerequisites. After Wrangler deployment, capture the deployed Cloudflare version, confirm it is serving production, then verify public `wizardgang.ai/version.json` reports the expected release and commit.
- Non-goals: Do not turn workflow YAML wording into a brittle prose snapshot.
- Acceptance: Publication cannot move after deployment, deployment cannot bypass release publication, and a wrong production release/commit fails verification.
- Validation: Focused release/deploy tests; `npm run check`; authenticated Cloudflare deployment evidence; public identity check.

### WG-090 — [OPS] Publish the first governed WizardGang.ai release

- Dependency: WG-089 merged and live repository settings match committed authority.
- Why: The standardized process is not proven until the repository uses it once end to end.
- Scope: Make one controlled version-bump release change. The expected next release from the current `1.0.0` package line is `v1.1.0` unless intervening product scope justifies a different owner-approved SemVer.
- Required path: version-bump PR → exact-head CI → squash merge → annotated tag → tagged-state reproduction → GitHub Release → production deploy → deployed identity verification.
- Non-goals: No unrelated product changes in the release change.
- Acceptance: GitHub shows the immutable annotated tag and GitHub Release, the release workflow is green, Cloudflare production was deployed only after publication, and live `version.json` identifies the same release and commit.
- Validation: Full provider evidence plus the canonical repository and production checks above.

## Invariants for the whole wave

- Preserve the current seven-route company-site architecture and current product boundaries.
- Preserve the safe checkout-owned `npm run dev` lifecycle.
- `npm run check` remains the single canonical credential-free repository acceptance gate.
- Provider-aware verification is explicit and never hidden inside local acceptance.
- Human-controlled WG changes land as one squash commit once squash-only enforcement is active.
- Published commits, tags, and Releases are never rewritten.
- Production is Cloudflare-only and is never sourced from an arbitrary checkout.
- A completed task is removed from this file by its delivering change.
- The final task deletes this file; Git, PRs, Actions, tags, Releases, and deployment evidence retain history.

## Recheck after this wave

Re-audit WizardGang.ai and the other active repositories from fresh provider state. Use the resulting WizardGang process as one candidate common reference for normal npm/CI/merge/tag/release/deploy semantics, while preserving explicit N/A boundaries for repositories that do not have a hosted production surface.
