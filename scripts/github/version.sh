#!/bin/bash

VERSION="$1"

# don't proceed past this point unless we have a VERSION and all the tools we need
[[ -n "$VERSION" ]] || exit 1
[[ -n "$(which npm)" ]] || exit 1
[[ -n "$(which pnpm)" ]] || exit 1

# set the NPM version at the top level
VTAG="$(npm version --no-git-tag-version $VERSION)" || exit 1

# use the same Git tag to set the NPM version for all packages
pnpm -r exec -- npm version --no-git-tag-version $VTAG || exit 1

echo "version=$VTAG"
