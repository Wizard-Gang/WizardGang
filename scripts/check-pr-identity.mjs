import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
const pr = event.pull_request;
if (!pr) throw new Error("This check requires a pull_request event.");
const branch = /^wg-(\d{3})-[a-z0-9]+(?:-[a-z0-9]+)*$/.exec(pr.head.ref);
const title = /^\[WG-(\d{3})\] \[([A-Z]+)\] .+$/.exec(pr.title);
if (!branch || !title || branch[1] !== title[1]) throw new Error("Branch and PR title must carry the same WG ID.");
const head = pr.head.sha;
const subject = execFileSync("git", ["log", "-1", "--format=%s", head], { encoding: "utf8" }).trim();
if (subject !== pr.title) throw new Error("Exact head subject must match the PR title.");
const count = Number(execFileSync("git", ["rev-list", "--count", `${pr.base.sha}..${head}`], { encoding: "utf8" }).trim());
if (count !== 1) throw new Error(`Expected one controlled commit in PR range; found ${count}.`);
console.log(`Exact PR head ${head} carries one WG-${branch[1]} controlled commit.`);
