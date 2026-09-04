# Implementation Plan — marketing-starter

This document is the reference for how the template's infrastructure is structured and why. It is the phased build plan for the cross-cutting layers the starter ships (tooling, i18n, lib, providers, hooks, SEO, security, testing). The visual layer — components, blocks, layout, and theming — is intentionally **not** shipped and is left to the end-user.

## Dependencies

The starter pins a specific dependency set. Exact pinned versions live in `package.json`; this section enumerates the **major** dependencies so a reader can audit supply-chain risk and version compatibility without grepping the lockfile.

### Runtime

| Package          | Version | Purpose                                                   |
| ---------------- | ------- | --------------------------------------------------------- |
| `next`           | `^16`   | App Router + Turbopack                                    |
| `react`          | `^19`   | Required by Next.js 16                                    |
| `react-dom`      | `^19`   | Required by Next.js 16                                    |
| `typescript`     | `^5.7`  | Strict mode                                               |
| `tailwindcss`    | `^4`    | Utility-first styling (v4 with `@import "tailwindcss"`)   |
| `next-intl`      | `^4`    | i18n routing + messages                                   |
| `zod`            | `^4`    | Env schema in `src/lib/env.ts`                            |
| `clsx`           | `^2.1`  | `cn()` building block                                     |
| `tailwind-merge` | `^3`    | `cn()` building block (resolves Tailwind class conflicts) |

### Development

| Package                           | Version | Purpose                                            |
| --------------------------------- | ------- | -------------------------------------------------- |
| `eslint`                          | `^9`    | Flat config                                        |
| `eslint-config-next`              | `^16`   | Next.js core-web-vitals + TypeScript rules         |
| `eslint-config-prettier`          | `^10`   | Disables ESLint rules conflicting with Prettier    |
| `eslint-plugin-import`            | `^2`    | Enforces explicit import paths (no barrel exports) |
| `prettier`                        | `^3`    | Code formatter                                     |
| `husky`                           | `^9`    | Git hooks manager                                  |
| `lint-staged`                     | `^17`   | Staged-file lint + format                          |
| `@commitlint/cli`                 | `^21`   | Conventional-commit validator                      |
| `@commitlint/config-conventional` | `^21`   | Preset config                                      |
| `vitest`                          | `^4`    | Unit test runner (jsdom environment)               |
| `@vitest/coverage-v8`             | `^4`    | Coverage thresholds (80/70/80/80)                  |
| `@testing-library/react`          | `^16`   | Component testing                                  |
| `@testing-library/jest-dom`       | `^6`    | Jest-dom matchers                                  |
| `@testing-library/user-event`     | `^14`   | User interaction simulation                        |
| `jsdom`                           | `^29`   | DOM environment for Vitest                         |
| `@playwright/test`                | `^1`    | E2E runner                                         |
| `@next/bundle-analyzer`           | `^16`   | `pnpm analyze` script                              |

### Implicit companions (dev)

- `@types/node` `^24`, `@types/react` `^19`, `@types/react-dom` `^19` — type definitions
- `@vitejs/plugin-react` `^6` — React plugin for Vitest
- `typescript-eslint` `^8` — TypeScript ESLint flat-config integration

### Node

- **Node** `^24` — pinned in `.nvmrc`. `.npmrc` declares `engine-strict=true` so a mismatched Node version fails `pnpm install` immediately.

---

## Phase 0: Project Scaffold

- `pnpm create next-app@latest . --eslint --src-dir --import-alias "@/*" --use-pnpm --react-compiler`
- Add `.nvmrc`, `.npmrc` (engine-strict=true)
- Verify `.gitignore` and add `coverage/` for Vitest output

---

## Phase 1: Tooling & Config

### ESLint

- Canonical flat config (`eslint.config.mjs`)
- Extends `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`, `eslint-config-prettier`
- Custom rules: `no-unused-vars` (error), `no-shadow` (error)
- `--max-warnings=0` for the `lint` script

### Prettier, Husky, commitlint, lint-staged

- `.prettierrc`, `.prettierignore`
- Husky hooks: `pre-commit` (lint-staged), `pre-push` (`pnpm build && pnpm test:run`), `commit-msg` (commitlint)
- `commitlint.config.mjs` with valid scopes

### Vitest

- `vitest.config.ts`: jsdom environment, globals true, setup file, single `unit` project
- Coverage thresholds (via `@vitest/coverage-v8`): statements 80%, branches 70%, functions 80%, lines 80%
- Coverage excludes: types, mocks, app router glue (`src/app/**`), config, `src/lib/env.ts`, `src/lib/events.ts`

### Playwright

- `playwright.config.ts`: chromium + firefox + webkit, tests in `tests/`
- `tests/not-found.spec.ts`: smoke test (404 page)

### GitHub Actions

- `.github/workflows/ci.yml`: lint → typecheck → test (with coverage) → build
- `.github/workflows/playwright.yml`: E2E tests on push to main + opt-in via PR label

---

## Phase 3: i18n

- `src/i18n/routing.ts`: `defineRouting` with locales `["en", "da"]`, default `"en"`, prefix `"as-needed"`, plus `generateStaticParamsForLocales()`
- `src/i18n/request.ts`: server-side `getRequestConfig` merging base + custom messages
- `src/i18n/navigation.ts`: `createNavigation(routing)` producing locale-aware `Link`, `redirect`, etc.
- `src/proxy.ts`: next-intl `createMiddleware` (i18n routing only — security headers are applied via `next.config.ts`)
- `messages/base/{locale}.json` + `messages/custom/{locale}.json`

---

## Phase 4: Lib Modules

- `src/lib/utils.ts`: `cn()` (clsx + tailwind-merge)
- `src/lib/env.ts`: Zod schema validating `NEXT_PUBLIC_SITE_URL`
- `src/lib/config/site.ts`: `SITE_CONFIG` with validation guard against defaults (override seam)
- `src/lib/events.ts`: typed discriminated-union event descriptors + `track.event()` dispatch, consent-gated
- `src/lib/consent/storage.types.ts`: `ConsentStorage` interface + `ConsentStatus` type
- `src/lib/consent/storage.ts`: `createCookieStorage()` + `createFakeStorage()` factories

There is no standalone reactive consent module. The storage seam is the single source of truth; reactive consent state flows through `ConsentProvider` via React context. The event dispatch layer reads consent synchronously from storage (see ADR-0002).

---

## Phase 5: Providers

- `src/components/providers/ConsentProvider.tsx`: React context with `accept()`, `decline()`, `reset()`, `status`; accepts optional `storage` prop (defaults to `createCookieStorage()`)

Providers are nested inline inside `app/[locale]/layout.tsx` — there is no intermediary wrapper component:

```tsx
<NextIntlClientProvider
  locale={locale}
  messages={messages}
  timeZone={SITE_CONFIG.timezone}
>
  <ConsentProvider>
    <main>{children}</main>
  </ConsentProvider>
</NextIntlClientProvider>
```

---

## Phase 7: Hooks

- `src/hooks/useButtonTracking.ts`: wraps onClick with analytics via `configureTracking()`
- `src/hooks/useScrollLock.ts`: prevents body scroll
- `src/hooks/useFocusTrap.ts`: traps focus + closes on Escape

These hooks ship as reusable building blocks for project components. They are unit-tested in isolation.

---

## Phase 10: SEO

- `src/components/seo/JsonLdScripts.tsx`: Organization + WebSite JSON-LD
- `src/lib/seo/metadata.ts`: `getPageMetadata()` — canonical, hreflang, Open Graph, Twitter
- `src/lib/seo/schemas.ts`: `buildOrganizationSchema()`, `buildWebsiteSchema()`, `buildBreadcrumbSchema()`

---

## Phase 11: Routes

Every locale-aware route re-exports `generateStaticParamsForLocales` from `@/i18n/routing` so each ships one HTML file per locale:

```ts
export { generateStaticParamsForLocales as generateStaticParams } from "@/i18n/routing";
```

- `app/[locale]/page.tsx`: home route — renders `JsonLdScripts` + page metadata
- `app/[locale]/[...rest]/page.tsx`: catch-all → `notFound()` (excluded from static params)
- `app/[locale]/layout.tsx`: locale layout — `NextIntlClientProvider` → `ConsentProvider` → `<main>`
- `app/[locale]/error.tsx`, `app/[locale]/not-found.tsx`, `app/[locale]/loading.tsx`
- `app/error.tsx`, `app/layout.tsx` (bare HTML shell)
- `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`

---

## Phase 12: Security

**Rule:** All security headers — CSP and the rest — are applied via `next.config.ts` `headers()`. `src/proxy.ts` does not apply security headers. See [`architecture.md`](./architecture.md#security).

- `src/security/csp.ts`: CSP policy string generator (dev vs prod)
- `src/security/headers.ts`: `createSecurityHeaders()` returning header array (CSP + the rest)
- `next.config.ts` `headers()` imports `createSecurityHeaders()` and applies it to every response

---

## Phase 13: Testing

- Unit tests (Vitest, jsdom): `lib/utils`, `lib/events`, `lib/consent/storage`, `lib/seo/{schemas,metadata}`, `security/{csp,headers}`, `hooks/*`, `providers/ConsentProvider`, `i18n/request`
- E2E (Playwright): `tests/not-found.spec.ts` (404 page smoke test)

---

## Execution Order

1. Phase 0 (Scaffold)
2. Phase 1 (Tooling & Config)
3. Phase 3 (i18n)
4. Phase 4 (Lib Modules)
5. Phase 5 (Providers)
6. Phase 7 (Hooks)
7. Phase 10 (SEO)
8. Phase 11 (Routes)
9. Phase 12 (Security)
10. Phase 13 (Testing)

Each phase should be implemented, tested, and verified before moving to the next. Run `pnpm lint` and `pnpm build` after each phase to catch errors early; CI re-runs the same checks on every push.
