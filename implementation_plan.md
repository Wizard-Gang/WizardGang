# Active implementation plan

**Portfolio plan maintenance notice.** The owner may direct an additive update to this active queue while another task or pull request is in progress. Keep every existing open task and its order; a plan amendment neither implements nor retires it. After the shared policy setup, a routine amendment changes only this plan file. Before merging, re-fetch authoritative `main` and open pull requests, compare the current plan and exact head with the recorded base, and rebase/reconcile if either moved. Require current exact-head checks and mergeability so concurrent work is not overwritten. Any earlier “final task” or “no queue remains” wording applies to its original wave; it keeps this plan while appended tasks remain, and only the actual last task deletes it.

This is WizardGang.ai's current/future process-convergence wave under WG-ARCH-001 §27.

The current company-site architecture, React/TypeScript presentation, route ownership, accessibility contracts, Cloudflare Worker boundary, and local-development lifecycle are already established. This wave does not reopen the landed frontend or information-architecture work. Its purpose is to bring repository governance, npm/toolchain use, controlled changes, CI, merge behavior, tagging, GitHub Releases, and Cloudflare production deployment onto the shared WizardGang delivery model.

Existing history remains immutable and is not retroactively rewritten. The active queue begins at WG-092; completed tasks are retained only in Git/GitHub history.

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

## Immediate provider recovery prerequisite — complete governed v1.1.0 production identity

WG-090 successfully published immutable release identity but did not complete production deployment. This prerequisite is provider recovery, not a new product/change-management implementation task, and it must complete before WG-092 begins.

Fresh observed release state after WG-090:

- authoritative `main`: `f80370a1304bf66f9f1fa1d4fd6fa0557b045f15`;
- annotated immutable tag `v1.1.0` resolves to that exact commit;
- GitHub Release `v1.1.0` exists as published, non-draft, and non-prerelease;
- CI #31 / run `36045572180` passed merged-main verification, release-tag reconciliation, exact-tag reproduction, and GitHub Release publication;
- `deploy-production` failed before Wrangler could make a production request because the protected `production` environment supplied an empty `CLOUDFLARE_API_TOKEN`;
- therefore no WG-090 Cloudflare production mutation, captured Worker Version ID, 100%-traffic provider proof, or public `wizardgang.ai/version.json` convergence evidence exists yet.

Required recovery before WG-092:

1. From an authorized operator context, create or rotate an active Cloudflare API token with the permissions required by the existing production Worker deployment contract. Verify Cloudflare reports the token active.
2. Store that token only as the GitHub `production` environment secret named `CLOUDFLARE_API_TOKEN` for `Wizard-Gang/WizardGang`, and verify secret metadata exists without exposing the token value. The repository-owned discovery/rotation scripts may be used where an interactive authorized shell is available.
3. Re-fetch authoritative `main`, `v1.1.0`, GitHub Release `v1.1.0`, the production environment boundary, and CI #31 before retrying. Do not move, delete, replace, or republish the existing tag or Release.
4. Retry the governed CI release/deployment path for the same immutable `v1.1.0` state. Use GitHub's retry mechanism; if successful release/tag jobs are rerun, they must verify existing matching immutable state rather than rewrite it.
5. Require the retried `deploy-production` job to deploy only the exact published `v1.1.0` checkout and capture Wrangler's structured Cloudflare Worker Version ID.
6. Query Cloudflare with `wrangler deployments list --env production --json` and require the newest production deployment to route exactly 100% of traffic to that captured Worker Version ID.
7. Require public `https://wizardgang.ai/version.json` to converge on release `v1.1.0` and commit `f80370a1304bf66f9f1fa1d4fd6fa0557b045f15`.
8. Record only evidence that actually exists. If the retry fails after provider interaction begins, retrieve the complete exact failing job evidence first, preserve the immutable tag/Release/history, and correct forward.
9. Consider this prerequisite complete only when the governed workflow is green through production deployment, provider traffic proof, and public identity proof. Remove this temporary prerequisite from the active plan when the next controlled planning/delivery change records that completion.

Non-goals: no new version bump, replacement tag, replacement GitHub Release, arbitrary-checkout production deploy, alternate hosting provider, ruleset weakening, or WG-092 implementation as part of this recovery.

## Open tasks

### WG-092 — [OPS] Normalize shared package, workflow, and npm command contracts

- Dependency: WG-090 delivered; the immediate governed v1.1.0 provider recovery prerequisite above is complete; portfolio planning policy WG-091 merged. Coordinate with the same normalization task in every public sibling repository.
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
