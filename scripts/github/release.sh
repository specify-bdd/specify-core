#!/bin/bash

SCRIPT_DIR="$(dirname -- "$( readlink -f -- "$0"; )")"
source $(dirname $SCRIPT_DIR)/common.sh

GIT_TAG="$1"
TITLE="$2"

# don't proceed past this point unless we have a GIT_TAG, TITLE, and all the tools we need
[[ -n "$GIT_TAG" ]] || fail "No Git tag name argument supplied."
[[ -n "$TITLE" ]]   || fail "No release title argument supplied."

[[ -n "$(which gh)" ]] || fail "GitHub CLI is not installed."

info "Creating release. ($GIT_TAG)"
debug "Release title: $TITLE"

gh release create "$GIT_TAG" \
    --title "$TITLE" \
    --fail-on-no-commits \
    --generate-notes \
    --verify-tag \
    || fail "Couldn't create release $GIT_TAG."

end
