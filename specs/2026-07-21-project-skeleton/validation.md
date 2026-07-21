# Phase 0 — Project Skeleton: Validation

The phase is done and mergeable when all of the following hold.

## Build & scripts

- [ ] `npm install` completes cleanly from a fresh clone.
- [ ] `npm run dev` starts the dev server and the home page loads at
      `http://localhost:3000`.
- [ ] `npm run build` completes with **no** TypeScript or lint errors.
- [ ] `npm run start` serves the production build successfully.
- [ ] `npm run lint` passes.

## Landing page

- [ ] The home page renders in a modern browser with basic styling applied
      (not unstyled HTML).
- [ ] The page shows the **AgentClinic** brand and the "relief from your humans"
      tagline.
- [ ] Header/nav placeholders are present.
- [ ] No leftover `create-next-app` boilerplate (default Next.js logo/links)
      remains visible.

## Codebase

- [ ] The app is a Next.js App Router project in TypeScript at the repo root.
- [ ] `tsconfig.json` has `strict: true`.
- [ ] The old bare TS setup (`src/index.ts`, `tsc` build) is gone.
- [ ] Styling is vanilla CSS (CSS Modules / global CSS); no CSS framework or
      component library is present, per the tech stack.
- [ ] `.gitignore` excludes `node_modules`, `.next`, and build artifacts.

## Docs

- [ ] `README.md` documents install / dev / build / start.

## Outcome check

- [ ] Per the roadmap: **the app runs and shows a landing page.** A reviewer can
      clone, install, run `npm run dev`, and see the branded AgentClinic home
      page — the slice is demoable end-to-end.
