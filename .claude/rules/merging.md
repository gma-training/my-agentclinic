---
description: How to merge a feature branch into main.
---

# Merging a feature branch to main

Run these checks in order. If any fails, stop and report it — do not merge.

## 1. Confirm the branch is rebased on main (the merge would fast-forward)

`main` must be an ancestor of the branch tip, so the branch sits directly on top
of the current `main`:

```bash
git merge-base --is-ancestor main <branch>   # exit 0 = ff-possible; non-zero = rebase first
```

If it is not an ancestor, rebase onto the latest main and re-check:

```bash
git rebase main
```

## 2. Confirm all tests pass on the branch

With the feature branch checked out (tests run against the working tree, so this
must be the branch — not main), the whole suite must be green:

```bash
git checkout <branch>
npm test          # unit + component (Vitest)
npm run test:e2e  # end-to-end (Playwright)
```

## 3. Confirm the changelog is up to date

Check that `CHANGELOG.md` records this branch's work. If it does not, run the
[`/changelog`](../skills/changelog/SKILL.md) skill before merging.

## 4. Merge with a merge commit (`--no-ff`)

```bash
git checkout main
git merge --no-ff <branch>
```

Step 1 keeps the branch linear and the merge trivial; `--no-ff` still forces an
explicit merge commit, so history shows where the feature was integrated and
which commits belonged to it (rather than silently fast-forwarding them onto
main).
