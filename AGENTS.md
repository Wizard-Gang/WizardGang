# Repository contract

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

Canonical PR/main CI does not yet exist on current `main`; WG-083 owns that boundary. Historical WG-058/WG-059/WG-060 workflow runs are evidence of those historical changes only and must not be described as the current canonical CI path.

The committed repository toolchain authority is Node `26.9.0` with npm `11.19.1`. `.node-version`, `packageManager`, `engines`, `.npmrc`, and the reviewed `allowScripts` policy define the install/runtime boundary.

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
8. merge only the exact verified head;
9. re-fetch merged `main` and confirm the task landed;
10. end with the next open task and a complete kickoff prompt.

The desired steady state is one controlled result on `main` via squash-only merge. Until WG-084 applies provider enforcement, GitHub may still expose merge and rebase options. Treat those live options as provider drift, not policy; controlled delivery should use squash merge.

Completed controlled branches should be removed automatically. Do not make the owner perform repetitive manual branch cleanup. Until WG-084 normalizes provider cleanup, report a retained merged branch truthfully and leave provider convergence to that task.

## Release authority

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
