# Implementation plan

## Open tasks

### WG-141 — [CONTENT] Build an integrations-first portfolio inspired by Phantom Insights

- Dependency: WG-140 plan-only change merged and resulting-main CI green.
- Scope: Replace the generic Experience block with substantive, accurately attributed prior integration implementations (warehouse/ERP cutover, shipping compliance/WMS-WCS/PLC/print-and-apply, carrier/fulfillment, data reconciliation and regulated case reporting). Remove the Contact section and every visitor-facing direct email link from home and footer. Retain non-email portfolio destinations (GitHub/LinkedIn/build). Make the single-page navigation Services, Integrations, About and update no-JS/mobile, English/Spanish translations, SEO, architecture docs, source contracts and acceptance. Take typography and visual cues from phantom.im (Phantom Insights): clear confident copy, generous whitespace, prominent portfolio examples and purposeful visual hierarchy, without copying assets, third-party text, or violating self-hosted font/CSP/accessibility boundaries. Do not invent WizardGang client relationships, protected customer details, testimonial claims or outcomes.
- Acceptance: Zero generated `mailto:` links, no Contact navigation/section, integration case studies visible and independently sourced to prior professional roles, vendor names linked only to official HTTPS sites if displayed as links, responsive/mobile/no-JS and Spanish support, keyboard/focus/200% reflow, accessibility/security/CSP and wg-edge preserved; pinned npm ci, canonical check, focused tests, deploy dry-run, exact-head verify/change-id and resulting-main CI green. No version change, tag, Release or deployment.

### WG-142 — [RELEASE] Publish the integrations portfolio through the protected release flow

- Dependency: WG-141 merged and resulting-main CI green. Preserve the current published v1.4.0 identity until this task.
- Scope: Bump package and lockfile identity to the next release version authorized for the completed portfolio update and release only through annotated immutable tag, GitHub Release and pinned protected production workflow; do not direct-deploy or bypass approval.
- Acceptance: Required exact-head and resulting-main checks green; annotated tag and Release match merged commit; protected production approval recorded; rollout reaches 100% and public version, health, main navigation, integrations copy, outbound links, stale-route 404 and assets are checked with actual evidence. Stop on provider/authorization blockers.
