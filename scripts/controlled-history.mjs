import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

export const LEGACY_TIP = "029e80db654594e861d64db1574351bd9696f529";
const title = /^\[WG-(\d{3})\] \[([A-Z]+)\] .+$/;
const sections = ["Change", "Reason", "Impact", "Risk", "Controls", "Validation", "Evidence", "Source", "Release/deployment effect"];

export function validateHistory(records, plan, pendingTask = null) {
  const errors = [];
  let expected = 78;
  for (const record of records) {
    const match = title.exec(record.subject);
    if (!match) {
      errors.push(`${record.sha}: invalid controlled title`);
      continue;
    }
    const id = Number(match[1]);
    if (id !== expected) errors.push(`${record.sha}: expected WG-${String(expected).padStart(3, "0")}, found WG-${match[1]}`);
    expected = id + 1;
    if (id >= 80) {
      if (record.parents.length !== 1) errors.push(`WG-${match[1]}: expected one controlled commit parent`);
      for (const section of sections) {
        if (!new RegExp(`(?:^|\\n)${section}:\\s*\\S`, "m").test(record.body)) errors.push(`WG-${match[1]}: missing ${section}`);
      }
    }
  }
  const ids = [...plan.matchAll(/^### WG-(\d{3}) — \[([A-Z]+)\]/gm)].map((m) => Number(m[1]));
  if (pendingTask === expected && ids[0] === expected + 1) expected += 1;
  if (!ids.length) errors.push("active plan has no open WG tasks");
  ids.forEach((id, index) => {
    if (id !== expected + index) errors.push(`active plan expected WG-${String(expected + index).padStart(3, "0")}, found WG-${String(id).padStart(3, "0")}`);
  });
  return errors;
}

export function readCurrentHistory() {
  const raw = execFileSync("git", ["log", "--first-parent", "--reverse", "--format=%H%x1f%P%x1f%s%x1f%b%x1e", `${LEGACY_TIP}..HEAD`], { encoding: "utf8" });
  return raw.split("\x1e").map((entry) => entry.trim()).filter(Boolean).map((entry) => {
    const [sha, parentList, subject, body] = entry.split("\x1f");
    return { sha, parents: parentList.split(" ").filter(Boolean), subject, body };
  });
}

export function validateCurrentHistory() {
  const branch = execFileSync("git", ["branch", "--show-current"], { encoding: "utf8" }).trim();
  const pending = /^wg-(\d{3})-/.exec(branch);
  return validateHistory(readCurrentHistory(), readFileSync("implementation_plan.md", "utf8"), pending ? Number(pending[1]) : null);
}
