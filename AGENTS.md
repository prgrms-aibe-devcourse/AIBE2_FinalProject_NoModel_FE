# Repository Guidelines

## Project Structure & Module Organization
The Vite + React TypeScript app lives in `src/`. Entry point `src/main.tsx` mounts `App.tsx`; routes and UI pages live under `src/components`, with shared primitives in `components/common` and `components/ui`. API wrappers and integrations sit in `src/services`, while cross-cutting helpers and TS contracts are in `src/utils` and `src/types`. Design tokens and Tailwind overrides stay in `src/styles`. Product copy and reference material live in `src/guidelines`. Static shell is `index.html`; production builds emit to `build/`. Use the `@/` alias (configured in `vite.config.ts`) instead of deep relative imports.

## Build, Test, and Development Commands
- `npm install` installs pinned dependencies defined in `package-lock.json`.
- `npm run dev` launches the Vite dev server on port 5173 and opens the browser.
- `npm run build` runs the Vite production build, writing assets to `build/`. Run it before merging to catch type errors.

## Coding Style & Naming Conventions
TypeScript strict mode is enabled; keep types explicit for component props and service responses. Use functional React components with PascalCase filenames (`ModelReport.tsx`) and camelCase utilities (`fetchModels`). Hooks must start with `use`. Favor 2-space indentation and single quotes in TSX to mirror existing files. Compose UI with Tailwind utility classes already compiled into `src/index.css`, and centralize shared styles in `styles/globals.css`. Group imports as React → local modules → assets, and prefer the `@/` alias for cross-feature imports.

## Testing Guidelines
There is no automated suite yet; verify changes manually via `npm run dev`. Before opening a PR, smoke-test the onboarding, model marketplace/filtering, and image generation flows, plus any surfaces you touched. When adding a new component, consider seeding a colocated `*.test.tsx` or story to pave the way for React Testing Library coverage, and document manual checks in the PR.

## Commit & Pull Request Guidelines
Follow the existing Conventional Commit style (`feat:`, `refactor:`) with concise, action-focused subjects; Korean descriptors are welcome after the colon. Each PR description should summarize the change, link related issues or tasks, list manual test steps, and include screenshots or screen recordings for UI updates. Ensure `npm run build` passes and that `.env` secrets remain local (do not commit them); add reviewers when ready.
