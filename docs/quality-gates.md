# Quality-Gate Architecture

This document defines the layered quality gates that code must pass before reaching production. Every gate exists to prevent a specific class of defect, and each layer trades feedback speed for detection power.

The goal is not zero defects — it is **shift-left on feedback**: catch the cheapest defects earliest (lint at keystroke, types at commit, build before push, regressions in CI, architectural drift in review).

---

## Layer Overview

| Layer              | Feedback time | Runs where             | Stops                                         | Cost per event  |
| ------------------ | ------------- | ---------------------- | --------------------------------------------- | --------------- |
| **0 — Editor**     | ~100ms        | Developer machine      | Formatting, lint noise                        | Zero (passive)  |
| **1 — Pre-commit** | ~5-15s        | `pre-commit` hook      | Type errors, lint failures, malformed commits | Developer wait  |
| **2 — Pre-push**   | ~30-90s       | `pre-push` hook        | Build breaks, test failures                   | Developer wait  |
| **3 — CI**         | ~2-5m         | GitHub Actions on push | Regressions, coverage drops, bundle bloat     | Runner time     |
| **4 — PR Merge**   | Hours         | GitHub UI              | Architectural drift, missing context          | Human attention |

A defect should be caught at the earliest possible layer. If a type error reaches CI, the pre-commit gate is leaky and needs investigation.

---

## Layer 0 — Editor-time

Zero configuration burden on the developer. Tools run passively in the background.

### Gate: Format on save

| Tool     | Scope     | Trigger  |
| -------- | --------- | -------- |
| Prettier | All files | `Ctrl+S` |

Configured in `.vscode/settings.json`:

```jsonc
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit",
  },
}
```

### Gate: Inline diagnostics

| Tool   | Scope         | Trigger             |
| ------ | ------------- | ------------------- |
| ESLint | `.ts`, `.tsx` | On file open / edit |

The VS Code ESLint extension reads `eslint.config.mjs` and surfaces errors and warnings in-editor before the developer even saves.

### Failure mode

A developer who disables format-on-save or ignores red squiggles will be caught by Layer 1. Editor-time gates are convenience, not enforcement.

---

## Layer 1 — Pre-commit

Runs on `git commit`. Every commit that reaches a remote branch should be clean at this layer.

### Gate: lint-staged

| Tool          | Scope                         | Action                              |
| ------------- | ----------------------------- | ----------------------------------- |
| `lint-staged` | Staged `.ts`, `.tsx` files    | `eslint --fix` + `prettier --write` |
| `lint-staged` | Staged `.css`, `.json`, `.md` | `prettier --write`                  |

Only staged files are linted, keeping the hook fast (~1s for typical commits). The `--fix` flag auto-fixes what it can; remaining failures abort the commit.

**Configuration** (`.lintstagedrc.mjs`):

```js
export default {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md}": ["prettier --write"],
};
```

### Gate: TypeScript type check

| Tool           | Scope        | Action                          |
| -------------- | ------------ | ------------------------------- |
| `tsc --noEmit` | Full project | Emit errors for type violations |

**Why full-project, not staged-only:** A type error in an unstaged file can cause a type error in a staged file through shared interfaces. Staged-only type checking gives false confidence.

This is the slowest pre-commmit step (~5-15s). Acceptable — type errors are the most expensive defect class to find later.

### Gate: Commit message validation

| Tool         | Scope          | Action                                       |
| ------------ | -------------- | -------------------------------------------- |
| `commitlint` | Commit message | Validate format against conventional commits |

Prevents non-standard messages from entering the log. Enforced by `commit-msg` hook.

**Configuration** (`commitlint.config.mjs`):

```js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "scaffold",
        "tooling",
        "styling",
        "i18n",
        "lib",
        "providers",
        "ui",
        "hooks",
        "layout",
        "blocks",
        "seo",
        "pages",
        "security",
        "testing",
        "docs",
        "project",
      ],
    ],
    "header-max-length": [2, "always", 72],
    "body-max-line-length": [2, "always", 80],
  },
};
```

**Valid examples:**

```
feat(blocks): add Hero block with center/left layout
fix(ui): correct Button disabled color contrast
docs(quality-gates): add pre-commit section
```

### Failure mode

Any of these gates fails → commit is aborted, nothing reaches the git object store. The developer fixes locally and retries.

---

## Layer 2 — Pre-push

Runs on `git push`. Catches defects that span multiple commits or require a full build.

### Gate: Production build

| Tool         | Scope        | Action           |
| ------------ | ------------ | ---------------- |
| `next build` | Full project | Production build |

A production build catches:

- Missing exports and incorrect imports
- Tree-shake boundary violations (`"use client"` placement)
- Unresolved module paths
- Misconfigured dynamic routes

This is the single most valuable pre-push gate. If the build breaks, the push is rejected.

### Gate: Unit tests

| Tool         | Scope                                    | Action             |
| ------------ | ---------------------------------------- | ------------------ |
| `vitest run` | `**/*.test.{ts,tsx}` (excluding stories) | Run all unit tests |

Unit tests are fast enough (~10-30s) that running them pre-push is practical. This catches logic regressions before they reach shared branches.

### Failure mode

Build fails or any test fails → push is rejected. The developer runs `pnpm build && pnpm test:run` locally to reproduce, fixes, and retries.

---

## Layer 3 — CI (Push / PR)

Runs on every push to any branch (CI) and on every PR. This is the authoritative gate: passing CI means the code is deployable from a tooling perspective.

### Pipeline: `.github/workflows/ci.yml`

```
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      1. Checkout
      2. Install pnpm
      3. pnpm install --frozen-lockfile
      4. pnpm lint
      5. pnpm typecheck
      6. pnpm test:run -- --coverage
      7. pnpm build
```

| Step      | Tool                    | Fails on                                                             | Notes                                                                                  |
| --------- | ----------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Lint      | `next lint`             | Any ESLint error; warnings treated as errors with `--max-warnings=0` | Full project (not just staged)                                                         |
| Typecheck | `tsc --noEmit`          | Any type error                                                       | Redundant with pre-commit but enforced for CI-only contributors (e.g., PRs from forks) |
| Test      | `vitest run --coverage` | Any test failure OR coverage below threshold                         | Coverage threshold configurable in `vitest.config.ts`                                  |
| Build     | `next build`            | Any build error or warning                                           | Blocking — non-negotiable                                                              |

### Pipeline: `.github/workflows/playwright.yml`

Separate workflow to keep the main CI fast. Runs only on push to `main` and on PRs with the `e2e` label.

```
on:
  push:
    branches: [main]
  pull_request:
    types: [labeled, synchronize]

jobs:
  e2e:
    if: contains(github.event.pull_request.labels.*.name, 'e2e') || github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      1. Checkout
      2. Install pnpm
      3. pnpm install --frozen-lockfile
      4. npx playwright install --with-deps
      5. pnpm test:e2e
```

**Rationale for labeling:** E2E tests are slow (3-5m). Running them on every push would add latency to the inner loop. Labeling keeps them opt-in for PRs while still running on every `main` push.

### Pipeline: Bundle analysis

Optional but recommended. Runs on PRs and comments with a size diff.

| Tool                    | Step    | Action                 |
| ----------------------- | ------- | ---------------------- |
| `@next/bundle-analyzer` | Analyze | Generate bundle report |

The `--webpack` flag is required because `@next/bundle-analyzer` is incompatible with Turbopack (Next.js 16's default build engine). Without the flag, the script would pass silently but generate no report.

Can be its own workflow or a step in the main CI. If bundle size increases by more than 10% or 50KB for a first-load chunk, flag for review.

### Coverage thresholds (`vitest.config.ts`)

```ts
test: {
  coverage: {
    provider: "v8",
    thresholds: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
    include: ["src/**/*.{ts,tsx}"],
    exclude: [
      "**/*.stories.{ts,tsx}",
      "**/*.types.ts",
      "**/*.mocks.ts",
      "src/app/**",         // App router glue — thin, hard to unit-test
      "src/components/pages/**",     // Page composition — tested via Playwright
    ],
  },
},
```

These thresholds are defaults. They should be **raised**, never lowered, over the project's lifetime.

### Failure mode

Any CI step fails → the commit/PR is marked red in GitHub. Merging is blocked by branch protection rules. The developer must push a fix.

---

## Layer 4 — PR Merge

The final gate before code enters `main`. Unlike layers 0-3, this gate is human-driven.

### Gate: Branch naming convention

Enforced by CI script or server-side hook:

```
pattern: ^(feat|fix|chore|docs|refactor)/<issue-number>-<kebab-description>
example: feat/42-add-hero-block
```

Not a hard block (can be overridden for direct pushes to `main`), but CI emits a warning on non-conforming branch names.

### Gate: Pull request template

File: `.github/pull_request_template.md`

```md
## Summary

<!-- One to two sentences. What does this change do and why? -->

## Changes

<!-- Bullet list of specific changes. Not a repeat of the diff — intent and context. -->

- …
- …

## Quality Checklist

- [ ] Lint passes (`pnpm lint`)
- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] Tests pass (`pnpm test:run`)
- [ ] Build passes (`pnpm build`)
- [ ] Storybook stories added or updated for new/changed components
- [ ] i18n messages added for new copy (or confirmed none needed)
- [ ] No TODO, debug code, or console.log remains
- [ ] PR targets the correct branch (not main directly for features)
```

The checklist is self-certified. CI enforces the tooling checks; the checklist reminds the author of non-automatable items.

### Gate: Code review

- **Minimum approvals:** 1
- **Required reviewers:** At least one team member other than the author
- **Scope of review:**
  - Architectural fit (does this belong in template or project-components?)
  - Naming and file structure (does it match conventions?)
  - Edge cases and error states
  - Test coverage (are the right tests present?)
  - i18n completeness (are new strings in the right namespace?)
  - Accessibility (are interactive elements focusable and labelled?)

Review is not a rubber stamp. If the reviewer cannot understand the change from the PR description alone, the PR needs more context, not a faster reviewer.

### Gate: Branch up to date

The target branch (typically `main`) must not have diverged since the PR was opened. A stale PR is blocked by GitHub branch protection:

```
Settings > Branches > Branch protection rule for main:
  ✓ Require status checks to pass before merging
  ✓ Require branches to be up to date
  ✓ Require pull request reviews before merging (at least 1)
  ✓ Do not allow bypassing the above settings
```

### Gate: Linear history

Merge strategy: **squash merge** only.

```
Settings > Merge button:
  ✓ Allow squash merging
  ☐ Allow merge commits
  ☐ Allow rebase merging
```

This keeps `main` history linear and each commit a coherent unit of work. The commit message is auto-generated from the PR title + description, which must follow conventional commit format.

---

## Scripts Reference

The following scripts in `package.json` are consumed by the gates above:

```jsonc
{
  "scripts": {
    "lint": "next lint --max-warnings=0",
    "typecheck": "tsc --noEmit",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "test:storybook": "test-storybook",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "build": "next build",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "analyze": "ANALYZE=true next build --webpack",
    "prepare": "husky",
  },
}
```

---

## Husky Hooks

```
.husky/
├── pre-commit     # lint-staged
├── pre-push       # pnpm build && pnpm test:run
└── commit-msg     # commitlint --edit
```

---

## Config Files Added by This Architecture

| File                               | Purpose                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| `.husky/pre-commit`                | lint-staged                                                                    |
| `.husky/pre-push`                  | `pnpm build && pnpm test:run`                                                  |
| `.husky/commit-msg`                | `commitlint --edit`                                                            |
| `commitlint.config.mjs`            | Conventional commit rules with scoped valid scopes                             |
| `.lintstagedrc.mjs`                | Staged-file lint + format                                                      |
| `vitest.config.ts`                 | (already planned) — adds coverage thresholds                                   |
| `.storybook/main.ts`               | Storybook framework + stories glob + static dirs                               |
| `.storybook/preview.tsx`           | Global decorators (NextIntlClientProvider, ThemeProvider) + globals.css import |
| `.github/pull_request_template.md` | PR checklist                                                                   |
| `.github/workflows/ci.yml`         | Lint → typecheck → test → build                                                |
| `.github/workflows/playwright.yml` | E2E on main + opt-in PRs                                                       |

---

## Relationship to Other Documents

| Document                                        | Connection                                                                                                                                                                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Contributing](./contributing.md)               | Testing tiers, conventions, how-tos — the human-facing counterpart to the automated gates here                                                                                                                                                                           |
| [Implementation Plan](./implementation.md)      | Phase 0.5 (Git Init) makes the repo a git repo so the gates have commits to fire on; Phase 1 (Tooling & Config) creates the gate files themselves. The two phases are co-dependent: without 0.5, Phase 1's hooks are inert; without Phase 1, 0.5 has no gates to enforce |
| [ADR-0002](./adr/0002-event-tracking-system.md) | Event system — verified by unit tests                                                                                                                                                                                                                                    |

---

## Appendix: Cost-Benefit Summary

| Gate                       | Time cost    | Catches                                                                                                       | Misses                    |
| -------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Editor lint                | 0s (passive) | Syntax, formatting                                                                                            | Logic, types, build       |
| tsc (pre-commit)           | 5-15s        | Type mismatches, missing exports                                                                              | Runtime logic, CSS        |
| lint-staged                | ~1s          | Staged-file lint                                                                                              | Untracked files           |
| commitlint                 | ~0.1s        | Malformed commit messages                                                                                     | Content                   |
| Build (pre-push)           | 30-90s       | Build breaks, module resolution                                                                               | Test failures             |
| Unit tests (pre-push)      | 10-30s       | Logic regressions                                                                                             | Integration, E2E          |
| CI full suite              | 2-5m         | Everything above on fresh environment                                                                         | Story-level interaction   |
| E2E (CI)                   | 3-5m         | Cross-page flows, browser behavior                                                                            | Per-component behaviour   |
| Storybook test-runner (CI) | 1-3m         | Per-component interaction regressions, a11y violations (`@storybook/addon-a11y` runs aXe against every story) | Cross-component flows     |
| Code review                | Hours        | Architecture, naming, coverage gaps                                                                           | Automated-checkable items |

The remaining gap — visual regression testing against pixel baselines (Chromatic/Percy) — is intentionally out of scope for this template. The `@storybook/addon-a11y` panel provides a component-level a11y gate; projects that need pixel-diff baselines can add Chromatic as an additional step that consumes the `build-storybook` artifact.
