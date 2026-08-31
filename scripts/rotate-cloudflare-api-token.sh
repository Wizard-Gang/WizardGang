#!/usr/bin/env bash

set -euo pipefail

secret_name="CLOUDFLARE_API_TOKEN"
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
discovery_script="$script_dir/discover-cloudflare-api-token-targets.sh"
dry_run=false
verify_with_cloudflare=true
discovery_args=()

usage() {
  cat <<'EOF'
Usage: rotate-cloudflare-api-token.sh [options]

Discover and rotate CLOUDFLARE_API_TOKEN everywhere it is used across the
Wizard-Gang and SouthernGentlemen GitHub owners.

Options:
  --dry-run       Print targets without prompting or changing secrets.
  --owner OWNER   Limit discovery to an owner; may be repeated.
  --skip-verify   Skip Cloudflare's token-verification endpoint.
  --help, -h      Show this help.

The token is read without echo from the terminal, is never written to disk,
and is sent to `gh secret set` over standard input rather than as an argument.
EOF
}

while (($# > 0)); do
  case "$1" in
    --dry-run)
      dry_run=true
      shift
      ;;
    --owner)
      if (($# < 2)) || [[ -z "$2" ]]; then
        printf 'error: --owner requires a GitHub owner\n' >&2
        exit 2
      fi
      discovery_args+=("--owner" "$2")
      shift 2
      ;;
    --skip-verify)
      verify_with_cloudflare=false
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      printf 'error: unknown option: %s\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

for required_command in gh jq curl; do
  if ! command -v "$required_command" >/dev/null 2>&1; then
    printf 'error: required command not found: %s\n' "$required_command" >&2
    exit 1
  fi
done

if [[ ! -x "$discovery_script" ]]; then
  printf 'error: discovery script is missing or not executable: %s\n' "$discovery_script" >&2
  exit 1
fi

rotation_dir=$(mktemp -d "${TMPDIR:-/tmp}/wizardgang-cloudflare-rotation.XXXXXX")
targets_file="$rotation_dir/targets.tsv"
new_cloudflare_token=""
confirmed_cloudflare_token=""
cleanup() {
  new_cloudflare_token=""
  confirmed_cloudflare_token=""
  rm -rf "$rotation_dir"
}
trap cleanup EXIT

printf 'Discovering GitHub secret targets...\n' >&2
if ((${#discovery_args[@]} > 0)); then
  "$discovery_script" "${discovery_args[@]}" >"$targets_file"
else
  "$discovery_script" >"$targets_file"
fi

if [[ ! -s "$targets_file" ]]; then
  printf 'No %s targets were found.\n' "$secret_name"
  exit 0
fi

printf '\nTargets:\n'
target_number=0
while IFS=$'\t' read -r scope repository environment_name; do
  target_number=$((target_number + 1))
  if [[ "$scope" == "environment" ]]; then
    printf '  %d. %s — %s environment\n' "$target_number" "$repository" "$environment_name"
  else
    printf '  %d. %s — repository secret\n' "$target_number" "$repository"
  fi
done <"$targets_file"

if [[ "$dry_run" == true ]]; then
  printf '\nDry run only; no secrets changed.\n'
  exit 0
fi

if [[ ! -r /dev/tty || ! -w /dev/tty ]]; then
  printf 'error: an interactive terminal is required to enter the token securely\n' >&2
  exit 1
fi

printf '\nNew Cloudflare API token: ' >/dev/tty
IFS= read -r -s new_cloudflare_token </dev/tty
printf '\nConfirm Cloudflare API token: ' >/dev/tty
IFS= read -r -s confirmed_cloudflare_token </dev/tty
printf '\n' >/dev/tty

if [[ -z "$new_cloudflare_token" ]]; then
  printf 'error: token cannot be empty\n' >&2
  exit 1
fi
if [[ "$new_cloudflare_token" != "$confirmed_cloudflare_token" ]]; then
  printf 'error: token entries do not match\n' >&2
  exit 1
fi
confirmed_cloudflare_token=""

if [[ "$verify_with_cloudflare" == true ]]; then
  printf 'Verifying token with Cloudflare...\n'
  verification_file="$rotation_dir/cloudflare-verification.json"
  if ! printf 'header = "Authorization: Bearer %s"\nheader = "Content-Type: application/json"\n' "$new_cloudflare_token" \
    | curl --config - --silent --show-error --fail \
      https://api.cloudflare.com/client/v4/user/tokens/verify >"$verification_file"; then
    printf 'error: Cloudflare rejected the token-verification request\n' >&2
    exit 1
  fi
  if ! jq -e '.success == true and .result.status == "active"' "$verification_file" >/dev/null; then
    printf 'error: Cloudflare did not report the token as active\n' >&2
    exit 1
  fi
  printf 'Cloudflare reports the token as active.\n'
fi

printf '\nType ROTATE to update all %d target(s): ' "$target_number" >/dev/tty
IFS= read -r rotation_confirmation </dev/tty
if [[ "$rotation_confirmation" != "ROTATE" ]]; then
  printf 'Cancelled; no secrets changed.\n'
  exit 0
fi

failures=0
while IFS=$'\t' read -r scope repository environment_name; do
  if [[ "$scope" == "environment" ]]; then
    printf 'Updating %s — %s environment...\n' "$repository" "$environment_name"
    if ! printf '%s' "$new_cloudflare_token" | gh secret set "$secret_name" --repo "$repository" --env "$environment_name"; then
      printf 'error: failed to update %s environment secret for %s\n' "$environment_name" "$repository" >&2
      failures=$((failures + 1))
      continue
    fi
    updated_at=$(gh secret list --repo "$repository" --env "$environment_name" --json name,updatedAt \
      | jq -r --arg name "$secret_name" '.[] | select(.name == $name) | .updatedAt')
  else
    printf 'Updating %s — repository secret...\n' "$repository"
    if ! printf '%s' "$new_cloudflare_token" | gh secret set "$secret_name" --repo "$repository"; then
      printf 'error: failed to update repository secret for %s\n' "$repository" >&2
      failures=$((failures + 1))
      continue
    fi
    updated_at=$(gh secret list --repo "$repository" --json name,updatedAt \
      | jq -r --arg name "$secret_name" '.[] | select(.name == $name) | .updatedAt')
  fi

  if [[ -z "$updated_at" ]]; then
    printf 'error: secret metadata could not be verified for %s\n' "$repository" >&2
    failures=$((failures + 1))
  else
    printf 'Verified metadata update: %s\n' "$updated_at"
  fi
done <"$targets_file"

new_cloudflare_token=""

if ((failures > 0)); then
  printf '\nRotation finished with %d failure(s). Re-run after correcting access.\n' "$failures" >&2
  exit 1
fi

printf '\nRotation complete for all %d target(s).\n' "$target_number"
