#!/bin/bash

SCRIPT_DIR="$(dirname -- "$( readlink -f -- "$0"; )")"
source $(dirname $SCRIPT_DIR)/common.sh

GIT_BRANCH="main"
GIT_REMOTE="origin"
GIT_REF="$1"

# don't proceed past this point unless we have all the tools we need and we're on GIT_BRANCH
[[ -n "$(which git)" ]] || fail "Git is not installed."

[[ -n "$(git branch | grep "* $GIT_BRANCH")" ]] || fail "The active Git branch must be $GIT_BRANCH."

info "Merging Git ref $GIT_REF to $GIT_BRANCH."

git merge --ff-only "$GIT_REF" || fail "Couldn't fast-forward merge ref $GIT_REF into $GIT_BRANCH."

git push "$GIT_REMOTE" "$GIT_BRANCH" || fail "Couldn't push changes to $GIT_REMOTE."

end
