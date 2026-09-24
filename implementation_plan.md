# Active implementation plan

**Portfolio plan maintenance notice.** The owner may direct an additive update to this active queue while another task or pull request is in progress. Keep every existing open task and its order; a plan amendment neither implements nor retires it. After the shared policy setup, a routine amendment changes only this plan file. Before merging, re-fetch authoritative `main` and open pull requests, compare the current plan and exact head with the recorded base, and rebase/reconcile if either moved. Require current exact-head checks and mergeability so concurrent work is not overwritten. Any earlier “final task” or “no queue remains” wording applies to its original wave; it keeps this plan while appended tasks remain, and only the actual last task deletes it.

This is WizardGang.ai's current/future process-convergence wave under WG-ARCH-001 §27.

The current company-site architecture, React/TypeScript presentation, route ownership, accessibility contracts, Cloudflare Worker boundary, and local-development lifecycle are already established. This wave does not reopen the landed frontend or information-architecture work. Its purpose is to bring repository governance, npm/toolchain use, controlled changes, CI, merge behavior, tagging, GitHub Releases, and Cloudflare production deployment onto the shared WizardGang delivery model.

Existing history remains immutable and is not retroactively rewritten. The active queue begins at WG-089; completed tasks are retained only in Git/GitHub history.

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

### WG-092 — [OPS] Normalize shared package, workflow, and npm command contracts

- Dependency: WG-090 delivered; portfolio planning policy WG-091 merged. Coordinate with the same normalization task in every public sibling repository.
- Why: Shared versioned tooling, workflow behavior, and npm command meanings have drifted across the public repositories.
- Scope: Inventory every public repository's direct and transitive shared npm packages, package manager, Node pin, lockfile, versioned vendor code, GitHub Action pins, workflow triggers/permissions/toolchain/install/check/advisory/identity/release/deploy steps, and npm scripts. Select one supported version for each shared vendor dependency or document a concrete compatibility exception. Align common scripts and YAML workflows to the same behavior for equivalent capabilities. Keep product-specific commands and explicit local-only/library/no-deploy boundaries. Reconcile AGENTS.md and the byte-identical CONTRIBUTING.md contract across the public set.
- Non-goals: Do not add unused packages, a hosted runtime to a local-only product, or production deployment merely for parity. Do not rewrite published history or unrelated product behavior.
- Acceptance: A fresh cross-repository matrix shows the same version for every shared versioned package/vendor tool where compatible, identical CONTRIBUTING.md bytes, equivalent workflow and npm-script semantics for applicable capabilities, and recorded exceptions with technical reasons. No workflow invokes a missing script; every package lock matches its manifest.
- Validation: Install each public repository with its pinned toolchain and `npm ci`; run `npm run check`, focused workflow/script contract tests, `git diff --check`, exact-head CI, and the separate network/provider gates where applicable. Re-fetch every target's base and this documentation commit before merging to preserve concurrent work.

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
