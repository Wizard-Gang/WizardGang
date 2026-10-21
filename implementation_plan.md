# Implementation plan

## Open tasks

### WG-142 — [RELEASE] Publish the integrations portfolio through the protected release flow

- Dependency: WG-141 merged and resulting-main CI green. Preserve the current published v1.4.0 identity until this task.
- Scope: Bump package and lockfile identity to the next release version authorized for the completed portfolio update and release only through annotated immutable tag, GitHub Release and pinned protected production workflow; do not direct-deploy or bypass approval.
- Acceptance: Required exact-head and resulting-main checks green; annotated tag and Release match merged commit; protected production approval recorded; rollout reaches 100% and public version, health, main navigation, integrations copy, outbound links, stale-route 404 and assets are checked with actual evidence. Stop on provider/authorization blockers.
