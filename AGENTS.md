# Repository contract

## Portfolio plan maintenance

An explicit owner-directed portfolio planning request may append or clarify future tasks while the first open implementation task or its pull request remains active. Preserve all existing open tasks and their order; the maintenance change does not deliver, retire, or skip one. Reserve a separate controlled maintenance ID outside the implementation task headings: normally the first unassigned ID after the queued IDs, or an existing unassigned gap when the repository history contract requires it. Once this policy setup is merged, routine amendments change only the active implementation plan file. This exception is for planning edits, not implementation or provider mutation.

Record authoritative `main` and the plan's base before editing. Immediately before a maintenance merge, re-fetch `main`, open pull requests, the exact head, checks, and mergeability. If `main` or the plan moved, rebase and reconcile the additive plan edit, then revalidate the new exact head. Only the actual last remaining task deletes the plan. The normal first-open-task rule still governs the next implementation delivery.

This file is the automation and controlled-delivery authority for `Wizard-Gang/WizardGang`. Product and current-state authority remains in [README.md](README.md), [docs/INFORMATION-ARCHITECTURE.md](docs/INFORMATION-ARCHITECTURE.md), [docs/OWNERSHIP.md](docs/OWNERSHIP.md), and [SECURITY.md](SECURITY.md).

Do not reconstruct current behavior from old conversations, old workflow runs, or retired branches when live repository/provider state and current files are available.

## Task selection

On **do needful**:

1. Re-fetch current `main` and authoritative GitHub/provider state.
2. Inspect open pull requests and `implementation_plan.md`.
3. If an authoritative current PR already exists for the first open task, finish that PR instead of duplicating the work.
4. Otherwise select only the first open task in `implementation_plan.md`.
5. Do not skip a blocked first task without owner direction.
6. Do not begin the next task in the same delivery.

`implementation_plan.md` is the active queue. It contains current/future work only.

## Controlled identity

Prospective controlled process work uses `WG-NNN`. WG-078 begins the current normalization wave; published history before or during that transition is immutable and is not rewritten merely because older commits used different conventions.

Use branch names:

`wg-nnn-short-kebab-summary`

Use commit and pull-request titles:

`[WG-NNN] [TYPE] Imperative summary`

Use the type assigned by the task and the repository's established vocabulary, such as `DOCS`, `BUILD`, `TEST`, `OPS`, `FIX`, `FEAT`, `REFACTOR`, or `CONTENT`. Do not invent a parallel type system.

One controlled task is one delivery. Keep unrelated or later work out of the branch and PR even when it is nearby.

## Controlled body

A controlled commit/PR body should record the facts needed to review and reproduce the change:

- **Change** — what changed.
- **Reason** — why this task exists.
- **Impact** — affected repository/product behavior.
- **Risk** — meaningful failure modes or `Low` when appropriate.
- **Controls** — boundaries that constrained the change.
- **Validation** — checks actually run.
- **Evidence** — provider/runtime evidence that actually exists.
- **Source** — current authorities used.
- **Release/deployment effect** — state explicitly when relevant; ordinary tasks normally have none.

Do not pre-write evidence that has not been observed.

## Validation and evidence

The canonical credential-free repository acceptance gate is:

`npm run check`

Run focused tests appropriate to the change and run `git diff --check` before delivery. Inspect the complete diff, not only the files you expected to change.

Repository validation and provider evidence are separate facts. Do not claim that CI passed, a GitHub setting changed, a tag exists, a GitHub Release exists, production deployed, or a branch was deleted until authoritative provider state proves it.

`.github/workflows/ci.yml` runs credential-free `npm run check` on the exact PR head and merged `main`. Pull requests also require the `change-id` identity check. A separate scheduled or manually dispatched dependency-advisory workflow owns the network registry gate.

`config/github-repository-settings.json` is the committed GitHub administration authority. `npm run test:github-settings` is pure; `npm run verify:github-settings` reads live state with `GH_ADMIN_TOKEN` or an authorized `GH_TOKEN`; `npm run apply:github-settings` is the explicit mutation command and independently re-reads the result. Neither token belongs in files, output, or `npm run check`.

`npm run check:history` validates prospective first-parent WG identity, controlled records, and the active plan against the immutable pre-WG-078 history tip. `npm run check:patch-integrity` validates an explicit committed range when `PATCH_BASE_SHA` and `PATCH_HEAD_SHA` are supplied together. Both are part of credential-free `npm run check`.

The committed repository toolchain authority is Node `26.9.0` with npm `11.19.1`. `.node-version`, `packageManager`, `engines`, `.npmrc`, and the reviewed `allowScripts` policy define the install/runtime boundary.

Build identity is derived from Git rather than caller-supplied commit text. `version.json` carries product, release identity, the full commit, and commit-derived build time. Untagged or dirty ordinary builds remain explicitly development/dirty. `npm run test:release-identity` exercises the fail-closed fixtures; `npm run verify:release-identity -- vMAJOR.MINOR.PATCH` accepts only an annotated semantic release tag that matches `package.json` and resolves to the checked-out commit. Exact release verification is intentionally separate from ordinary `npm run check` so an untagged development checkout remains valid.

## Plan lifecycle

Every delivering change removes its own completed task block from `implementation_plan.md` and preserves later work. Only current/future work belongs in the file.

The final queued task deletes `implementation_plan.md`. Completed evidence remains in immutable Git history, PRs, Actions, tags, GitHub Releases, and deployment records rather than in the active plan.

## Delivery and merge

Normal controlled delivery is:

1. branch from freshly verified `main`;
2. implement only the selected task;
3. run focused validation, `npm run check` when an executable checkout is available, and `git diff --check`;
4. inspect the full diff;
5. create one controlled commit;
6. open the PR;
7. re-fetch the exact PR head, current `main`, ahead/behind state, commit count, mergeability, reviews, and relevant provider settings;
8. squash only the exact validated head into one controlled commit on `main`;
9. re-fetch merged `main`, confirm the one controlled commit and post-merge CI, and verify branch deletion;
10. end with the next open task and a complete kickoff prompt.

The required provider policy permits only squash merges, requires current-with-main `verify` and `change-id`, blocks direct normal pushes, force pushes and branch deletion, and has zero bypass actors.

Completed controlled branches are deleted automatically. Verify cleanup rather than asking the owner to perform it.

## Release authority

Canonical CI owns release-tag creation. Its `release-tag` job runs only for merged `main` after `verify` succeeds. `scripts/release-tag.mjs` compares the direct parent and merged commit versions in both `package.json` and `package-lock.json`; unchanged versions are a no-op. A strictly increasing exact SemVer transition may create one annotated `vX.Y.Z` tag on that exact merged commit. A matching existing annotated tag is idempotent; lightweight tags or tags pointing elsewhere fail closed and are never rewritten.

After `release-tag` reconciles an exact tag on merged `main`, it exposes that tag to the dependent `release` job. `release` checks out that exact tag with full Git history, pins the committed Node/npm toolchain, runs `npm ci` and `npm run check`, verifies exact tag/package/commit identity, and publishes with `gh release create --verify-tag`. A rerun verifies an existing non-draft, non-prerelease GitHub Release for the same immutable tag instead of editing, deleting, or replacing it. The release job does not deploy production; WG-088 owns that boundary.

Ordinary feature, fix, documentation, test, build, refactor, content, and process merges are **not releases**.

The governed release path is:

`controlled version bump`
→ `exact-head CI`
→ `squash merge`
→ `annotated immutable vX.Y.Z tag`
→ `reproduce exact tag`
→ `GitHub Release`
→ `deploy exact released tag`
→ `verify production identity`

Do not create, move, delete, or publish release tags or GitHub Releases outside the task that explicitly owns that operation.

## Deployment authority

WizardGang.ai production is **Cloudflare-only**. Do not introduce another production host.

Current `deploy:production` can still deploy an arbitrary checkout; that is an observed transitional capability, not final authority. WG-088 owns the fail-closed production boundary. Until then, ordinary controlled tasks do not deploy production unless their task explicitly says so.

## End-of-turn handoff

After a delivery, re-read `implementation_plan.md`, confirm the delivered task is gone, identify the new first open task, and provide a complete kickoff prompt that re-fetches fresh state and does not authorize later tasks.
