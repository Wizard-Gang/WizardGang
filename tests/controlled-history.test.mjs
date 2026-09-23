import assert from "node:assert/strict";
import { test } from "node:test";
import { validateHistory } from "../scripts/controlled-history.mjs";

const body = "Change: yes\nReason: yes\nImpact: yes\nRisk: Low\nControls: yes\nValidation: yes\nEvidence: yes\nSource: yes\nRelease/deployment effect: None.";
const records = [78, 79, 80].map((n) => ({ sha: `sha${n}`, parents: ["parent"], subject: `[WG-${String(n).padStart(3, "0")}] [BUILD] Deliver task`, body }));
const plan = "### WG-081 — [BUILD] Current\n### WG-082 — [TEST] Next\n";

test("sequential controlled records and active plan pass", () => {
  assert.deepEqual(validateHistory(records, plan), []);
});
test("missing, duplicate, or out-of-sequence identities fail", () => {
  assert.match(validateHistory([records[0], records[2]], plan).join(" "), /expected WG-079/);
  assert.match(validateHistory([...records, records[2]], plan).join(" "), /expected WG-081/);
});
test("malformed controlled body or retained completed plan task fails", () => {
  assert.match(validateHistory([...records.slice(0, 2), { ...records[2], body: "" }], plan).join(" "), /missing Change/);
  assert.match(validateHistory(records, "### WG-080 — [BUILD] Done\n" ).join(" "), /expected WG-081/);
});
