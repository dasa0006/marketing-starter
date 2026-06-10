## Conventions

### Component file structure

**Tier 0 — Trivial components (flat file, no directory):**

```
ComponentName.tsx        — Implementation (single file in category directory)
```

Candidates: components with no visual variation, trivial or no props, and a single consumer. Graduate to Tier 1 when a second consumer or visual variant appears.

**Tier 1 — All components (presentational):**

```
componentName/
├── ComponentName.tsx         — Implementation
├── ComponentName.types.ts    — Props interface + type unions
├── ComponentName.mocks.ts    — Typed mock data for stories (optional — see note below)
└── ComponentName.stories.tsx — Storybook stories (CSF3, @storybook/nextjs-vite)
```

**Tier 2 — Interactive components (adds test):**

```
componentName/
├── ComponentName.tsx
├── ComponentName.types.ts
├── ComponentName.mocks.ts     — Typed mock data for stories (optional — see note below)
├── ComponentName.stories.tsx
└── ComponentName.test.tsx    — Vitest unit test covering user interaction
```

**Mock file rule:** Create a separate `.mocks.ts` file when the props interface has 3+ fields or when mock data is shared across multiple stories. For components with simple or no props, embed mock data inline in the story file instead. This reduces file count without losing the pattern for complex cases.

**Tier 3 — Simple layout components (no mocks needed):**

```
componentName/
├── ComponentName.tsx
└── ComponentName.stories.tsx (optional)
```

**Style variants:** Defined by the design token system ([ADR-0001](./adr/0001-design-token-system.md)) and component styling conventions ([ADR-0003](./adr/0003-component-styling-conventions.md)). Variant classes (e.g. `.btn-primary`, `.btn-sm`) live in a co-located CSS file next to the component's TSX (e.g., `Button.css`) under `@layer components`. Components apply them via `cn()`. See the conventions ADR for the full variant/size/state pattern.

### Import style

```ts
// ✅ Correct — explicit path, no barrel
import { Button } from "@/components/ui/button/Button";
import type { ButtonProps } from "@/components/ui/button/Button.types";

// ❌ Wrong — no barrel exports, no index.tsx
import { Button } from "@/components/ui/button";
```

### Naming

- Component dirs: camelCase (`featureGrid/`). Files: PascalCase (`FeatureGrid.tsx`)
- Hooks: camelCase, prefixed with `use`
- Utilities: camelCase
- Config objects: UPPER_SNAKE_CASE
- Types/interfaces: PascalCase, no `I` prefix
- Files: PascalCase for components (`Button.tsx`), camelCase for utilities (`cn()` in `utils.ts`)

### CSS

All styling uses Tailwind utility classes only. Component variant and size classes are defined in a co-located CSS file next to the component's TSX (e.g., `Button.css`) under `@layer components`, organized as described in [ADR-0003](./adr/0003-component-styling-conventions.md). Never use raw `var()` or hardcoded hex values in component files. See [ADR-0001](./adr/0001-design-token-system.md) (token system) and [ADR-0003](./adr/0003-component-styling-conventions.md) (conventions) for the complete styling architecture.

---

## How-Tos

### How to add a page

1. Create the route directory: `src/app/[locale]/{page-name}/page.tsx`
2. Create the page component in `src/components/pages/{PageName}.tsx`
3. Compose blocks directly into the page component, wrapping each one in a `Section`:

   ```tsx
   return (
   	<>
   		<Section key="hero" surface="dark" size="xl" contained={false} as="article">
   			<Hero {...heroProps} />
   		</Section>
   		<Section key="features" surface="white" size="lg">
   			<FeatureGrid {...fgProps} />
   		</Section>
   		<Section key="cta" surface="accent" size="md">
   			<CTA {...ctaProps} />
   		</Section>
   	</>
   );
   ```

4. Add i18n messages to `messages/custom/{locale}.json`
5. Add the route to `src/lib/config/routes.ts`
6. Add navigation link to `src/lib/config/navigation.ts` (if applicable)
7. Re-export the locale-aware `generateStaticParams` helper at the bottom of the route file — **do not re-implement it**:

   ```ts
   export { generateStaticParamsForLocales as generateStaticParams } from "@/i18n/routing";
   ```

   Without this line, the dynamic `[locale]` segment forces per-request dynamic rendering. The helper lives in `src/i18n/routing.ts` (see Phase 3 / Phase 11 of the implementation plan) and is re-exported, not duplicated. Skip this step only for catch-all routes (`[...rest]`).

### How to add a component

1. Determine the category: `ui/` (primitive), `blocks/` (reusable pattern), or `project-components/` (client-specific)
2. If the component meets all Tier 0 criteria (no visual variation, trivial or no props, single consumer), create a single flat file at `src/components/{category}/{ComponentName}.tsx` and stop — no directory, no types, no mock, no story
3. Otherwise, create the directory: `src/components/{category}/{ComponentName}/`
4. Create types file (props interface, variant/size unions)
5. Create component file (exported named function, forwardRef for interactive elements)
6. Create mocks file if needed (typed export matching the props interface) — create a separate `.mocks.ts` when props have 3+ fields or mock data is shared across stories; otherwise inline mock data in the story file
7. Create stories file (CSF3 format, at least one "playground" story)
8. If interactive (Tier 2), create test file (Vitest + Testing Library)
9. If the component has `@layer components` classes (variants, sizes, states), create a CSS file named `{ComponentName}.css` in the same directory as the component's TSX, with variant/size/state classes under `@layer components` following the naming pattern in [ADR-0003](./adr/0003-component-styling-conventions.md), then add the corresponding `@import` to `src/app/globals.css`

### How to add a locale

1. Add the locale code to the `locales` array in `src/i18n/routing.ts`
2. Create `messages/base/{locale}.json` (strings pre-translated by template author)
3. Create `messages/custom/{locale}.json` (strings translated per project)
4. Done. The merge is handled automatically in `src/i18n/request.ts`.

### How to add a block

1. Create the block in `src/components/blocks/{BlockName}/`
2. Follow the Tier 1 file structure (types + component + stories, plus mocks if the props interface has 3+ fields or mock data is shared across stories); blocks are too complex for Tier 0
3. Compose primitives from `ui/` — do not reimplement low-level components
4. Add the block to a page component in `pages/` as a demo of its usage

### How to theme (re-brand)

1. Override primitive tokens in `src/app/globals.css` inside the `@theme` block — redeclare `--color-brand-*`, `--font-sans`, `--radius-*`, etc.
2. The semantic tokens (in `:root` / `.dark`) reference primitives via `var()`, so they automatically pick up the new values.
3. No template component files need modification. The override seam is described in [ADR-0001](./adr/0001-design-token-system.md) (Section: Project Override Seam).

### How to add a project-specific component

1. Create the directory: `src/components/project-components/{FeatureOrClientName}/{ComponentName}/`
2. Follow the same Tier 1 or Tier 2 file convention
3. The component has full access to all template primitives, blocks, and utilities
4. If the component later proves useful across 2+ projects, move it to the appropriate `ui/` or `blocks/` category

### How to add or modify a security header

**Rule:** All HTTP security headers live in `next.config.ts` `headers()`. Do not add security headers to `src/proxy.ts` — that file handles i18n routing only. See [architecture.md → Security](./architecture.md#security) for the rationale.

1. For a new non-CSP header (e.g. `Cross-Origin-Opener-Policy`): update `security/headers.ts` to include it in the array returned by `createSecurityHeaders()`. The `next.config.ts` `headers()` function picks it up automatically.
2. For a CSP change: update `security/csp.ts` (dev and prod variants). `createSecurityHeaders()` composes CSP with the rest of the headers; no other file needs touching.
3. For environment-specific behaviour (e.g. HSTS only in prod): gate the header inside `createSecurityHeaders()` using `process.env.NODE_ENV` or a similar check. Do not branch in `next.config.ts`.
4. If you find yourself reaching for `src/proxy.ts` to set a security header, stop — the rule is `next.config.ts` only. Apply that rule even if the header seems route-specific.

---

## Decision Trees

### "Should this be a Block or a Project-Component?"

```
Have I seen this pattern in 2+ client projects?
├── Yes → It belongs in blocks/ (or ui/ if it's a low-level primitive)
└── No  → It belongs in project-components/

Am I solving a general problem or a client-specific one?
├── General (any marketing site needs this) → Template component
└── Specific (only this client's site needs this) → Project component

Will this component make starting the NEXT project faster?
├── Yes → Template component
└── No  → Project component
```

### "Should I edit the template or add to project-components?"

```
Does the change add new functionality or modify existing?
├── Add new
│   ├── Reusable across projects? → Add to template
│   └── Client-specific? → project-components/
└── Modify existing
    ├── Bug fix affecting all projects? → Fix in template
    └── Visual change for one client? → Override in project-components/
```

### "Is this a base string or a custom string?"

```
Does this string need fresh translation per project?
├── Yes → It belongs in messages/custom/
│   (headlines, nav labels, footer copy, metadata, body content)
└── No → It belongs in messages/base/
    (cookie consent, 404 text, error messages, legal boilerplate)

Will a copywriter or client edit this string?
├── Yes → custom/
└── No → base/

Is this string required for the template to function (not for content)?
├── Yes → base/
└── No → custom/
```

Any "yes" to the first branch of any question gives the answer. The axis mirrors the component decision tree above: **base strings are pre-translated by the template author; custom strings are translated per project.**

---

## Testing Tiers

| Tier       | Scope                                                                                   | What's required                                                                                       |
| ---------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Tier 0** | Trivial components (Brand, ManageCookiesButton)                                          | None — single flat file. No story, no mock, no test. Verified implicitly through consumer tests.      |
| **Tier 1** | All components (UI, blocks, layout)                                                     | Storybook story (+ mock data file for complex props — see mock file rule above). Verified by `pnpm test:storybook` which runs `@storybook/test-runner` + the `@storybook/addon-a11y` panel against every story. |
| **Tier 2** | Interactive components (Button, MobileDrawer, CookieBanner, LocaleSwitcher, ToggleMode) | Tier 1 + Vitest unit test covering user interaction (click, state change, focus, keyboard). For components whose interaction is best expressed inside a story (e.g. `LocaleSwitcher`), prefer `play` functions in the story over a separate Vitest test.            |
| **Tier 3** | Utilities, lib modules, validation (cn(), env, config, events, consent storage)         | Vitest unit test                                                                                      |
| **Tier 4** | Template-wide smoke tests                                                               | Playwright: homepage renders, navigation works, locale switching, 404 page, cookie banner interaction |

---

## Quality Gates

Code quality is enforced through a five-layer gate architecture that catches defects as early as possible — from editor keystrokes through to pull request review.

The full gate architecture is documented in [`quality-gates.md`](./quality-gates.md). The layers are:

| Layer | Runs where | Enforces |
|-------|------------|----------|
| **0 — Editor** | Developer machine (passive) | Formatting, lint diagnostics |
| **1 — Pre-commit** | `pre-commit` hook | lint-staged, TypeScript check, commit message format |
| **2 — Pre-push** | `pre-push` hook | Production build, unit tests |
| **3 — CI** | GitHub Actions on push | Lint, typecheck, unit tests, build, E2E, storybook test-runner (per-component interaction + a11y), coverage |
| **4 — PR Merge** | GitHub UI | Code review, branch rules, linear history |

**Key scripts:** `pnpm build` is the non-negotiable pre-push check — a broken build never reaches the remote. `pnpm test:storybook` is the per-component interaction + a11y gate defined in Phase 1 of the implementation plan.
