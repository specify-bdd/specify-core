#!/bin/bash

SCRIPT_DIR="$(dirname -- "$( readlink -f -- "$0"; )")"
source $(dirname $SCRIPT_DIR)/common.sh

VERSION="$1"

# don't proceed past this point unless we have a VERSION and all the tools we need
[[ -n "$VERSION" ]] || fail "No version argument supplied."

[[ -n "$(which npm)" ]]  || fail "NPM is not installed."
[[ -n "$(which pnpm)" ]] || fail "PNPM is not installed."

info "Updating all package versions. ($VERSION)"
debug "Initial package version is $(npm pkg get version)."

VTAG="$(npm version --no-git-tag-version $VERSION)" || fail "Failed to set the top-level package version."
debug "Top-level package version set. ($VTAG)"

# use the same Git tag to set the NPM version for all packages
MOD_VTAGS="$(pnpm -r exec -- npm version --no-git-tag-version $VTAG)" \
    || fail "Failed to set the module-level package version."
debug "Module-level package versions set."

echo "version=$VTAG"

end
