#!/bin/bash

GIT_TAG="$1"
TITLE="$2"

# don't proceed past this point unless we have a GIT_TAG, TITLE, and all the tools we need
[[ -n "$GIT_TAG" ]] || exit 1
[[ -n "$TITLE" ]] || exit 1
[[ -n "$(which gh)" ]] || exit 1

gh release create "$GIT_TAG" \
    --title "$TITLE" \
    --fail-on-no-commits \
    --generate-notes \
    --verify-tag
