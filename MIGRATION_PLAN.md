# Modernization Plan — A* Pathfinding Visualizer

Phased upgrade from Create React App / React 18 / TypeScript 4.7 to Vite / pnpm / React 19 / current TypeScript.

**Rule for every phase:** the app must build, run, and behave exactly as before the phase started. One phase = one branch/PR/commit. Merge only after the smoke test checklist passes.

## Status

All phases (0–7) are complete on branch `chore/modernize`.

- Final stack: Node 26, pnpm 12, Vite 8, React 19, TypeScript 6.0, MUI 9, styled-components 6, Vitest 5, ESLint 10.
- `pnpm audit` reports **0 vulnerabilities**.
- TypeScript **6.0.3** is the latest version supported by `typescript-eslint` 8.x (`>=4.8.4 <6.1.0`) and passes typecheck, lint, tests and build. TypeScript 7 was evaluated and hard-errors in typescript-eslint (`typescript-eslint does not support TS 7.0`), so it remains blocked until support lands.
- Manual steps completed outside the phases: removed the stale CRA `build/` output, typed all `any`s, removed dead debug helpers, and refactored `useAstarStep`'s module-level state into refs.
- Phase 7 artifacts: `.github/workflows/ci.yml` and `netlify.toml`.

---

## Snapshot at time of writing

| Area | Current | Target |
|---|---|---|
| Package manager | npm (`package-lock.json`) | **pnpm** (`pnpm-lock.yaml`) |
| Node | v26.13.0 installed, not pinned | **pinned** via `.nvmrc` + `engines` |
| Build | `react-scripts` 5.0.1 (CRA) | **Vite 8** (`@vitejs/plugin-react` 6) |
| React | 18.2 | **19.3** |
| TypeScript | 4.7.4, `target: es5`, `moduleResolution: node` | **6.0.3** (7.x blocked by typescript-eslint) |
| UI | MUI 5.9 + Emotion 11.10 | **MUI 9.5 + Emotion 11.14** |
| Styling | styled-components 5.3 + `@types/styled-components` | **styled-components 6.6** (bundled types) |
| Tests | Testing Library installed, **0 test files**, Jest via CRA | **Vitest 5 + Testing Library 16** |
| Lint | `eslintConfig` in `package.json` (`react-app`) | **ESLint flat config + typescript-eslint** |
| Analytics | `web-vitals` 2 (unused old API) | **removed** |
| Deploy | Netlify, CRA `build/` | Netlify, Vite `dist/` |

### Why the migration is low risk

The feature surface is small:

- No router, no `makeStyles`/`withStyles`, no `@mui/styles`.
- No `React.FC`, no `ReactDOM.render`, no implicit `children`.
- No env vars (`process.env` / `REACT_APP_*` are never used).
- MUI appears in ~8 files; d3 is used only for `d3.min` and `d3.drag`.
- Absolute imports come from `baseUrl: "src"` — the only thing Vite needs help with (`vite-tsconfig-paths`).

### Known gotchas discovered

1. **Absolute imports** (`components/Navbar`, `apps/MainApp`, …) will break under Vite without `vite-tsconfig-paths`.
2. **`public/index.html`** must move to the project root and lose `%PUBLIC_URL%`.
3. **`src/react-app-env.d.ts`** references `react-scripts` types and must be replaced.
4. **`src/reportWebVitals.ts`** uses the old `getCLS/getFID/...` API removed in modern `web-vitals`.
5. **`@types/styled-components`** must be removed for styled-components v6 (v6 ships its own types), otherwise duplicate-typing errors.
6. **`Legends/index.tsx`** uses `props.color` in a `styled.span` template — v6 needs a generic: `styled.span<{ color?: string }>`.
7. **Testing deps are in `dependencies`**, not `devDependencies`; `@types/jest` is dead weight after Vitest.
8. **pnpm + CRA** can require `node-linker=hoisted`. Doing Vite first avoids this entirely — so the pnpm switch happens *after* Vite.

---

## Phase 0 — Safety net

**Goal:** a known-good baseline and an easy rollback.

### Steps

- [ ] Create the branch:
  ```bash
  git switch -c chore/modernize
  git status          # must be clean
  ```
- [ ] Verify the baseline build:
  ```bash
  npm ci
  npm run build
  npm start
  ```
- [ ] Record the baseline audit:
  ```bash
  npm audit > baseline-audit.txt
  ```
- [ ] Walk the **smoke test checklist** (Appendix A) and save screenshots of square + hexagon grids.
- [ ] Add `.nvmrc`:
  ```text
  26
  ```
- [ ] Add to `package.json`:
  ```jsonc
  "packageManager": "pnpm@12.15.0",
  "engines": { "node": ">=26" }
  ```

### Acceptance

- [ ] Baseline build succeeds and the app renders.
- [ ] `baseline-audit.txt` committed (or kept locally for comparison).
- [ ] Branch exists; `main` untouched.

### Notes

- **Do not** run `npm audit fix --force`; it installs downgraded/broken CRA internals.

---

## Phase 1 — CRA → Vite 8 + TypeScript 5.9

**Goal:** replace the build tool and modernize the compiler config. No runtime library bumps yet.

> This phase removes ~80–90% of the security findings, because `react-scripts` pulls in the old webpack/babel/eslint tree.

### Steps

- [ ] Remove CRA and add Vite:
  ```bash
  npm uninstall react-scripts
  npm i -D vite@^8 @vitejs/plugin-react@^6 vite-tsconfig-paths@^6 typescript@~5.9.3
  ```
- [ ] Move `public/index.html` → `index.html` (project root) and edit it:
  - [ ] Replace every `%PUBLIC_URL%/` with `/`.
  - [ ] Delete CRA comment blocks and `noscript` boilerplate is fine to keep/modify.
  - [ ] Add before `</body>`:
    ```html
    <script type="module" src="/src/index.tsx"></script>
    ```
  - [ ] Update `<title>` and `<meta name="description">` (still "React App" / CRA default).
  - [ ] Keep `<div id="root"></div>`.
- [ ] Add `vite.config.ts`:
  ```ts
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tsconfigPaths from 'vite-tsconfig-paths'

  export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: { port: 3000, open: true },
    build: { outDir: 'dist' },
  })
  ```
- [ ] Replace `src/react-app-env.d.ts` with `src/vite-env.d.ts`:
  ```ts
  /// <reference types="vite/client" />
  ```
- [ ] Delete `src/reportWebVitals.ts` and its import/call in `src/index.tsx`.
- [ ] Remove `web-vitals` from `dependencies`.
- [ ] Update `package.json`:
  ```jsonc
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
  ```
  Remove `"eslintConfig"` and `"browserslist"` (CRA-specific; lint returns in Phase 5).
- [ ] Modernize `tsconfig.json`:
  ```jsonc
  {
    "compilerOptions": {
      "target": "ES2022",
      "lib": ["ES2022", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "moduleResolution": "bundler",
      "jsx": "react-jsx",
      "strict": true,
      "noEmit": true,
      "isolatedModules": true,
      "resolveJsonModule": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "noFallthroughCasesInSwitch": true,
      "types": ["vite/client"],
      "paths": { "*": ["./src/*"] }
    },
    "include": ["src", "vite.config.ts"]
  }
  ```
- [ ] Update `.gitignore`: add `/dist`, `/.vite`, `*.local`.

### Files touched

`package.json`, `tsconfig.json`, `.gitignore`, `index.html` (moved), `vite.config.ts` (new), `src/vite-env.d.ts` (new), `src/index.tsx`, delete `src/react-app-env.d.ts`, delete `src/reportWebVitals.ts`.

### Acceptance

- [ ] `npm run dev` serves on `http://localhost:3000`.
- [ ] `npm run build` emits `dist/`.
- [ ] `npm run typecheck` is clean.
- [ ] Smoke test checklist passes (Appendix A).
- [ ] `npm audit` count dropped substantially vs `baseline-audit.txt`.

### Common failures

| Symptom | Cause | Fix |
|---|---|---|
| `Cannot find module 'components/...'` | path aliases not resolved | confirm `vite-tsconfig-paths` is in `plugins` |
| `process is not defined` | CRA-style env access | none in this repo; if added later use `import.meta.env` |
| Blank page, no error | `index.html` still in `public/` | move to root and add the module script |
| `tsc` errors about `.tsx` extensions | `allowImportingTsExtensions` | not needed here; keep `moduleResolution: bundler` |
| Styles missing | `index.css` not imported | it already is in `src/index.tsx` |

---

## Phase 2 — npm → pnpm

**Goal:** single lockfile, faster installs, modern workspace behavior.

> Do this immediately after Phase 1. Switching to pnpm while still on `react-scripts` is what usually requires `node-linker=hoisted`.

### Steps

- [ ] Remove the npm install:
  ```powershell
  Remove-Item -Recurse -Force node_modules
  ```
- [ ] Import the existing lockfile (preserves resolved versions):
  ```bash
  pnpm import
  ```
- [ ] Remove `package-lock.json`:
  ```powershell
  Remove-Item package-lock.json
  ```
- [ ] Install:
  ```bash
  pnpm install
  ```
- [ ] Add `"type": "module"` to `package.json` (needed for Vite/ESLint flat config).
- [ ] If pnpm reports blocked build scripts:
  ```bash
  pnpm approve-builds
  ```
- [ ] Commit `pnpm-lock.yaml`.

### Acceptance

- [ ] Fresh `pnpm install` works from a clean checkout.
- [ ] `pnpm dev`, `pnpm build`, `pnpm typecheck` pass.
- [ ] Only `pnpm-lock.yaml` exists (no `package-lock.json`).
- [ ] Smoke test checklist passes.

### Notes

- If a dependency needs hoisting later, add to `package.json`:
  ```jsonc
  "pnpm": { "nodeLinker": "hoisted" }
  ```
  Should not be necessary after CRA is gone.

---

## Phase 3 — React 18 → 19

**Goal:** current React with no behavioral change.

### Steps

- [ ] Upgrade:
  ```bash
  pnpm add react@^19 react-dom@^19
  pnpm add -D @types/react@^19 @types/react-dom@^19
  ```
- [ ] Remove now-unused `import React from 'react'` lines, but keep files that reference `React.MouseEvent` / `React.ChangeEvent` types.
- [ ] Check `src/index.tsx` still uses `createRoot` (it does).
- [ ] Smoke test specifically:
  - [ ] Drag Start/End on square grid (d3 `drag` handlers).
  - [ ] Drag Start/End on hexagon grid.
  - [ ] Run Find Path twice in a row.
  - [ ] Toggle Allow Diagonal, change speed, Reset.

### Acceptance

- [ ] No console errors/warnings about legacy React APIs.
- [ ] `pnpm typecheck`, `pnpm build` pass.
- [ ] All interactive behaviors match Phase 0 screenshots.

### Notes

- React 19 types require TypeScript 5.x, which is why Phase 1 bumps the compiler first.
- `StrictMode` already double-invokes effects in React 18; the async `findPath` effect and d3 drag binding in `useAddDragHandler` are the places to watch for double-binding.

---

## Phase 4 — UI stack: MUI 5 → 9 and styled-components 5 → 6

**Goal:** current UI libraries, same look and feel.

### Steps

- [ ] Upgrade:
  ```bash
  pnpm add @mui/material@^9 @mui/icons-material@^9 @emotion/react@^11 @emotion/styled@^11
  pnpm add styled-components@^6
  pnpm remove @types/styled-components
  ```
- [ ] Fix `src/components/Legends/index.tsx`:
  ```ts
  const ColorBox = styled.span<{ color?: string }>`
    background: ${(props) => props.color || "#fff"};
    ...
  `;
  ```
  (Or migrate to a transient prop `$color`.)
- [ ] Optional paper trail: run MUI codemods per major.
  ```bash
  npx @mui/codemod@latest v6.0.0/preset-safe src
  ```
  Given the small footprint, a single 5 → 9 jump is acceptable; if you prefer lower risk, go 5 → 6 → 7 → 9 with a build between each.
- [ ] Verify the MUI surface still exists / behaves:
  `AppBar`, `Toolbar`, `Typography`, `Box`, `Stack`, `Button`, `Select`, `FormControl`, `InputLabel`, `MenuItem`, `Checkbox`, `FormGroup`, `FormControlLabel`, `ThemeProvider`, `createTheme`, `CssBaseline`, `colors`, `@mui/icons-material/Route`.

### Acceptance

- [ ] Visual output matches Phase 0 screenshots (navbar, action bar, legends, both grids).
- [ ] `pnpm typecheck`, `pnpm build` pass.
- [ ] No duplicate styled-components type errors.

### Notes

- MUI 5 does not officially support React 19; MUI 9 does. This is why Phase 3 and 4 are adjacent.
- MUI 9 declares `@mui/material-pigment-css` as an optional peer — a warning about it is safe to ignore if you stay on Emotion.

---

## Phase 5 — Test + lint tooling

**Goal:** a real test harness and lint pipeline. There are currently zero tests, so this creates the harness and seeds a few high-value tests.

### Steps

- [ ] Install:
  ```bash
  pnpm add -D vitest@^5 jsdom \
    @testing-library/react@^16 @testing-library/dom \
    @testing-library/jest-dom@^7 @testing-library/user-event@^14
  pnpm add -D eslint @eslint/js typescript-eslint \
    eslint-plugin-react-hooks eslint-plugin-react-refresh globals
  pnpm remove @types/jest
  ```
- [ ] Move all `@types/*` and test libraries from `dependencies` to `devDependencies`.
- [ ] Add Vitest config to `vite.config.ts`:
  ```ts
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  }
  ```
- [ ] Keep `src/setupTests.ts` as:
  ```ts
  import '@testing-library/jest-dom';
  ```
- [ ] Add scripts:
  ```jsonc
  "test": "vitest",
  "test:ci": "vitest run",
  "lint": "eslint ."
  ```
- [ ] Add `eslint.config.js` (flat config):
  ```js
  import js from '@eslint/js'
  import tseslint from 'typescript-eslint'
  import reactHooks from 'eslint-plugin-react-hooks'
  import reactRefresh from 'eslint-plugin-react-refresh'
  import globals from 'globals'

  export default tseslint.config(
    { ignores: ['dist', 'coverage'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
      files: ['**/*.{ts,tsx}'],
      languageOptions: { globals: globals.browser },
      plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': 'warn',
      },
    },
  )
  ```
- [ ] Add the first tests (fixtures, not snapshots):
  1. `src/helpers/generate-data.test.ts` — grid dimensions/content from `ROWS`/`COLS`.
  2. `src/algorithms/astar/astar.test.ts` — finds a path on a small fixture grid, and returns no path when blocked.
  3. `src/App.test.tsx` — `<App />` renders without throwing (catches React 19 / MUI integration).

### Acceptance

- [ ] `pnpm test` and `pnpm test:ci` pass.
- [ ] `pnpm lint` passes (or has only documented warnings).
- [ ] `pnpm typecheck` and `pnpm build` pass.

---

## Phase 6 — TypeScript 7 + dependency sweep + security gate

**Goal:** latest compiler and a clean dependency tree.

### Steps

- [ ] OPTIONAL: try the native compiler:
  ```bash
  pnpm add -D typescript@^7
  pnpm typecheck
  ```
  If the ecosystem/config is not ready, revert to `~6.0.3` and note it. TS 6.0 is the latest major supported by `typescript-eslint`.
- [ ] Update the remaining libraries:
  ```bash
  pnpm up --latest
  ```
  Expected remaining versions: `d3@^7.9`, `@datastructures-js/priority-queue@^6.4`, `@types/d3`, `@types/lodash`, `@types/d3-hexbin`.
- [ ] OPTIONAL: switch `lodash` → `lodash-es`. Imports are already per-function (`lodash/flattenDeep`, `lodash/cloneDeep`), so it is a small change and tree-shakes better under Vite.
- [ ] `d3-hexbin` is genuinely used in `src/apps/MainApp/components/Grid/HexagonGrid/index.tsx` (`hexbin()`, `hexagon()`), so keep it and `@types/d3-hexbin`. It is stable/unmaintained but tiny and has no known audit issues; note it in the README's dependencies if you want.
- [ ] Security gate:
  ```bash
  pnpm audit
  ```
  Compare to `baseline-audit.txt`. Target: no high/critical; document any accepted low/moderate.
- [ ] Optional CI gate: `pnpm audit --audit-level=high`.

### Acceptance

- [ ] `pnpm audit` has no high/critical findings (or all documented).
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test:ci`, `pnpm build` all pass.
- [ ] Smoke test checklist passes.

---

## Phase 7 — CI, deploy, docs

**Goal:** ship the upgraded app and prevent regressions.

### Steps

- [ ] **Netlify**
  - Build command: `pnpm build`
  - Publish directory: `dist` (or set `build.outDir: 'build'` in `vite.config.ts` to avoid changing Netlify)
  - Ensure Node ≥ 26 is used (commit `.nvmrc`; set `NODE_VERSION` if needed)
- [ ] **GitHub Actions** — `.github/workflows/ci.yml`:
  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version-file: .nvmrc
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm typecheck
        - run: pnpm lint
        - run: pnpm test:ci
        - run: pnpm build
  ```
- [ ] **README**
  - Replace the CRA text with `pnpm install` / `pnpm dev` / `pnpm build`.
  - State the required Node version.
  - Keep the demo link and algorithm references.
- [ ] OPTIONAL: add Prettier (`pnpm format`) in a separate commit.
- [ ] Delete `baseline-audit.txt` from the repo if you don't want it tracked.

### Acceptance

- [ ] Netlify preview deploy of the branch works.
- [ ] CI is green on the PR.
- [ ] README commands work from a clean clone.

---

## Appendix A — Smoke test checklist

Run this at the end of **every** phase:

- [ ] App loads on `http://localhost:3000` with no console errors.
- [ ] Navbar shows the Route icon + "A* Visualizer".
- [ ] Square grid renders and fills the viewport area.
- [ ] Click a cell and drag: barriers are painted/erased.
- [ ] Drag the Start (green) node to a new cell.
- [ ] Drag the End (red) node to a new cell.
- [ ] "Find Path" animates open/closed/path cells and stops.
- [ ] "Reset" restores the initial grid.
- [ ] Speed select changes animation speed.
- [ ] "Allow Diagonal" toggles and affects path shape.
- [ ] Grid Type → Hexagon renders the hex grid, drag + path still work.
- [ ] Legends row renders the correct colors/labels.
- [ ] `pnpm build` output loads via `pnpm preview` and behaves the same.

---

## Appendix B — Target `package.json` (shape, not exact versions)

```jsonc
{
  "name": "astar-pathfinding",
  "version": "0.2.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@12.15.0",
  "engines": { "node": ">=26" },
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest",
    "test:ci": "vitest run"
  },
  "dependencies": {
    "@datastructures-js/priority-queue": "^6.4.0",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^9.5.0",
    "@mui/material": "^9.5.0",
    "d3": "^7.9.2",
    "lodash": "^4.18.1",
    "react": "^19.3.1",
    "react-dom": "^19.3.1",
    "styled-components": "^6.6.0"
  },
  "devDependencies": {
    "@eslint/js": "latest",
    "@testing-library/dom": "latest",
    "@testing-library/jest-dom": "^7.0.1",
    "@testing-library/react": "^16.3.3",
    "@testing-library/user-event": "^14.6.8",
    "@types/d3": "^7.4.3",
    "@types/d3-hexbin": "^0.2.3",
    "@types/lodash": "^4.17.27",
    "@types/node": "latest",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.2.1",
    "eslint": "latest",
    "eslint-plugin-react-hooks": "latest",
    "eslint-plugin-react-refresh": "latest",
    "globals": "latest",
    "jsdom": "latest",
    "typescript": "~6.0.3",
    "typescript-eslint": "latest",
    "vite": "^8.3.6",
    "vite-tsconfig-paths": "^6.1.1",
    "vitest": "^5.1.0"
  }
}
```

> Use `pnpm up --latest` to resolve actual current minors; the numbers above are the versions verified during planning. Keep TS at 6.0 until `typescript-eslint` supports TypeScript 7.

---

## Appendix C — Rollback

Each phase is an isolated commit/PR. To roll back:

```bash
git switch main
git branch -D chore/modernize
```

Or revert a single phase:

```bash
git revert <phase-commit-sha>
```

Because `main` is never modified during the migration, deployment can always fall back to it.

---

## Suggested execution order (short version)

1. Phase 0 — branch, pin Node, baseline audit + screenshots
2. Phase 1 — Vite + modern TypeScript (biggest change; verify, then merge)
3. Phase 2 — pnpm
4. Phase 3 — React 19
5. Phase 4 — MUI 9 + styled-components 6
6. Phase 5 — Vitest + ESLint + first tests
7. Phase 6 — TS 7 trial, dependency sweep, security gate
8. Phase 7 — CI, Netlify, README
