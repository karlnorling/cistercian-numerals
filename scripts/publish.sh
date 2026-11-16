#!/bin/bash
# Publish the package if its version is not on the registry yet. Uses the npm CLI,
# not `yarn npm publish`, so npm's OIDC exchange (trusted publishing) and provenance work.
set -euo pipefail

# changesets/action v2 reads newline-delimited JSON from the file in
# CHANGESETS_OUTPUT to create git tags and GitHub releases, one object per
# published package:
#
#   {"type":"git-tag","tag":"<pkg>@<version>","packageName":"<pkg>"}
#
# The file must exist even when nothing is published. CHANGESETS_OUTPUT is unset
# when this script is run by hand.
if [ -n "${CHANGESETS_OUTPUT:-}" ]; then
  : > "$CHANGESETS_OUTPUT"
fi

name=$(node -p "require('./package.json').name")
version=$(node -p "require('./package.json').version")

if npm view "${name}@${version}" version &>/dev/null; then
  echo "Skipping ${name}@${version} (already published)"
  exit 0
fi

echo "Publishing ${name}@${version}..."
npm publish --provenance --access public
if [ -n "${CHANGESETS_OUTPUT:-}" ]; then
  # Single-package repos tag as v<version>, so the action needs that exact tag.
  printf '{"type":"git-tag","tag":"v%s","packageName":"%s"}\n' "$version" "$name" \
    >> "$CHANGESETS_OUTPUT"
fi

# Create the git tag locally; the action pushes it and opens a GitHub release.
yarn changeset tag
