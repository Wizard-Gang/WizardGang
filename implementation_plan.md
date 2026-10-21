# Implementation plan

## Open tasks

### WG-145 — [RELEASE] Publish the historical integrations correction as v1.5.1

- Dependency: WG-144 merged and resulting-main CI green, with the compact historical portfolio verified against the retired /solutions/ source.
- Scope: Advance only package.json and package-lock.json to 1.5.1, remove the completed task from the permanent queue and publish the exact accepted commit through the canonical annotated v1.5.1 tag, non-draft GitHub Release and pinned baseline protected production workflow.
- Acceptance: Exact-head verify/change-id and resulting-main CI green; annotated tag resolves to the merged release commit; published GitHub Release matches; protected production approval is independently recorded; Cloudflare traffic 100% on that release; live /version.json matches wizardgang 1.5.1 and the release commit; root presents historical integration rows, retired pages return 404, health/assets pass. No bypass, direct Wrangler publish, DNS or secrets/settings mutations. Stop on unapproved production gate or provider error.
