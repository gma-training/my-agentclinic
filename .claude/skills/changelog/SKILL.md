---
name: changelog
description: Update CHANGELOG.md in the project root with dated entries summarizing recent work. Invoke manually before merging a branch. On first run (no CHANGELOG.md) it bootstraps the file from git history, grouping commits by date.
---

Maintain `CHANGELOG.md` in the project root. Its shape is a top-level title
followed by date sections, newest date first:

```markdown
# Changelog

## 2026-07-22

- Human-readable summary of a change.
- Another change shipped that day.

## 2026-07-21

- Earlier work.
```

The user invokes this skill manually, typically **before merging a branch**.
This skill only edits `CHANGELOG.md` — it never commits, branches, or merges;
the user owns all git operations.

## Steps

1. **Check for `CHANGELOG.md` in the project root.**

   - **If it does not exist → bootstrap from history.** List every commit with
     its date:

     ```bash
     git log --date=short --pretty='%ad%x09%s'
     ```

     Group the commits by date (newest date first). Under each date heading,
     write one bullet per meaningful change — collapse trivial/fixup commits and
     rephrase terse commit subjects into clear, past-tense summaries. Then stop;
     the file is now seeded.

   - **If it exists → add the pending work.** Find what this branch will merge:

     ```bash
     git log main..HEAD --date=short --pretty='%ad%x09%s'
     ```

     Group the commits by their **author date** (the `%ad` column) — a bullet
     belongs under the date its commit was authored, **not** necessarily today,
     since a branch can span several days. For each date, create its heading in
     the correct reverse-chronological position if it's missing, or append to
     that heading if it already exists.

2. **Write clear bullets.** Each bullet is one user-facing or notable change,
   past tense, no commit hashes. Prefer "what changed and why it matters" over
   restating a commit subject. Merge duplicates.

3. **Never duplicate.** Before adding, scan existing entries for that date and
   skip anything already recorded.

4. **Preserve order.** Date sections stay in reverse-chronological order
   (newest first). Leave existing entries untouched unless you are deduping.

## After running

Report which date section you updated and list the bullets you added. Do not
offer to commit — the user handles that.
