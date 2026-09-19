export function sanitizeLocalHeadersText(headers) {
  return String(headers)
    .replace(/^\s*Strict-Transport-Security:.*(?:\r?\n|$)/gim, "")
    .replace(/;\s*upgrade-insecure-requests\b/gi, "");
}
