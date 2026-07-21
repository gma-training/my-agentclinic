# Phase 0 — Project Skeleton: Plan

Numbered task groups. Complete and verify each group before moving on.

## 1. Scaffold the Next.js app

1.1. Remove the existing bare TypeScript setup that will be replaced: the
     `tsc`/commonjs `package.json` scripts, the old `tsconfig.json`, and
     `src/index.ts`.
1.2. Scaffold a fresh app at the repo root with `create-next-app`: TypeScript,
     App Router, ESLint, **no Tailwind** (plain CSS), `src/` directory, import
     alias `@/*`.
1.3. Confirm `tsconfig.json` has `strict: true`.
1.4. Verify `.gitignore` covers `node_modules`, `.next`, and build output.

## 2. Build the branded landing page

2.1. Set the app metadata (title/description) to AgentClinic.
2.2. Replace the default home page with a branded landing: AgentClinic name,
     "relief from your humans" tagline, and header/nav placeholders.
2.3. Replace the default global CSS with clean, minimal AgentClinic styling
     (typography, colours, layout) — plain CSS only.
2.4. Remove leftover boilerplate assets/styles from the scaffold that aren't
     used.

## 3. Verify scripts and developer experience

3.1. Confirm `npm run dev` serves the home page locally.
3.2. Confirm `npm run build` succeeds with no type or lint errors.
3.3. Confirm `npm run start` serves the production build.
3.4. Confirm `npm run lint` passes.

## 4. Documentation and handoff

4.1. Update `README.md` with how to install, run dev, build, and start.
4.2. Confirm the app matches the checks in [validation.md](./validation.md).
4.3. Commit on the `phase-0-project-skeleton` branch.
