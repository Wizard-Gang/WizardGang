export const CONTACT_EMAIL = "jacob@wizardgang.ai";

export interface HomeCapability {
  number: string;
  title: string;
  copy: string;
}

export const HOME_CAPABILITIES = [
  ["01", "Build the software", "I turn requirements into applications, APIs, data tools, and automation."],
  ["02", "Connect the systems", "I make business systems share the right data at the right time."],
  ["03", "Put it into use", "I move data, configure workflows, test, train users, and support launch."],
  ["04", "Lead the work", "I keep scope, owners, risks, and releases clear."],
  ["05", "Keep it running", "I monitor production, respond to incidents, improve recovery, and document changes."]
].map(([number, title, copy]): HomeCapability => ({ number, title, copy }));
