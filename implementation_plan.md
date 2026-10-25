# Implementation plan

## Open tasks

### WG-158 — [DOCS] Make AGENTS.md a lean contract for cloud agents

Replace the read-everything `AGENTS.md` with a lean contract, as RigLab RL-056 and RenderLab RLDR-006 did on 2026-10-25, written so a ChatGPT Codex cloud task can follow it from a GitHub checkout with no access to the owner's machine. `AGENTS.md` becomes the only required reading; other docs are looked up by range with `grep -n`, `sed -n` or `awk`. It states the delivery and merge gates explicitly, gives container-runnable setup and validation commands from the committed Node/npm pins, says what a cloud agent can and cannot do (provider settings, releases and production approval stay with the owner), and adds a "Keep sessions cheap" section: read by range, one blocking CI wait, a handoff of 25 lines or fewer. It names no local-only paths, hooks, ports or admin credentials. Keep the queue, `npm run check`, squash and hot-fix wording that `tests/documentation-current-state.test.mjs` asserts. Update the `AGENTS.md` pin in `scripts/check-portfolio-contract.mjs`; `CONTRIBUTING.md` and its pin stay unchanged. No release, version change or deployment.
