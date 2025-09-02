#!/bin/bash

GIT_BRANCH="main"
GIT_TAG="$1"

# don't proceed past this point unless we have all the tools we need and we're on GIT_BRANCH
[[ -n "$(which git)" ]] || exit 1
[[ -n "$(git branch | grep "*" | grep "$GIT_BRANCH")" ]] || exit 1

# merge the tag to main
git merge -ff-only "$GIT_TAG" || exit 1

# push changes to the origin repo
git push -t origin main
