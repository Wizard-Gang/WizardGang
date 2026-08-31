#!/usr/bin/env bash

set -euo pipefail

secret_name="CLOUDFLARE_API_TOKEN"
owners=("Wizard-Gang" "SouthernGentlemen")

usage() {
  cat <<'EOF'
Usage: discover-cloudflare-api-token-targets.sh [--owner OWNER ...]

Find active GitHub repositories and environment scopes that either store
CLOUDFLARE_API_TOKEN or reference secrets.CLOUDFLARE_API_TOKEN in a workflow.

Output is tab-separated:
  repository   OWNER/REPO   -
  environment  OWNER/REPO   ENVIRONMENT
EOF
}

custom_owners=()
while (($# > 0)); do
  case "$1" in
    --owner)
      if (($# < 2)) || [[ -z "$2" ]]; then
        printf 'error: --owner requires a GitHub owner\n' >&2
        exit 2
      fi
      custom_owners+=("$2")
      shift 2
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

if ((${#custom_owners[@]} > 0)); then
  owners=("${custom_owners[@]}")
fi

for required_command in gh jq; do
  if ! command -v "$required_command" >/dev/null 2>&1; then
    printf 'error: required command not found: %s\n' "$required_command" >&2
    exit 1
  fi
done

if ! gh auth status >/dev/null 2>&1; then
  printf 'error: authenticate GitHub CLI first with: gh auth login\n' >&2
  exit 1
fi

discovery_dir=$(mktemp -d "${TMPDIR:-/tmp}/wizardgang-cloudflare-discovery.XXXXXX")
repositories_file="$discovery_dir/repositories.txt"
targets_file="$discovery_dir/targets.tsv"
trap 'rm -rf "$discovery_dir"' EXIT

: >"$repositories_file"
: >"$targets_file"

for owner in "${owners[@]}"; do
  if ! gh repo list "$owner" --limit 500 --json nameWithOwner,isArchived \
    --jq '.[] | select(.isArchived == false) | .nameWithOwner' >>"$repositories_file"; then
    printf 'error: could not list repositories for %s\n' "$owner" >&2
    exit 1
  fi
done

sort -u -o "$repositories_file" "$repositories_file"

while IFS= read -r repository; do
  [[ -n "$repository" ]] || continue

  repository_secrets="$discovery_dir/repository-secrets.json"
  if ! gh secret list --repo "$repository" --json name,updatedAt >"$repository_secrets"; then
    printf 'error: cannot inspect repository secrets for %s\n' "$repository" >&2
    exit 1
  fi
  if jq -e --arg name "$secret_name" '.[] | select(.name == $name)' "$repository_secrets" >/dev/null; then
    printf 'repository\t%s\t-\n' "$repository" >>"$targets_file"
  fi

  environments_file="$discovery_dir/environments.txt"
  : >"$environments_file"
  if ! gh api "repos/$repository/environments" --jq '.environments[].name' >"$environments_file" 2>/dev/null; then
    printf 'error: cannot inspect environments for %s\n' "$repository" >&2
    exit 1
  fi

  while IFS= read -r environment_name; do
    [[ -n "$environment_name" ]] || continue
    environment_secrets="$discovery_dir/environment-secrets.json"
    if ! gh secret list --repo "$repository" --env "$environment_name" --json name,updatedAt >"$environment_secrets"; then
      printf 'error: cannot inspect %s environment secrets for %s\n' "$environment_name" "$repository" >&2
      exit 1
    fi
    if jq -e --arg name "$secret_name" '.[] | select(.name == $name)' "$environment_secrets" >/dev/null; then
      printf 'environment\t%s\t%s\n' "$repository" "$environment_name" >>"$targets_file"
    fi
  done <"$environments_file"

  workflow_uses_secret=false
  workflow_uses_production=false
  workflows_file="$discovery_dir/workflows.txt"
  : >"$workflows_file"
  gh api "repos/$repository/contents/.github/workflows" --jq '.[].path' >"$workflows_file" 2>/dev/null || true

  while IFS= read -r workflow_path; do
    [[ -n "$workflow_path" ]] || continue
    workflow_content="$discovery_dir/workflow.yml"
    if ! gh api -H 'Accept: application/vnd.github.raw+json' \
      "repos/$repository/contents/$workflow_path" >"$workflow_content" 2>/dev/null; then
      printf 'error: cannot read %s from %s\n' "$workflow_path" "$repository" >&2
      exit 1
    fi
    if grep -Eq 'secrets[.]CLOUDFLARE_API_TOKEN' "$workflow_content"; then
      workflow_uses_secret=true
      if grep -Eq 'environment:[[:space:]]*production' "$workflow_content"; then
        workflow_uses_production=true
      fi
    fi
  done <"$workflows_file"

  if [[ "$workflow_uses_secret" == true ]] && ! awk -F '\t' -v repo="$repository" '$2 == repo { found = 1 } END { exit !found }' "$targets_file"; then
    if [[ "$workflow_uses_production" == true ]]; then
      printf 'environment\t%s\tproduction\n' "$repository" >>"$targets_file"
    else
      printf 'repository\t%s\t-\n' "$repository" >>"$targets_file"
    fi
  fi
done <"$repositories_file"

sort -u "$targets_file"
