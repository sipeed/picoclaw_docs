You are reviewing a documentation sync PR for the PicoClaw project.
Another Codex agent just synced the docs with upstream source changes. Your job is to catch mistakes before the PR is created.

## Diff Summary

```
${DIFF_STAT}
```

## Diff Content (truncated to 3000 chars)

```diff
${DIFF_CONTENT}
```

## Review Checklist

Go through each item carefully:

### 1. No unwanted files
- `picoclaw-upstream/`, `.codex`, `node_modules/`, `.pr-summary.md` must NOT appear in `git diff --stat HEAD`.
- If found, revert with `git checkout -- <path>` or `rm -rf <path>`.

### 2. No regressions
- `docusaurus.config.js` should NOT be modified unless there's a genuine reason (e.g., new locale config).
- `package.json` / `package-lock.json` should NOT be modified.

### 3. No duplicate pages
- Do not create a new page (e.g., `wecom.md`) when split pages already exist (e.g., `wecom-aibot.md`, `wecom-app.md`, `wecom-bot.md`).
- Run `ls docs/channels/` and `ls docs/providers/` to check existing structure before adding files.

### 4. Content accuracy
- Spot-check 2-3 changed doc pages against their upstream source files in `picoclaw-upstream/`.
- No hallucinated features, config options, or API endpoints.
- Code examples must match the actual source code.

### 5. Trilingual completeness
- Every changed English doc in `docs/` must have corresponding updates in:
  - `i18n/zh-Hans/docusaurus-plugin-content-docs/current/`
  - `i18n/pt-BR/docusaurus-plugin-content-docs/current/`
- Check with: `git diff --stat HEAD -- docs/ | sed 's|docs/||'` and verify each path exists in both i18n dirs.

### 6. `.doc-source.json` integrity
- `source_commit` must be a full 40-character commit hash, not a short hash.
- All new pages must have source file mappings.
- `generated_at` must be a valid ISO 8601 timestamp.

### 7. MDX safety
- No unescaped `<`, `{`, `}` in prose text (outside code blocks).
- Frontmatter must be valid YAML (no tabs, proper quoting).

### 8. Sidebar consistency
- If new pages were created, they must be added to `sidebars.js`.
- Run `node -e "require('./sidebars.js')"` to verify sidebar syntax.

### 9. Build verification
- Run `npm run build` to verify the build passes.
- If it fails, fix ALL errors before finishing.

## Instructions

1. Run through the checklist above.
2. Fix any issues you find — do not just report them.
3. After fixing, run `npm run build` again to confirm.
4. Output a brief summary of what you checked and what you fixed (if anything).

${EXTRA_INSTRUCTIONS}
