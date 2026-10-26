# Implementation plan

## Open tasks

### WG-168 — [RELEASE] Release the updated /sl page as v1.7.3

Bump `package.json` and `package-lock.json` from 1.7.2 to 1.7.3 so WG-166 and WG-167 reach wizardgang.ai through the protected `production` approval. Before merging, confirm that `https://wizardgang.ai/sl/media/<name>.webp` returns 200 for all 32 new photos. The release must not ship slides whose photos are missing from R2.
