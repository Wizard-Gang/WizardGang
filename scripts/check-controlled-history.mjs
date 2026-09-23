import { validateCurrentHistory } from "./controlled-history.mjs";

try {
  const errors = validateCurrentHistory();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Controlled history and active plan are sequential.");
  }
} catch (error) {
  console.error(`Could not validate controlled history: ${error.message}`);
  process.exitCode = 1;
}
