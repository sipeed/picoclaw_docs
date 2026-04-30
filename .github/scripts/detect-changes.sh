#!/usr/bin/env bash
set -euo pipefail

UPSTREAM_DIR="${1:?Usage: detect-changes.sh <upstream-dir>}"
DOC_SOURCE="${2:-.doc-source.json}"
GITHUB_OUTPUT="${GITHUB_OUTPUT:-/dev/stdout}"

OLD_COMMIT_RAW=$(jq -r '.source_commit' "$DOC_SOURCE")
NEW_COMMIT=$(git -C "$UPSTREAM_DIR" rev-parse --short HEAD)
NEW_COMMIT_FULL=$(git -C "$UPSTREAM_DIR" rev-parse HEAD)

if ! OLD_COMMIT=$(git -C "$UPSTREAM_DIR" rev-parse "$OLD_COMMIT_RAW" 2>/dev/null); then
  echo "::warning::Cannot resolve source_commit '$OLD_COMMIT_RAW' in upstream repo. Treating as full diff."
  OLD_COMMIT=""
fi

echo "old_commit=${OLD_COMMIT:-$OLD_COMMIT_RAW}" >> "$GITHUB_OUTPUT"
echo "new_commit=$NEW_COMMIT" >> "$GITHUB_OUTPUT"
echo "new_commit_full=$NEW_COMMIT_FULL" >> "$GITHUB_OUTPUT"

if [ -n "$OLD_COMMIT" ] && git -C "$UPSTREAM_DIR" merge-base --is-ancestor "$NEW_COMMIT_FULL" "$OLD_COMMIT" 2>/dev/null; then
  echo "has_changes=false" >> "$GITHUB_OUTPUT"
  echo "No new upstream changes since $OLD_COMMIT"
else
  echo "has_changes=true" >> "$GITHUB_OUTPUT"
  if [ -n "$OLD_COMMIT" ]; then
    COMMIT_LOG=$(git -C "$UPSTREAM_DIR" log --oneline -50 "$OLD_COMMIT"..HEAD)
    CHANGED_FILES=$(git -C "$UPSTREAM_DIR" diff --name-only "$OLD_COMMIT"..HEAD)
    DIFF_STAT=$(git -C "$UPSTREAM_DIR" diff --stat "$OLD_COMMIT"..HEAD)
  else
    COMMIT_LOG=$(git -C "$UPSTREAM_DIR" log --oneline -50)
    CHANGED_FILES="(full repo — old commit not found)"
    DIFF_STAT="(full repo — old commit not found)"
  fi

  {
    echo "commit_log<<ENDOFLOG"
    echo "$COMMIT_LOG"
    echo "ENDOFLOG"
  } >> "$GITHUB_OUTPUT"

  {
    echo "changed_files<<ENDOFFILES"
    echo "$CHANGED_FILES"
    echo "ENDOFFILES"
  } >> "$GITHUB_OUTPUT"

  {
    echo "diff_stat<<ENDOFSTAT"
    echo "$DIFF_STAT"
    echo "ENDOFSTAT"
  } >> "$GITHUB_OUTPUT"
fi
