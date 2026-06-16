# Implementation Plan — marketing-starter

## Dependencies

The starter pins a specific dependency set. Exact pinned versions live in `package.json`; this section enumerates the **major** dependencies with their canonical versions so a reader can audit supply-chain risk and version compatibility without grepping the lockfile. Every entry maps to the phase that introduces or relies on it. The `^` prefix indicates the minimum major.minor (or major.minor.patch for `0.x.y` packages) that satisfies the phase's stated requirements.

### Runtime

| Package          | Version  | Phase | Purpose                                                           |
| ---------------- | -------- | ----- | ----------------------------------------------------------------- |
| `next`           | `^16`    | 0     | App Router + Turbopack (per README "Stack" table)                 |
| `react`          | `^19`    | 0     | Required by Next.js 16                                            |
| `react-dom`      | `^19`    | 0     | Required by Next.js 16                                            |
| `typescript`     | `^5.7`   | 0     | Strict mode (per README "Stack" table)                            |
| `tailwindcss`    | `^4`     | 2     | v4 with `@theme` directive                                        |
| `next-intl`      | `^3.26`  | 1     | i18n routing + messages (installed in Phase 1 for next.config.ts) |
| `next-themes`    | `^0.4`   | 5     | System + user toggle                                              |
| `lucide-react`   | `^0.460` | 6     | Icon set used by FeatureGrid, Hero, CTA                           |
| `zod`            | `^3.23`  | 4     | Env schema in `src/lib/env.ts`                                    |
| `clsx`           | `^2.1`   | 4     | `cn()` building block                                             |
| `tailwind-merge` | `^2.5`   | 4     | `cn()` building block (resolves Tailwind class conflicts)         |

`next/font` ships with `next` and requires no separate install.

### Development

| Package                           | Version | Phase | Purpose                                            |
| --------------------------------- | ------- | ----- | -------------------------------------------------- |
| `eslint`                          | `^9`    | 1     | Flat config                                        |
| `eslint-config-next`              | `^16`   | 1     | Next.js core-web-vitals + TypeScript rules         |
| `eslint-config-prettier`          | `^9.1`  | 1     | Disables ESLint rules conflicting with Prettier    |
| `eslint-plugin-import`            | `^2.31` | 1     | Enforces explicit import paths (no barrel exports) |
| `eslint-plugin-jsx-a11y`          | `^6.10` | 1     | Accessibility rules                                |
| `prettier`                        | `^3.3`  | 1     | Code formatter                                     |
| `husky`                           | `^9.1`  | 1     | Git hooks manager                                  |
| `lint-staged`                     | `^15.2` | 1     | Staged-file lint + format                          |
| `@commitlint/cli`                 | `^19.5` | 1     | Conventional-commit validator                      |
| `@commitlint/config-conventional` | `^19.5` | 1     | Preset config                                      |
| `vitest`                          | `^2.1`  | 1     | Unit test runner (jsdom environment)               |
| `@vitest/coverage-v8`             | `^2.1`  | 1     | Coverage thresholds (80/70/80/80)                  |
| `@testing-library/react`          | `^16`   | 1     | Component testing                                  |
| `@testing-library/jest-dom`       | `^6`    | 1     | Jest-dom matchers                                  |
| `jsdom`                           | `^25`   | 1     | DOM environment for Vitest                         |
| `playwright`                      | `^1.48` | 1     | Browser drivers                                    |
| `@playwright/test`                | `^1.48` | 1     | E2E runner                                         |
| `@next/bundle-analyzer`           | `^16`   | 1     | `pnpm analyze` script                              |
| `storybook`                       | `^8.3`  | 1     | Visual + a11y dev server                           |
| `@storybook/nextjs-vite`          | `^8.3`  | 1     | Framework adapter                                  |
| `@storybook/test`                 | `^8.3`  | 1     | Interaction testing                                |
| `@storybook/addon-a11y`           | `^8.3`  | 1     | Accessibility panel                                |
| `@storybook/test-runner`          | `^0.20` | 1     | CI story tests                                     |

### Implicit companions (dev)

Required by the packages above but tooling, not application surface — listed here for supply-chain completeness:

- `@types/node` `^24` — Node 24 type definitions
- `@types/react` `^19` — React 19 type definitions
- `@types/react-dom` `^19` — React DOM 19 type definitions
- `@vitejs/plugin-react` `^4` — React plugin for Vitest
- `typescript-eslint` `^8` — TypeScript ESLint flat-config integration

### Node

- **Node** `^24` (codename **Krypton**) — pinned in `.nvmrc` as `lts/krypton`. Node 24 is the active LTS line as of the start of this project and is the minimum for Next.js 16's Turbopack production builds. The `.nvmrc` alias is non-obvious; this section is its canonical expansion. CI runners and contributors' `nvm` / `fnm` installs must use Node 24 — `.npmrc` declares `engine-strict=true` so a mismatched Node version fails `pnpm install` immediately.

---

## Phase 0: Project Scaffold

- `pnpm create next-app@latest . --eslint --src-dir --import-alias "@/*" --use-pnpm --react-compiler`
  - Accepts scaffolded ESLint config as temporary; **Phase 1 replaces it entirely** with canonical flat config.
  - Accepts scaffolded `next.config.ts` as temporary; **Phase 1 configures next-intl wrapper** after `next-intl` is installed.
- Add `.nvmrc` (lts/krypton)
- Add `.npmrc` (engine-strict=true)
- Verify `.gitignore` — `create-next-app` emits a baseline (`.next`, `node_modules`, `.env*.local`, `*.tsbuildinfo`, etc.); add `coverage/` for Vitest output
- Initial commit: `chore(scaffold): initialize project scaffold`
- **Per-phase commit convention** (effective from Phase 1 onward): every phase ends with `git add -A && git commit -m "<type>(<scope>): <description>"`. The scope must match the commitlint `scope-enum` defined in Phase 1. The commit is the verification audit trail: if a phase isn't committed, it isn't done.

---

## Phase 1: Tooling & Config

### Install Phase 1 Dependencies

- Install all devDependencies listed in the Dependencies table for Phase 1 (eslint, prettier, husky, vitest, playwright, storybook, etc.)
- Install `next-intl` (runtime dependency, required for `next.config.ts` configuration)
- **Do NOT wrap `next.config.ts` with `withNextIntl` yet** — the plugin validates the existence of `src/i18n/request.ts` at build time. Applying the wrapper before that file exists causes `next dev` / `next build` to throw `Could not locate request configuration module`. The wrapper is applied in Phase 3 after the i18n files are created.

### ESLint

- **Replace scaffolded config entirely** with canonical flat config (`eslint.config.mjs`)
- Extend `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`, `eslint-config-prettier`
- Custom rules: `no-unused-vars` (error, argsIgnorePattern: "^\_"), `no-shadow` (error)
- `--max-warnings=0` for the `lint` script (warnings treated as errors in CI)
- Ignore `.next`, `out`, `node_modules`, `next-env.d.ts`

### Prettier

- `.prettierrc`: trailingComma es5, tabWidth 2, semi true, singleQuote false
- `.prettierignore`: `.npm`, `.next`, `dist`, `node_modules`

### Husky + commitlint

- Initialize husky with three hooks:
  - `pre-commit`: `npx lint-staged` (fast, staged-only lint + format)
  - `pre-push`: `pnpm build && pnpm test:run` (build + unit tests before remote)
  - `commit-msg`: `npx --no -- commitlint --edit $1` (validate conventional commit)
- `commitlint.config.mjs`: extend `@commitlint/config-conventional` with valid scopes matching the phase list (scaffold, tooling, styling, i18n, lib, providers, ui, hooks, layout, blocks, seo, pages, security, testing, docs, project)
- `pnpm prepare` script: `husky` (auto-configures git hooks on install)

### lint-staged

- `.lintstagedrc.mjs`: staged `.ts/.tsx` → eslint --fix + prettier --write; staged `.css/.json/.md` → prettier --write
- Keeps pre-commit fast (~1s) by operating only on staged files

### VSCode

- `.vscode/settings.json`: Prettier as default formatter, format-on-save, organize imports on save

### Vitest

- `vitest.config.ts`: jsdom environment, globals true, setup file
- `vitest.setup.ts`: extend expect with jest-dom matchers, cleanup afterEach
- Include pattern: `**/*.{test,spec}.*`, exclude stories and .storybook
- **Coverage thresholds** (via `@vitest/coverage-v8`): statements 80%, branches 70%, functions 80%, lines 80%
- Coverage excludes: stories, types, mocks, app router glue, page composition components (tested via E2E)

### Playwright

- `playwright.config.ts`: chromium + firefox + webkit, tests in `tests/`
- `tests/example.spec.ts`: smoke test (homepage renders)

### Storybook

- devDependencies: `storybook`, `@storybook/nextjs-vite`, `@storybook/test`, `@storybook/addon-a11y`
- `.storybook/main.ts`: stories glob `**/*.stories.@(ts|tsx)`, framework `@storybook/nextjs-vite`, static dirs `["../public"]`
- `.storybook/preview.tsx`: imports `../src/app/globals.css` (token system) and wraps decorators in `NextIntlClientProvider` + `ThemeProvider` so stories render with the same provider context as production
- `pnpm storybook` — local dev server (port 6006)
- `pnpm build-storybook` — static bundle for CI artifacts and visual baselines
- `pnpm test:storybook` — `@storybook/test-runner` invocation: boots the static build, runs interaction tests referenced by Phase 13 (e.g. `LocaleSwitcher`), and the `@storybook/addon-a11y` panel against every story. This is the project's visual + a11y gate.

### GitHub Actions

- `.github/workflows/ci.yml`: lint → typecheck → test (with coverage) → build
- `.github/workflows/playwright.yml`: E2E tests on push to main + opt-in via PR label

### Bundle analysis (optional)

- `@next/bundle-analyzer`: wired as `pnpm analyze` script
- PR workflow compares bundle size against `main` baseline; flag if first-load chunk grows >10% or 50KB

### PR template

- `.github/pull_request_template.md`: quality checklist (lint, typecheck, tests, build, stories, i18n, no debug code)

---

## Phase 2: Styling Foundation

### Design token system

Three-layer token architecture (primitive → semantic → component). Primitive tokens are defined in `src/app/globals.css` via Tailwind v4's `@theme` directive; semantic tokens and surface contexts live in `src/styles/tokens.css`. Component variant/size/state styling conventions are defined in co-located CSS files under `@layer components`.

### Fonts

- `src/lib/styles/fonts.ts`: Geist Sans + Geist Mono via `next/font/google`
- Export `fontVariables` string for `<body>` className`

### CSS entry point

- `app/layout.tsx` imports `./globals.css` — the sole CSS entry point. `globals.css` holds the `@theme` block (primitive tokens), imports semantic token files (`tokens.css`, `utilities.css`, `base.css`), and imports every component CSS file. No component imports its own CSS.

---

## Phase 3: i18n

### Routing

- `src/i18n/routing.ts`: `defineRouting` with locales `["en", "da"]`, default `"en"`, prefix `"as-needed"` + exports `locales` array and `Locale` type (single source of truth)
- `src/i18n/routing.ts` also exports `generateStaticParamsForLocales()` — returns `locales.map((locale) => ({ locale }))`. Every locale-aware route re-exports it as `generateStaticParams` (see Phase 11). One helper, one import — never re-implement the function per page.
- `src/i18n/request.ts`: Server-side `getRequestConfig` merging base + custom messages (imports `routing` and `locales` from `routing.ts`)
- `src/i18n/navigation.ts`: Wraps next-intl's `createNavigation(routing)` to produce locale-aware `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` — not a pass-through, required by next-intl setup

### Middleware

- `src/proxy.ts`: `createMiddleware` from next-intl (i18n routing only — security headers are applied via `next.config.ts` in Phase 12)

### Messages

- `messages/base/en.json`: Strings pre-translated by template author (cookie banner, not-found, error, legal boilerplate)
- `messages/base/da.json`: Danish equivalents
- `messages/custom/en.json`: Strings translated per project (header, footer, homepage, about, metadata)
- `messages/custom/da.json`: Danish equivalents

### Configure `next.config.ts` (next-intl plugin wrapper)

- **Warning: `withNextIntl` must be applied AFTER `src/i18n/request.ts` exists.** The plugin resolves the request config path via `resolveI18nPath()`, which throws `Could not locate request configuration module` if the file is missing when `next dev` or `next build` runs.
- Wrap Next.js config with `withNextIntl` from `next-intl` plugin
- This was moved from Phase 1 to Phase 3 because the plugin validates the i18n request config at runtime.

---

## Phase 4: Lib Modules

- `src/lib/utils.ts`: `cn()` function (clsx + tailwind-merge)
- `src/lib/env.ts`: Zod schema validating `NEXT_PUBLIC_SITE_URL`, export `env` object
- `src/lib/config/site.ts`: `SITE_CONFIG` const with validation guard against defaults
- `src/lib/config/routes.ts`: Route constants (HOME, ABOUT, PRIVACY, COOKIE_POLICY)
- `src/lib/config/navigation.ts`: NavLink[], HeaderCTA[], legalLinks
- (Surface type, site config, nav config, route constants)
- `src/lib/events.ts`: Type-safe event descriptors
- `src/lib/consent/storage.types.ts`: ConsentStorage interface + ConsentStatus type, ConsentCookieName constant
- `src/lib/consent/storage.ts`: createCookieStorage() + createFakeStorage() factories
- **Note:** There is no standalone reactive consent module. The storage seam is the single source of truth. Reactive consent state flows through `ConsentProvider` (Phase 5) via React context. The event dispatch layer (see ADR-0002) reads consent synchronously from storage — no separate `lib/consent.ts` with a duplicated state machine.
- (styling/variant approach defined in co-located CSS files under `@layer components`)

---

## Phase 5: Providers

- `src/components/providers/ConsentProvider.tsx`: React context with `accept()`, `decline()`, `reset()`, `status`; accepts optional `storage` prop (defaults to `createCookieStorage()`)

### Provider chain (wired inline in layout)

Providers are nested **inline** inside `app/[locale]/layout.tsx` — there is no intermediary wrapper component. The layout renders:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
	<NextIntlClientProvider
		locale={locale}
		messages={messages}
		timeZone={SITE_CONFIG.timezone}
	>
		<ConsentProvider>
			<SiteHeader />
			<main>{children}</main>
			<SiteFooter />
			<CookieBanner />
		</ConsentProvider>
	</NextIntlClientProvider>
</ThemeProvider>
```

- ThemeProvider: `attribute="class"`, `defaultTheme="system"`, `enableSystem`
- With only three providers, an `AppProviders` wrapper adds a file and an import with no behavioral value. Inline nesting is simpler and more direct. If a fourth cross-cutting provider is ever needed, it nests here.

---

## Phase 6: UI Primitives

- `Button`: Forwarded-ref, 5 variants (primary/secondary/accent/transparent/ghost), 3 sizes (sm/md/lg), loading spinner, left/right icons, disabled state, focus-visible ring, tracking integration
- `Button.types.ts`: ButtonProps, ButtonVariant
- `Button.mocks.ts`: Mock props
- `Button.stories.tsx`: Playground + all-variants matrix
- `Button.test.tsx`: Rendering, variants, sizes, loading, disabled, icons, tracking
- (variant/size styling via CSS classes in `src/components/ui/button/Button.css` — see Phase 2)
- `LinkButton`: Styled next-intl `<Link>`, variants per background surface
- `LinkButton.types.ts`: LinkButtonProps
- `LinkButton.mocks.ts`: Mock props
- `LinkButton.stories.tsx`: Playground + on-white/on-dark/on-accent matrix
- (variant styles via CSS classes in `src/components/ui/link-button/LinkButton.css` — see Phase 2)
- `Text`: Polymorphic body copy component. Polymorphic `as` prop (p/span/div/label/figcaption/small), 4 sizes (sm/base/lg/lead), 2 variants (default/muted). Surface adaptation via CSS cascade.
- `Text.types.ts`: TextProps, TextSize, TextVariant
- `Text.mocks.ts`: Mock props for all size + variant combos
- `Text.stories.tsx`: Size + variant matrix playground
- (size/variant classes in `src/components/ui/text/Text.css`: `.text-sm`, `.text-base`, `.text-lg`, `.text-lead`, `.text-default`, `.text-muted`)
- `Heading`: Polymorphic h1-h4 with consistent styling
- `Heading.mocks.ts`: Mock props
- `Heading.stories.tsx`: All heading levels
- `Image`: Wraps next/image with required alt prop
- `Image.stories.tsx`: With and without custom dimensions
- `Brand`: Site name with accent dot, optional link wrapper (Tier 0 — flat file, no directory, no story)
- `LocaleSwitcher`: Toggle between en/da without full page reload
- `LocaleSwitcher.stories.tsx`: Playground
- `ToggleMode`: Dark/light toggle using next-themes
- `ToggleMode.stories.tsx`: Both modes
- `ManageCookiesButton.tsx`: Resets consent, re-showing CookieBanner (Tier 0 — flat file, no directory, no story)

---

## Phase 7: Hooks

- `hooks/useButtonTracking.ts`: Wraps onClick with analytics; `configureTracking()` adapter
- `hooks/useScrollLock.ts`: Prevents body scroll when drawer is open
- `hooks/useFocusTrap.ts`: Traps focus within drawer + closes on Escape
- Composed inside `MobileDrawer.tsx` as two local hook calls

Note: `useScrolled` is intentionally omitted — scroll detection is inlined in `SiteHeader.tsx` via `useState` + `useEffect`. One consumer does not warrant a shared hook.

---

## Phase 8: Layout Components (Shell)

- `Section`: Generic section wrapper with size (sm/md/lg/xl), surface (white/subtle/dark/accent), polymorphic `as`, and `contained` flag (default `true`). When `contained`, applies `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` as structural Tailwind utilities so content is centered with a max width; when `false`, content spans the full viewport width
- `Section.types.ts`: SectionProps, SectionSize
- (size/background maps eliminated — variant/size styling via CSS classes in `src/components/layout/section/Section.css`, see Phase 2)
- `SiteHeader`: Sticky header with brand, nav links, CTAs, theme toggle, LocaleSwitcher, mobile hamburger; solid/transparent variant, scroll-based transition
- `SiteHeader.types.ts`: Header props
- `SiteHeader.mocks.ts`: Mock data
- `SiteHeader.stories.tsx`: Storybook stories
- `SiteFooter`: Multi-column with brand, tagline, social links, nav columns, legal, copyright, ManageCookiesButton
- `SiteFooter.types.ts`: Footer props
- `SiteFooter.mocks.ts`: Mock data
- `SiteFooter.stories.tsx`: Storybook stories
- `MobileDrawer`: Slide-in nav with backdrop, focus trap, Escape-to-close, body scroll lock
- `MobileDrawer.stories.tsx`: Storybook stories
- `CookieBanner`: Fixed bottom banner, accept/decline, privacy link, slide-up animation, consent-gated

---

## Phase 9: Blocks

- `Hero`: Headline, subheadline, CTAs (1-2), media slot, `layout` prop for center/left alignment (page composer chooses based on surface)
- `Hero.types.ts`: HeroProps
- `Hero.mocks.ts`: Mock data (center + left alignment variants)
- `Hero.stories.tsx`: Both alignments
- `FeatureGrid`: 2/3/4 column responsive grid, optional eyebrow/heading/subheading, feature cards with icon + title + description
- `FeatureGrid.types.ts`: FeatureGridProps, FeatureCardProps
- `FeatureGrid.mocks.tsx`: 3-column + 4-column variants
- `FeatureGrid.stories.tsx`: Column variants
- `Card` (inline or co-located): Individual feature card component
- `CTA`: Heading, subheading, buttons, background-aware (dark/accent = inverted text)
- `CTA.types.ts`: CTAProps
- `CTA.mocks.ts`: Light + dark variants
- `CTA.stories.tsx`: Light + dark backgrounds
- `TextBlock`: Heading + body + optional image, image position (left/right/top), alignment (left/center/right)
- `TextBlock.types.ts`: TextBlockProps
- `TextBlock.mocks.ts`: All image position variants
- `TextBlock.stories.tsx`: All layout variants

---

## Phase 10: SEO

- `components/seo/JsonLdScripts.tsx`: Organization + WebSite JSON-LD
- `lib/seo/metadata.ts`: `getPageMetadata()` — canonical, hreflang, OG, Twitter
- `lib/seo/schemas.ts`: `buildOrganizationSchema()`, `buildWebsiteSchema()`, `buildBreadcrumbSchema()`

---

## Phase 11: Pages & Composition

> **Static generation requirement:** Every locale-aware route must pre-render one HTML file per shipped locale. Without `generateStaticParams`, the dynamic `[locale]` segment falls back to per-request dynamic rendering — the exact failure mode the template is trying to prevent.
>
> **Recipe — one line per route file:**
>
> ```ts
> export { generateStaticParamsForLocales as generateStaticParams } from "@/i18n/routing";
> ```
>
> `generateStaticParamsForLocales` is declared once in `src/i18n/routing.ts` (Phase 3) and re-exported, not duplicated. Adding a new locale is a single edit to `routing.ts`; the new locale flows through every page automatically.
>
> **Catch-all routes (`[...rest]`) are excluded** — they match arbitrary path segments at request time and cannot be meaningfully pre-rendered. Do not add the re-export there.

### Page components

- `components/pages/Index.tsx`: Hero + FeatureGrid + CTA (three sections)
- `components/pages/About.tsx`: TextBlock (image right) + TextBlock (image left, alternating)
- `components/pages/PrivacyPolicy.tsx`: TextBlock with legal content (no image, left-aligned)
- `components/pages/CookiePolicy.tsx`: TextBlock with cookie policy content (no image, left-aligned)

### App routes

Every route file below (except the catch-all) ends with the one-line re-export from `@/i18n/routing` shown above.

- `app/[locale]/page.tsx`: Renders Index page + OrganizationJsonLd
- `app/[locale]/about/page.tsx`: Renders About page + BreadcrumbJsonLd
- `app/[locale]/privacy/page.tsx`: Renders PrivacyPolicy page
- `app/[locale]/cookie-policy/page.tsx`: Renders CookiePolicy page
- `app/[locale]/[...rest]/page.tsx`: Catch-all → notFound() (no `generateStaticParams` — dynamic, matches at request time)
- `app/[locale]/layout.tsx`: Full HTML, providers, SiteHeader + main + SiteFooter + CookieBanner
- `app/[locale]/error.tsx`: Error boundary with retry
- `app/[locale]/loading.tsx`: Loading spinner/skeleton
- `app/[locale]/not-found.tsx`: 404 page with link to home
- `app/error.tsx`: Root error boundary
- `app/layout.tsx`: Bare pass-through
- `app/robots.ts`: Dynamic robots.txt
- `app/sitemap.ts`: Dynamic sitemap with en/da + hreflang
- `app/opengraph-image.tsx`: Dynamic OG image (Node.js runtime)

---

## Phase 12: Security

**Rule:** All security headers — CSP and the rest — are applied via `next.config.ts` `headers()`. `src/proxy.ts` does not apply security headers. This is the single canonical home for HTTP security headers, documented in [`architecture.md`](./architecture.md#security). The split is intentional and explicit; do not move headers between these two files.

- `security/csp.ts`: CSP policy string generator (dev vs prod)
- `security/headers.ts`: `createSecurityHeaders()` returning header array (CSP + the rest)
- (csp.hashes.ts excluded — empty placeholder contradicts "no auto-hash" philosophy; inline script hashes go directly in `csp.ts` when needed)
- Update `next.config.ts` `headers()` to import `createSecurityHeaders()` and apply the result to every response (CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`)
- `src/proxy.ts` is intentionally untouched in this phase — it handles i18n routing only

---

## Phase 13: Testing

### Tier 1 (stories + mocks)

- All UI primitives (Button, LinkButton, Heading, Image, LocaleSwitcher, ToggleMode)
- All blocks (Hero, FeatureGrid, CTA, TextBlock)
- Layout components (SiteHeader, SiteFooter, MobileDrawer, CookieBanner, Section)

### Tier 2 (unit tests)

- `Button.test.tsx`: Render variants, click handler, loading state, disabled state, icon rendering
- `LocaleSwitcher.stories.tsx`: (stories only — interaction tested via storybook-playwright)

### Tier 3 (lib tests)

- `lib/utils.test.ts`: `cn()` edge cases (conflicting classes, conditional classes, empty input)
- `lib/events.test.ts`: Integrity check for event descriptors
- `lib/env.test.ts`: (if feasible — Zod schema validation)

### Tier 4 (Playwright smoke)

- `tests/homepage.spec.ts`: Homepage renders, Hero visible, CTA visible
- `tests/navigation.spec.ts`: Nav links work, about page loads
- `tests/locale.spec.ts`: Locale switcher changes language
- `tests/not-found.spec.ts`: Invalid route shows 404
- `tests/cookie-banner.spec.ts`: Cookie banner appears, accept/decline works

---

## Execution Order

1. Phase 0 (Scaffold)
2. Phase 0.5 (Git init)
3. Phase 1 (Tooling)
4. Phase 2 (Styling)
5. Phase 3 (i18n)
6. Phase 4 (Lib)
7. Phase 5 (Providers)
8. Phase 6 (UI Primitives)
9. Phase 7 (Hooks)
10. Phase 8 (Layout shell)
11. Phase 9 (Blocks)
12. Phase 10 (SEO)
13. Phase 11 (Pages)
14. Phase 12 (Security)
15. Phase 13 (Testing)

Each phase should be implemented, tested, and verified before moving to the next. **Every phase ends with a commit** (`git add -A && git commit -m "<type>(<scope>): <description>"`) — the commit is the audit trail and the unit of CI verification. Run `pnpm lint` and `pnpm build` after each phase to catch errors early; CI re-runs the same checks on every push.
