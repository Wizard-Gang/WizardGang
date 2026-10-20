# Lean single-page public contract

WG-137 protects the one-page service-first site at /, its four fragment anchors, and the ordinary noindex 404.
The site is a static React render, enhanced only for menu and display preferences; wg-edge remains vendored and unchanged.

## Automated scope

- The focused lean-public-contract tests are included in npm run check.
- CI uses pinned npm ci and npm run check, then repeats accessibility, navigation, browser and frontend-focused tests and runs npm run deploy:dry-run without production credentials.
- Structural checks cover services, prior-employer attribution, direct mail, mobile/no-JS menu, focus CSS, reflow rules, Spanish control labels, sitemap, metadata, retired routes, outbound URLs, CSP, and Worker asset fallback.
- Existing Worker and platform tests continue to check wg-edge host/TLS/health/version/admin/logging/security boundaries and pin integrity.

## Distinct manual acceptance before WG-138

Passing automated tests does not prove actual browser-measured zero horizontal scroll, assistive-technology announcements, or uptime of external destinations.
Record real-browser observations at 320px and 375px mobile widths, desktop width, 200% site text, 400% browser zoom, keyboard-only navigation, JavaScript disabled, dark/light themes, Spanish content, and each external link.
Confirm focus visibility and menu behavior while changing width, each anchor landing position, content clarity and site response statuses.
Do not claim any unperformed visual, screen-reader, browser or live outbound test passed.

No release, version bump, deployment, settings mutation or production modification is part of WG-137.
