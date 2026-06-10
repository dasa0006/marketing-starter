# ADR-0001: Design Token System

**Status:** Accepted  
**Deciders:** Template author  
**Date:** 2026-05-28  
**Tags:** styling, tokens, tailwind, surfaces, themes

---

## Context

The marketing-starter template needs a styling system that satisfies five constraints:

1. **Surface-aware.** Every component renders on one of four background surfaces (`white`, `subtle`, `dark`, `accent`). Text, borders, icons, and interactive states must adapt automatically — no per-surface prop drilling or conditional class logic in each component.

2. **Dark mode without duplication.** The template ships a light/dark toggle. Token values must switch automatically when `class="dark"` is applied to `<html>`, without duplicating every style rule.

3. **Project-brandable without forking.** A client project needs to change colors, fonts, border radius, and spacing scale without modifying template components. The token system must provide an explicit override seam.

4. **Zero raw values in components.** Components reference only semantic tokens. No raw hex codes, no hardcoded pixel values, no ad-hoc Tailwind utility classes that leak presentation logic.

5. **Tailwind CSS v4 native.** Tailwind v4 uses a CSS-first configuration model (`@theme` in `globals.css`).

---

## Decision

We adopt a **three-layer token architecture** (primitive → semantic → component), expressed entirely in CSS custom properties defined in `globals.css` via Tailwind v4's `@theme` directive. Components consume these tokens only through Tailwind utility classes — never through raw `var()` calls in component code.

### Layer 1: Primitive Tokens

Primitive tokens are the raw design atoms. They are defined once and never change between surfaces or themes. They are named by their literal value, not their intended use.

**Location:** `src/app/globals.css` — `@theme` block

```css
@theme {
	/* ════════════════════════════════════════
     Color Primitives (core palette)
     ════════════════════════════════════════ */
	--color-white: oklch(100% 0 0);
	--color-black: oklch(0% 0 0);

	/* Neutral scale */
	--color-neutral-50: oklch(98.5% 0 0);
	--color-neutral-100: oklch(97% 0 0);
	--color-neutral-200: oklch(92% 0 0);
	--color-neutral-300: oklch(87% 0 0);
	--color-neutral-400: oklch(75% 0 0);
	--color-neutral-500: oklch(62% 0 0);
	--color-neutral-600: oklch(48% 0 0);
	--color-neutral-700: oklch(38% 0 0);
	--color-neutral-800: oklch(27% 0 0);
	--color-neutral-850: oklch(21% 0 0);
	--color-neutral-900: oklch(15% 0 0);
	--color-neutral-950: oklch(9% 0 0);

	/* Brand primaries (default placeholder values — overridden per project) */
	--color-brand-50: oklch(97% 0.015 260);
	--color-brand-100: oklch(93% 0.03 260);
	--color-brand-200: oklch(86% 0.06 260);
	--color-brand-300: oklch(78% 0.09 260);
	--color-brand-400: oklch(68% 0.12 260);
	--color-brand-500: oklch(58% 0.15 260);
	--color-brand-600: oklch(48% 0.14 260);
	--color-brand-700: oklch(38% 0.12 260);
	--color-brand-800: oklch(28% 0.1 260);
	--color-brand-900: oklch(18% 0.08 260);
	--color-brand-950: oklch(10% 0.05 260);

	/* Accent (default complementary hue — overridden per project) */
	--color-accent-50: oklch(97% 0.02 40);
	--color-accent-500: oklch(62% 0.18 40);
	--color-accent-600: oklch(52% 0.17 40);

	/* Semantic utility colors */
	--color-success: oklch(62% 0.18 145);
	--color-warning: oklch(76% 0.17 75);
	--color-error: oklch(55% 0.2 25);

	/* ════════════════════════════════════════
     Typography Primitives
     ════════════════════════════════════════ */
	--font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
	--font-mono: "Geist Mono", ui-monospace, SFMono-Regular, monospace;

	--text-xs: 0.75rem;
	--text-sm: 0.875rem;
	--text-base: 1rem;
	--text-lg: 1.125rem;
	--text-xl: 1.25rem;
	--text-2xl: 1.5rem;
	--text-3xl: 1.875rem;
	--text-4xl: 2.25rem;
	--text-5xl: 3rem;
	--text-6xl: 3.75rem;

	--leading-tight: 1.25;
	--leading-snug: 1.375;
	--leading-normal: 1.5;
	--leading-relaxed: 1.625;
	--leading-loose: 2;

	--font-weight-normal: 400;
	--font-weight-medium: 500;
	--font-weight-semibold: 600;
	--font-weight-bold: 700;

	--tracking-tight: -0.025em;
	--tracking-normal: 0em;
	--tracking-wide: 0.025em;

	/* ════════════════════════════════════════
     Spacing Primitives (4px base)
     ════════════════════════════════════════ */
	--spacing-0: 0px;
	--spacing-1: 0.25rem; /*  4px */
	--spacing-2: 0.5rem; /*  8px */
	--spacing-3: 0.75rem; /* 12px */
	--spacing-4: 1rem; /* 16px */
	--spacing-5: 1.25rem; /* 20px */
	--spacing-6: 1.5rem; /* 24px */
	--spacing-8: 2rem; /* 32px */
	--spacing-10: 2.5rem; /* 40px */
	--spacing-12: 3rem; /* 48px */
	--spacing-14: 3.5rem; /* 56px */
	--spacing-16: 4rem; /* 64px */
	--spacing-20: 5rem; /* 80px */
	--spacing-24: 6rem; /* 96px */

	/* ════════════════════════════════════════
     Border Radius Primitives
     ════════════════════════════════════════ */
	--radius-none: 0px;
	--radius-sm: 0.25rem; /*  4px */
	--radius-md: 0.375rem; /*  6px */
	--radius-lg: 0.5rem; /*  8px */
	--radius-xl: 0.75rem; /* 12px */
	--radius-2xl: 1rem; /* 16px */
	--radius-3xl: 1.5rem; /* 24px */
	--radius-full: 9999px;

	/* ════════════════════════════════════════
     Shadow Primitives
     ════════════════════════════════════════ */
	--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	--shadow-lg:
		0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	--shadow-xl:
		0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
	--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

	/* ════════════════════════════════════════
     Easing Primitives
     ════════════════════════════════════════ */
	--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
	--ease-in: cubic-bezier(0.4, 0, 1, 1);
	--ease-out: cubic-bezier(0, 0, 0.2, 1);
	--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

	/* ════════════════════════════════════════
     Duration Primitives
     ════════════════════════════════════════ */
	--duration-fast: 150ms;
	--duration-normal: 250ms;
	--duration-slow: 350ms;
}
```

**Rules for primitive tokens:**

- Named by value, never by use (`--color-brand-500`, not `--color-button-primary-bg`).
- Brand colors use a 50–950 scale consistent with Tailwind conventions.
- Supply default values that produce a working blue-branded grayscale site out of the box.
- Default brand hue is **blue** (260° on OKLCH hue wheel). Default accent is a complementary **amber** (40° on OKLCH hue wheel).
- Every primitive is overridable via `@theme` — a project simply redeclares the same token name in their override layer without touching template code.

### Layer 2: Semantic Tokens

Semantic tokens give meaning to primitives. They are the only tokens that components actually depend on. Unlike primitives, semantic tokens change value between surfaces and themes.

**Location:** `src/app/globals.css` — CSS custom properties on `:root` / `.dark`

The semantic layer is split into two groups:

#### 2a. Global Semantic Tokens (surface-independent)

These do not change between surfaces — they represent universal roles.

```css
:root {
	/* Text */
	--color-text-primary: var(--color-neutral-900);
	--color-text-secondary: var(--color-neutral-600);
	--color-text-muted: var(--color-neutral-400);

	/* Interactive */
	--color-focus-ring: var(--color-brand-500);
	--color-link: var(--color-brand-600);
	--color-link-hover: var(--color-brand-700);

	/* Borders & Dividers */
	--color-border: var(--color-neutral-200);
	--color-border-strong: var(--color-neutral-300);

	/* Surfaces */
	--color-surface-white: var(--color-white);
	--color-surface-subtle: var(--color-neutral-50);
	--color-surface-dark: var(--color-neutral-900);
	--color-surface-accent: var(--color-accent-500);

	/* Overlays */
	--color-scrim: oklch(0% 0 0 / 0.5);
}

.dark {
	/* Text */
	--color-text-primary: var(--color-white);
	--color-text-secondary: var(--color-neutral-300);
	--color-text-muted: var(--color-neutral-500);

	/* Interactive */
	--color-focus-ring: var(--color-brand-400);
	--color-link: var(--color-brand-400);
	--color-link-hover: var(--color-brand-300);

	/* Borders & Dividers */
	--color-border: var(--color-neutral-800);
	--color-border-strong: var(--color-neutral-700);

	/* Surfaces */
	--color-surface-white: var(--color-neutral-950);
	--color-surface-subtle: var(--color-neutral-900);
	--color-surface-dark: var(--color-white);
	--color-surface-accent: var(--color-accent-600);

	/* Overlays */
	--color-scrim: oklch(0% 0 0 / 0.7);
}
```

#### 2b. Surface Tokens (context-dependent)

These tokens change their meaning depending on which surface a component sits on. They are defined as CSS custom properties scoped to surface classes, not as `:root` variables.

```css
/* On white background — text is dark, accents pop */
.surface-white,
.surface-subtle {
	--on-surface-text: var(--color-text-primary);
	--on-surface-text-muted: var(--color-text-muted);
	--on-surface-link: var(--color-link);
	--on-surface-border: var(--color-border);
	--on-surface-icon: var(--color-text-secondary);
}

/* On dark background — text is light, link is lighter */
.surface-dark {
	--on-surface-text: var(--color-white);
	--on-surface-text-muted: var(--color-neutral-400);
	--on-surface-link: var(--color-brand-300);
	--on-surface-border: var(--color-neutral-700);
	--on-surface-icon: var(--color-neutral-300);
}

/* On accent background — text inherits accent contrast */
.surface-accent {
	--on-surface-text: var(--color-white);
	--on-surface-text-muted: oklch(from var(--color-white) l c h / 0.7);
	--on-surface-link: var(--color-white);
	--on-surface-border: oklch(from var(--color-white) l c h / 0.2);
	--on-surface-icon: var(--color-white);
}
```

**Surface class assignment:** The `Section` component applies these classes. The page composer passes the `surface` prop to each `Section`, which renders with the corresponding class. Primitives and Blocks inside inherit the surface context through the cascade.

### Layer 3: Component Tokens (Optional)

Component tokens are scoped to a specific component and composed from semantic tokens. They exist only when a component needs a descriptive name for a compound value that appears multiple times.

**Location:** Co-located with the component in `globals.css` or in the component's own CSS file using `@layer components`.

```css
/* Example: Button variants expressed as component tokens */
@layer components {
	.btn-primary {
		--btn-bg: var(--color-brand-500);
		--btn-text: var(--color-white);
		--btn-border: transparent;
		--btn-hover-bg: var(--color-brand-600);
		--btn-active-bg: var(--color-brand-700);
	}

	.btn-secondary {
		--btn-bg: var(--color-surface-white);
		--btn-text: var(--color-text-primary);
		--btn-border: var(--color-border-strong);
		--btn-hover-bg: var(--color-surface-subtle);
		--btn-active-bg: var(--color-neutral-100);
	}
}
```

**Rule:** Component tokens are only created when a value is referenced three or more times within a component's variant definitions. For one-off values, use semantic or primitive tokens directly via Tailwind utilities.

---

## Tailwind Integration

### CSS-first configuration

Tailwind v4 uses a single-source `@theme` directive in `globals.css`. The entire design system lives in that file. There is no `tailwind.config.js`.

```css
/* src/app/globals.css — single source of truth */
@import "tailwindcss";

@theme {
	/* ...all primitive tokens from Layer 1 above... */
}
```

After `@theme` defines the primitives, Tailwind generates utility classes automatically. The semantic tokens (Layer 2) are defined as plain CSS custom properties after the `@theme` block.

### How components use tokens

Components never reference raw `var()` or raw primitive values. They use Tailwind utility classes exclusively.

```tsx
// ✅ Correct — uses only Tailwind utility classes
<button className="bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold">
  Sign Up
</button>

// ❌ Wrong — raw var() call in component
<button style={{ backgroundColor: "var(--color-brand-600)" }}>
  Sign Up
</button>

// ❌ Wrong — hardcoded hex in component
<button className="bg-[#1d4ed8]">
  Sign Up
</button>
```

**Exception:** The `Brand` component renders the project name with an accent dot. The dot color may use `var(--color-accent-500)` directly in the JSX `style` prop if and only if exposing it as a utility class would create an unreasonable abstraction. This is the only permitted exception and is documented inline.

### Surface adaptation via the cascade

Components that need to adapt to the background surface read `--on-surface-*` tokens through Tailwind classes mapped via custom utilities:

```css
@utility text-on-surface {
	color: var(--on-surface-text);
}

@utility text-on-surface-muted {
	color: var(--on-surface-text-muted);
}

@utility border-on-surface {
	border-color: var(--on-surface-border);
}

@utility icon-on-surface {
	color: var(--on-surface-icon);
}
```

```tsx
// Block consumes surface-adaptive tokens
<h2 className="text-on-surface text-3xl font-bold">
  {heading}
</h2>
<p className="text-on-surface-muted text-lg">
  {subheading}
</p>
```

This avoids conditional rendering or prop-based styling in every block:

```tsx
// ❌ Wrong — surface branching in component logic
const textColor = surface === "dark" ? "text-white" : "text-neutral-900";
```

---

## Surface System

The four surfaces form the background palette. They are assigned by the `Section` component and inherited down the tree.

| Surface  | Light mode bg         | Dark mode bg          | Text contrast   | Use case                 |
| -------- | --------------------- | --------------------- | --------------- | ------------------------ |
| `white`  | `--color-white`       | `--color-neutral-950` | High            | Default content sections |
| `subtle` | `--color-neutral-50`  | `--color-neutral-900` | High            | Alternating sections     |
| `dark`   | `--color-neutral-900` | `--color-white`       | High (inverted) | Hero, emphasis sections  |
| `accent` | `--color-accent-500`  | `--color-accent-600`  | High (on brand) | CTAs, highlighted areas  |

**Rule:** Every surface must maintain a minimum 4.5:1 contrast ratio between its `--on-surface-text` and its background color in both light and dark modes. This is verified at token definition time, not per-component.

---

## Dark Mode Strategy

Dark mode uses Tailwind's `class` strategy (next-themes toggles `class="dark"` on `<html>`). The `.dark` selector overrides only semantic tokens — primitives remain unchanged.

```css
/* In globals.css */
:root {
	--color-text-primary: var(--color-neutral-900);
}

.dark {
	--color-text-primary: var(--color-white);
}
```

### Convention for class-based dark mode in components

Components never use Tailwind's `dark:` prefix. Instead, they rely entirely on the semantic token layer:

```tsx
// ✅ Correct — semantic token handles both themes
<p className="text-on-surface-muted">Secondary text</p>

// ❌ Wrong — dark: prefix couples component to theme mechanism
<p className="text-neutral-600 dark:text-neutral-400">Secondary text</p>
```

**Exception:** Hero images, decorative elements, and brand logos that need different assets per theme may use `dark:` for the asset swap. This is the narrow permitted case.

---

## Project Override Seam

A project customizes the design system by redeclaring tokens in `@theme`. Because `@theme` is written in `globals.css`, the project edit is a single file change:

```css
/* src/app/globals.css — project override example */

@theme {
	/* Override brand palette */
	--color-brand-50: oklch(96% 0.025 320);
	--color-brand-500: oklch(55% 0.2 320);
	--color-brand-600: oklch(45% 0.18 320);
	--color-brand-700: oklch(35% 0.15 320);

	/* Override accent */
	--color-accent-50: oklch(95% 0.04 180);
	--color-accent-500: oklch(58% 0.15 180);
	--color-accent-600: oklch(48% 0.13 180);

	/* Override font */
	--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
	--font-mono: "JetBrains Mono", ui-monospace, monospace;

	/* Override border radius */
	--radius-lg: 0.25rem;
}

/* No template files are modified. */
```

The semantic tokens (Layer 2) and component tokens (Layer 3) automatically reflect the new primitives because they reference them via `var()`.

---

## Implementation Plan

### Phase 2a: Primitive tokens in `@theme`

1. Create `src/app/globals.css` with `@import "tailwindcss"` and the `@theme` block containing all primitive tokens (color, typography, spacing, radius, shadow, easing, duration).
2. Wire fonts via `src/lib/styles/fonts.ts` (Geist Sans + Geist Mono configured via `next/font/google`).
3. Add `fontVariables` string to the `<body>` className in the root layout.

### Phase 2b: Semantic tokens and surface adaptation

1. After the `@theme` block, add `:root` and `.dark` blocks with global semantic tokens.
2. Add `.surface-white`, `.surface-subtle`, `.surface-dark`, `.surface-accent` classes with their `--on-surface-*` tokens.
3. Add the `@utility` directives for `text-on-surface`, `text-on-surface-muted`, `border-on-surface`, and `icon-on-surface`.
4. Wire the `Section` component to accept a `surface` prop and apply the corresponding class.

### Phase 2c: Component tokens (as needed)

For each component variant (Button, LinkButton, etc.), define component tokens in `globals.css` using `@layer components` when a value is referenced three or more times inside that component's variant set.

---

## Non-Goals

- No runtime CSS-in-JS. All tokens are static CSS custom properties.
- No per-component CSS modules. Token overrides are global.
- No design token export to JavaScript (no `tokens.ts` files). Components use Tailwind utility classes exclusively.
- No Figma/design-token-transformer pipeline in this template. Token values are authored directly in `globals.css`.

---

## Consequences

### Positive

- **Surface adaptation without effort.** A Block placed on `surface="dark"` automatically gets correct text colors, icon colors, and border colors through the cascade. No prop drilling, no conditional logic.
- **Dark mode for free.** Semantic tokens switch in `.dark`, and every component that uses them adapts instantly. No `dark:` prefix scattered through the codebase.
- **Single-file brand override.** A project's visual identity fits in one change to `globals.css`. Template files are never forked.
- **Auditable token usage.** Searching for `var(--color-` outside of `globals.css` or component CSS files catches violations. The rule is machine-enforceable via ESLint.
- **Tailwind v4 alignment.** The `@theme` approach is Tailwind v4's intended configuration model. No fighting the framework.

### Negative

- **No compile-time token safety.** Unlike a TypeScript token object, CSS custom properties are strings. A misspelled `var(--color-brad-500)` is a runtime silent failure, not a compile error. Mitigation: keep an authoritative token list in `globals.css` and consider a `test:token-integrity` script that renders each token to ensure it resolves.
- **Cascade debugging cost.** A component's final color value depends on three layers of inheritance (`:root` ← `.dark` ← `.surface-{name}`). Debugging requires inspecting the computed styles panel. Mitigation: keep the layers documented here and in `globals.css` block comments.

### Risks

- **Surface token explosion.** If a future component needs a non-standard surface that is not one of the four defined surfaces, the author may be tempted to add a fifth surface class. Mitigation: the four-surface set is intentionally small. A fifth surface represents a genuine gap in the domain model, not a styling preference. Any addition must be approved as an ADR.
- **Token duplication in dark mode.** The `.dark` block must override every global semantic token. If a new semantic token is added to `:root` but forgotten in `.dark`, dark mode will silently use the light-mode value. Mitigation: add a `test:dark-mode-completeness` check in CI that verifies every `:root` custom property has a matching `.dark` override.

---

## Related Decisions

| Decision                                 | Relationship                                                            |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| Surface colors in Section component      | Section applies `.surface-{name}` class                                 |
| Variant/size class naming in globals.css | Button variants (`.btn-primary`, `.btn-secondary`) use component tokens |
| next-themes with `class` strategy        | Toggles `.dark` on `<html>`, which triggers semantic token overrides    |
| Font loading via `next/font/google`      | Provides `--font-sans` and `--font-mono` variables used in `@theme`     |

---

## Related Documents

- `docs/architecture.md` — Provider chain, dark mode integration
- `docs/implementation.md` — Phase 2 timeline
- `docs/contributing.md` — Component conventions, CSS rules
