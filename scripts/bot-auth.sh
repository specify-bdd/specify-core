#!/usr/bin/env bash
# bot-auth.sh — Authenticate gh CLI using a GitHub App installation token.
#
# Configuration (environment variables take precedence over config file):
#   GITHUB_APP_ID               — GitHub App's App ID
#   GITHUB_APP_INSTALLATION_ID  — Installation ID (GitHub App settings > Installations)
#   GITHUB_APP_PRIVATE_KEY_PATH — Path to the App's private key (.pem file)
#
# Config file (optional fallback): ~/.config/specify-bdd-bot/config
#   GITHUB_APP_ID=12345
#   GITHUB_APP_INSTALLATION_ID=67890
#   GITHUB_APP_PRIVATE_KEY_PATH=/path/to/private-key.pem
#
# Set DEBUG_MODE=1 to print verbose output.

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/common.sh
source "${SCRIPT_DIR}/common.sh"

# ---------------------------------------------------------------------------
# Load config file if present (env vars take precedence)
# ---------------------------------------------------------------------------
CONFIG_FILE="${HOME}/.config/specify-bdd-bot/config"
if [[ -f "$CONFIG_FILE" ]]; then
  debug "Loading config from ${CONFIG_FILE}"
  # shellcheck source=/dev/null
  source "$CONFIG_FILE"
else
  debug "No config file found at ${CONFIG_FILE}; relying on environment variables"
fi

# ---------------------------------------------------------------------------
# Validate required config
# ---------------------------------------------------------------------------
[[ -n "${GITHUB_APP_ID:-}" ]]               || fail "GITHUB_APP_ID is not set. Configure it in ${CONFIG_FILE} or the environment."
[[ -n "${GITHUB_APP_INSTALLATION_ID:-}" ]]  || fail "GITHUB_APP_INSTALLATION_ID is not set. Configure it in ${CONFIG_FILE} or the environment."
[[ -n "${GITHUB_APP_PRIVATE_KEY_PATH:-}" ]] || fail "GITHUB_APP_PRIVATE_KEY_PATH is not set. Configure it in ${CONFIG_FILE} or the environment."
[[ -f "$GITHUB_APP_PRIVATE_KEY_PATH" ]]     || fail "Private key not found at: ${GITHUB_APP_PRIVATE_KEY_PATH}"

debug "App ID: ${GITHUB_APP_ID}"
debug "Installation ID: ${GITHUB_APP_INSTALLATION_ID}"
debug "Private key: ${GITHUB_APP_PRIVATE_KEY_PATH}"

# ---------------------------------------------------------------------------
# Helper: base64url encode (no padding)
# ---------------------------------------------------------------------------
b64url() {
  openssl base64 -e -A | tr '+/' '-_' | tr -d '='
}

# ---------------------------------------------------------------------------
# Build JWT
# ---------------------------------------------------------------------------
info "Building JWT..."

NOW=$(date +%s)
IAT=$((NOW - 60))   # issued slightly in the past to account for clock skew
EXP=$((NOW + 600))  # 10 minutes (GitHub maximum)

HEADER=$(printf '{"alg":"RS256","typ":"JWT"}' | b64url) \
  || fail "Failed to base64url-encode JWT header."

PAYLOAD=$(printf '{"iat":%d,"exp":%d,"iss":"%s"}' "$IAT" "$EXP" "$GITHUB_APP_ID" | b64url) \
  || fail "Failed to base64url-encode JWT payload."

SIGNATURE=$(printf '%s.%s' "$HEADER" "$PAYLOAD" \
  | openssl dgst -sha256 -sign "$GITHUB_APP_PRIVATE_KEY_PATH" \
  | b64url) \
  || fail "Failed to sign JWT. Check that the private key is valid and readable."

JWT="${HEADER}.${PAYLOAD}.${SIGNATURE}"
debug "JWT: ${JWT}"

# ---------------------------------------------------------------------------
# Exchange JWT for an installation access token
# ---------------------------------------------------------------------------
info "Requesting installation access token..."

RESPONSE=$(curl --silent --show-error --fail \
  -X POST \
  -H "Authorization: Bearer ${JWT}" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/app/installations/${GITHUB_APP_INSTALLATION_ID}/access_tokens") \
  || fail "GitHub API request failed. Check your App ID, Installation ID, and that the app is installed on the repo."

debug "GitHub API response: ${RESPONSE}"

TOKEN=$(printf '%s' "$RESPONSE" | grep -o '"token": *"[^"]*"' | cut -d'"' -f4) \
  || fail "Failed to extract token from API response."
EXPIRES_AT=$(printf '%s' "$RESPONSE" | grep -o '"expires_at": *"[^"]*"' | cut -d'"' -f4)

[[ -n "$TOKEN" ]] || fail "Token was empty in API response. Full response: ${RESPONSE}"

# ---------------------------------------------------------------------------
# Authenticate gh
# ---------------------------------------------------------------------------
info "Authenticating gh CLI..."

echo "$TOKEN" | gh auth login --with-token \
  || fail "gh auth login failed. Ensure gh is installed and the token is valid."

end "gh authenticated successfully. Token expires at: ${EXPIRES_AT}"
