# Active implementation plan

This is WizardGang.ai's current/future process-convergence wave under WG-ARCH-001 §27.

The current company-site architecture, React/TypeScript presentation, route ownership, accessibility contracts, Cloudflare Worker boundary, and local-development lifecycle are already established. This wave does not reopen the landed frontend or information-architecture work. Its purpose is to bring repository governance, npm/toolchain use, controlled changes, CI, merge behavior, tagging, GitHub Releases, and Cloudflare production deployment onto the shared WizardGang delivery model.

Existing history remains immutable and is not retroactively rewritten. The active queue begins at WG-087; completed tasks are retained only in Git/GitHub history.

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
