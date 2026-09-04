# Contributing

## Conventions

### Import style

```ts
// ✅ Correct — explicit path, no barrel
import { getCspPolicy } from "@/security/csp";
import type { SecurityHeader } from "@/security/headers";

// ❌ Wrong — no barrel exports, no index.ts
import { getCspPolicy } from "@/security";
```

### Naming

- Hooks: camelCase, prefixed with `use`
- Utilities: camelCase
- Config objects: UPPER_SNAKE_CASE
- Types/interfaces: PascalCase, no `I` prefix
- Files: PascalCase for components, camelCase for utilities (e.g. `cn()` in `utils.ts`)

---

## How-Tos

### How to add a locale

1. Add the locale code to the `locales` array in `src/i18n/routing.ts`
2. Create `messages/base/{locale}.json` (strings pre-translated by template author)
3. Create `messages/custom/{locale}.json` (strings translated per project)
4. Done. The merge is handled automatically in `src/i18n/request.ts`.

### How to add or modify a security header

**Rule:** All HTTP security headers live in `next.config.ts` `headers()`. Do not add security headers to `src/proxy.ts` — that file handles i18n routing only. See [architecture.md → Security](./architecture.md#security) for the rationale.

1. For a new non-CSP header (e.g. `Cross-Origin-Opener-Policy`): update `security/headers.ts` to include it in the array returned by `createSecurityHeaders()`. The `next.config.ts` `headers()` function picks it up automatically.
2. For a CSP change: update `security/csp.ts` (dev and prod variants). `createSecurityHeaders()` composes CSP with the rest of the headers; no other file needs touching.
3. For environment-specific behaviour (e.g. HSTS only in prod): gate the header inside `createSecurityHeaders()` using `process.env.NODE_ENV` or a similar check. Do not branch in `next.config.ts`.
4. If you find yourself reaching for `src/proxy.ts` to set a security header, stop — the rule is `next.config.ts` only. Apply that rule even if the header seems route-specific.

---

## Decision Trees

### "Is this a base string or a custom string?"

```
Does this string need fresh translation per project?
├── Yes → It belongs in messages/custom/
│   (metadata, headlines, page copy, body content)
└── No → It belongs in messages/base/
    (404 / not-found text, error messages)

Will a copywriter or client edit this string?
├── Yes → custom/
└── No → base/

Is this string required for the template to function (not for content)?
├── Yes → base/
└── No → custom/
```

Any "yes" to the first branch of any question gives the answer. Base strings are pre-translated by the template author; custom strings are translated per project.

---

## Testing

| Scope                                                        | What's required                             |
| ------------------------------------------------------------ | ------------------------------------------- |
| Lib modules (events, consent, utils, SEO, security)          | Vitest unit test                            |
| Hooks (`useButtonTracking`, `useScrollLock`, `useFocusTrap`) | Vitest unit test                            |
| Providers (`ConsentProvider`)                                | Vitest unit test with injected fake storage |
| Routes (home, 404, error boundaries)                         | Playwright E2E smoke test                   |

Unit tests run in the jsdom environment with `@testing-library/react` and `@testing-library/user-event`. Coverage thresholds are enforced by `pnpm test:run` (see [`quality-gates.md`](./quality-gates.md)).

---

## Quality Gates

Code quality is enforced through a five-layer gate architecture that catches defects as early as possible — from editor keystrokes through to pull request review.

The full gate architecture is documented in [`quality-gates.md`](./quality-gates.md). The layers are:

| Layer              | Runs where                  | Enforces                                             |
| ------------------ | --------------------------- | ---------------------------------------------------- |
| **0 — Editor**     | Developer machine (passive) | Formatting, lint diagnostics                         |
| **1 — Pre-commit** | `pre-commit` hook           | lint-staged, TypeScript check, commit message format |
| **2 — Pre-push**   | `pre-push` hook             | Production build, unit tests                         |
| **3 — CI**         | GitHub Actions on push      | Lint, typecheck, unit tests, build, E2E, coverage    |
| **4 — PR Merge**   | GitHub UI                   | Code review, branch rules, linear history            |

**Key scripts:** `pnpm build` is the non-negotiable pre-push check — a broken build never reaches the remote. `pnpm test:run` runs the unit tests and enforces the coverage threshold.
