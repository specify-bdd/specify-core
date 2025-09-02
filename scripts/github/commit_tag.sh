#!/bin/bash

GIT_BRANCH="develop"
GIT_TAG="$1"
TITLE="$2"

# don't proceed past this point unless we have a GIT_TAG, all the tools we need, and we're on GIT_BRANCH
[[ -n "$GIT_TAG" ]] || exit 1
[[ -n "$(which git)" ]] || exit 1
[[ -n "$(which npm)" ]] || exit 1
[[ -n "$(which tr)" ]] || exit 1
[[ -n "$(git branch | grep "*" | grep "$GIT_BRANCH")" ]] || exit 1

COMMIT_MSG="Specify release $GIT_TAG"

if [[ -n "$TITLE" ]]; then
    COMMIT_MSG="$COMMIT_MSG ($TITLE)"
fi

echo "title=$COMMIT_MSG"

# commit all changes
git commit -a -m "$COMMIT_MSG" || exit 1

# tag the new commit
git tag -a -m "$COMMIT_MSG" $GIT_TAG || exit 1

# push everything to the origin repo
git push -t origin $GIT_BRANCH
