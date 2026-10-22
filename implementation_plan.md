# Implementation plan

## Open tasks

### WG-152 — [FEAT] Replace the homepage with the approved one-page site

Replace the panda-only homepage, and the hidden legacy markup kept behind it, with the owner-approved one-page design on `/`. Order: header, introduction, Capabilities, Industries, Integrations, Delivery experience, About, footer. The header keeps the wordmark, Capabilities · Integrations · About fragment links, the preferences control and the no-JS mobile menu, and adds icon links to the architecture demo and the demo's source repository. The introduction is "Software that ships." with one action to Delivery experience. Capabilities shows six groups with an icon on the title line and the live demo links on demo.wizardgang.ai. Industries shows five groups as tags. Integrations keeps the eight historical groups, with self-hosted vendor marks and the WizardGang mark where none exists, and keeps the prior-roles note. Delivery experience lists the v1.3.1 deployments by employer in one collapsible group each, with self-hosted employer marks, organization website links and map links for courts. About is a short first-person introduction with LinkedIn. The footer shows the release version and the build commit, each linked. Keep the dark/light, language, readable-layout and 200% text preferences, Spanish translations, WCAG 2.2 AA behaviour, the CSP, the Worker shortcuts and the root-only route boundary. Update the public-contract tests and current-state docs. No release, version change or deployment.

### WG-153 — [RELEASE] Release the one-page homepage as v1.6.0

Bump `package.json` and `package-lock.json` to 1.6.0 and publish through the governed release-tag, GitHub Release and protected `production` approval path. Hand back the exact pending run URL; the owner approves the deployment. Verify the live version and traffic after approval.
