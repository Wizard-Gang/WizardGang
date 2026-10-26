# Implementation plan

## Open tasks

### WG-164 — [RELEASE] Release the footer fix as v1.7.2

Bump `package.json` and both `package-lock.json` version fields from 1.7.1 to 1.7.2 so WG-162 reaches wizardgang.ai: the footer shows `v1.7.2` linked to its GitHub Release instead of `vv1.7.1`, and no longer repeats the header's demo-source link. The main push tags v1.7.2, publishes the Release and requests the protected `production` deployment, which the owner approves; v1.7.1 remains the rollback. No other change.
