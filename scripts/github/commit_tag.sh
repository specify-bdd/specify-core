#!/bin/bash

SCRIPT_DIR="$(dirname -- "$( readlink -f -- "$0"; )")"
source $(dirname $SCRIPT_DIR)/common.sh

GIT_BRANCH="develop"
GIT_REMOTE="origin"
GIT_TAG="$1"
TITLE="$2"

# don't proceed past this point unless we have a GIT_TAG, all the tools we need, and we're on GIT_BRANCH
[[ -n "$GIT_TAG" ]] || fail "No Git tag name argument supplied."

[[ -n "$(which git)" ]] || fail "Git is not installed."

[[ -n "$(git branch | grep "* $GIT_BRANCH")" ]] || fail "The active Git branch must be $GIT_BRANCH."

info "Tagging release. ($GIT_TAG)"

COMMIT_MSG="Specify release $GIT_TAG"

if [[ -n "$TITLE" ]]; then
    COMMIT_MSG="$COMMIT_MSG ($TITLE)"
fi

git commit -a -m "$COMMIT_MSG" || fail "Couldn't commit changes to Git repo."

git tag -a -m "$COMMIT_MSG" $GIT_TAG || fail "Couldn't tag the latest commit."

git push --tags $GIT_REMOTE $GIT_BRANCH || fail "Couldn't push changes to $GIT_REMOTE."

end
