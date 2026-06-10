# ADR-0003: Component Styling Conventions

**Status:** Accepted  
**Deciders:** Template author  
**Date:** 2026-05-29  
**Tags:** styling, components, variants, surfaces, composition

---

## Context

The design token system (ADR-0001) defines the raw materials — colors, typography, spacing, shadows, easing — but does not prescribe _how_ components should consume them. Without explicit styling conventions, each component author invents their own pattern for variants, sizes, states, surface adaptation, and class organization. This leads to:

- Inconsistent class naming between components (`primary` vs `default` vs `solid`)
- Duplicated surface-adaptation logic across every block
- Scattered variant definitions in `globals.css` with no organizational scheme
- Mix of component-level tokens and direct utility classes with no clear boundary

The template ships 20+ components across four categories (primitives, blocks, layout, pages). Without conventions, visual consistency degrades as the component count grows.

---

## Decision

We adopt four styling conventions that govern how every component in the template is styled. These conventions apply equally to Template Components and Project Components.

---

## Convention 1: Variant/Size State Pattern

Every interactive or presentational component with multiple visual forms follows a three-axis pattern:

```
Component =
  variants:  the visual "personality" (primary, secondary, accent, ghost, transparent)
  sizes:     the physical dimensions (sm, md, lg)
  states:    the interaction mode (default, hover, active, disabled, focus-visible)
```

### Definition location

**Utility classes** (`.btn-primary`, `.btn-sm`, `.btn-loading`) are defined in a co-located CSS file next to the component's TSX (e.g., `Button.css`) using `@layer components`. A component gets a CSS file only if it defines `@layer components` classes — components built purely from Tailwind utilities have no CSS file. They are **never** defined in the top-level `globals.css` or in a centralized `src/styles/components/` directory.

```css
/* src/components/ui/button/Button.css */
@layer components {
	/* ── Button variants ── */
	.btn-primary {
		background-color: var(--color-brand-500);
		color: var(--color-white);
	}
	.btn-primary:hover {
		background-color: var(--color-brand-600);
	}
	.btn-primary:active {
		background-color: var(--color-brand-700);
	}

	.btn-secondary {
		background-color: var(--color-surface-white);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border-strong);
	}
	.btn-secondary:hover {
		background-color: var(--color-surface-subtle);
	}

	.btn-accent {
		background-color: var(--color-accent-500);
		color: var(--color-white);
	}
	.btn-accent:hover {
		background-color: var(--color-accent-600);
	}

	.btn-ghost {
		background-color: transparent;
		color: var(--color-text-primary);
	}
	.btn-ghost:hover {
		background-color: var(--color-surface-subtle);
	}

	.btn-transparent {
		background-color: transparent;
		color: var(--color-on-surface-text);
		/* adapts to surface via inherit */
	}
	.btn-transparent:hover {
		opacity: 0.8;
	}

	/* ── Button sizes ── */
	.btn-sm {
		padding: var(--spacing-2) var(--spacing-3);
		font-size: var(--text-sm);
		border-radius: var(--radius-md);
	}
	.btn-md {
		padding: var(--spacing-3) var(--spacing-5);
		font-size: var(--text-base);
		border-radius: var(--radius-lg);
	}
	.btn-lg {
		padding: var(--spacing-4) var(--spacing-6);
		font-size: var(--text-lg);
		border-radius: var(--radius-lg);
	}

	/* ── Button states ── */
	.btn-loading {
		pointer-events: none;
		opacity: 0.7;
	}
	.btn-disabled {
		pointer-events: none;
		opacity: 0.4;
	}
}
```

### Component assembly

The component applies these classes and composes them with component-specific structural classes:

```tsx
function Button({
	variant = "primary",
	size = "md",
	loading,
	disabled,
	children,
}: ButtonProps) {
	return (
		<button
			className={cn(
				"btn-primary", // variant class
				"btn-md", // size class
				loading && "btn-loading",
				disabled && "btn-disabled",
				"inline-flex items-center justify-center gap-2 font-medium transition-all duration-fast",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
			)}
			disabled={disabled || loading}
		>
			{loading && <Spinner className="icon-on-surface" />}
			{children}
		</button>
	);
}
```

**Class organization order** (every component follows this order):

1. Variant class (`btn-primary`)
2. Size class (`btn-md`)
3. State modifier classes (`btn-loading`, `btn-disabled`)
4. Structural Tailwind utilities (layout, flex, typography overrides)
5. Focus-visible ring

### Naming conventions

| Category | Pattern                        | Examples                         |
| -------- | ------------------------------ | -------------------------------- |
| Variant  | `.{component-tag}-{variant}`   | `.btn-primary`, `.btn-ghost`     |
| Size     | `.{component-tag}-{size}`      | `.btn-sm`, `.btn-lg`             |
| State    | `.{component-tag}-{state}`     | `.btn-loading`, `.btn-disabled`  |
| Modifier | `.{component-tag}--{modifier}` | `.heading--large`, `.text--lead` |

**Component tag** is a short, unique prefix: `btn` for Button, `heading` for Heading, `text` for Text, `feature-card` for the internal card in FeatureGrid, `hero` for Hero, `cta` for CTA.

---

## Convention 2: Surface Adaptation via Context

Components do not adapt to surfaces on their own. They inherit surface context from the nearest `.surface-*` ancestor and read `--on-surface-*` tokens via the `@utility` directives defined in the token system.

### Block-level adaptation

Blocks (Hero, FeatureGrid, CTA, TextBlock) receive surface awareness through two approaches:

**Approach A: Inherited via cascade (primary)**

The Block uses only `text-on-surface`, `text-on-surface-muted`, `border-on-surface`, and `icon-on-surface` utilities. The surface context is provided by the enclosing `Section` component through the CSS cascade on `.surface-*` classes.

```tsx
// Hero.tsx — no surface detection
function Hero({ heading, subheading }: HeroProps) {
	return (
		<div className="flex flex-col items-center text-center gap-6">
			<h1 className="text-on-surface text-4xl font-bold">{heading}</h1>
			<p className="text-on-surface-muted text-lg max-w-2xl">{subheading}</p>
		</div>
	);
}
```

**Approach B: Layout variant props (for surface-driven layout changes)**

When a Block needs different layout or visual treatment depending on the surface it sits on (e.g., the Hero aligns left on `white` but centers on `dark`), the Block exposes a layout variant prop. The page composer (e.g., `Index.tsx`) sets the prop based on the surface, keeping the dependency explicit at the composition boundary.

```tsx
// Hero.tsx — layout variant prop, no surface detection
function Hero({ heading, subheading, layout = "left-aligned" }: HeroProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-6",
				layout === "centered" && "items-center text-center",
				layout === "left-aligned" && "items-start text-left",
			)}
		>
			<h1 className="text-on-surface text-4xl font-bold">{heading}</h1>
			<p className="text-on-surface-muted text-lg max-w-2xl">{subheading}</p>
		</div>
	);
}
```

```tsx
// Index.tsx — page composer owns the surface-to-layout mapping
return (
	<>
		<Section key="hero" surface="dark" size="xl">
			<Hero {...heroProps} layout="centered" />
		</Section>
		<Section key="features" surface="white" size="lg">
			<Hero {...heroProps} layout="left-aligned" />
		</Section>
	</>
);
```

**Why prop-based over attribute-based:** A prop makes the dependency explicit and keeps the Block self-documenting — `Hero` always works the same regardless of how deeply it is nested. A `data-surface` CSS selector creates a hidden control flow dependency: the Block's visual output depends on an ancestor's HTML attribute, making it impossible to understand the Block in isolation. Exposing layout as a prop moves the decision to the composition boundary (the page component), which already knows both the Block props and the surface.

**Constraint:** The `data-surface` attribute on `Section` is a Section-only implementation detail. No Block ever reads `data-surface` in its CSS or JavaScript. Surface-driven layout variation is expressed through explicit Block props, never through ancestor attribute selectors.

### Primitive-level adaptation

Primitives (Button, Heading, Text, LinkButton) do not read surface context at all. They render with their own semantic styling. Surface adaptation for primitives is handled by the consumer (the Block or page):

- A Button on a `dark` surface uses `variant="transparent"` (which inherits the `--on-surface-text` color).
- A Button on `white` surface uses `variant="primary"`.
- The Block owns this choice, not the Button.

---

## Convention 3: CSS File Organization

Component styling classes are **not** in a single `globals.css`. Instead, each component's styles are co-located in a CSS file alongside its TSX, with `globals.css` acting as a thin orchestrator that:
- Defines **primitive tokens** (design atoms) in its `@theme` block (see ADR-0001 Layer 1)
- Imports semantic token files (`tokens.css`, `utilities.css`, `base.css`) and every component CSS file in cascade order

### Co-location rule

A component gets a co-located CSS file if and only if it defines `@layer components` classes (variants, sizes, states). Components built purely from Tailwind utility classes do not get a CSS file. The rule is category-agnostic — it applies uniformly to all four architectural categories (ui, blocks, layout, pages) and to both Template-Components and Project-Components.

### File structure

```
src/
├── styles/
│   ├── tokens.css              ← :root, .dark, surface contexts (semantic tokens)
│   ├── utilities.css           ← @utility definitions
│   └── base.css                ← @layer base (resets, body, etc.)
└── components/
    ├── ui/
    │   ├── button/
    │   │   ├── Button.tsx
    │   │   └── Button.css      ← All .btn-* classes
    │   ├── heading/
    │   │   ├── Heading.tsx
    │   │   └── Heading.css     ← All .heading-* classes
    │   └── text/
    │       ├── Text.tsx
    │       └── Text.css        ← All .text-* classes
    ├── blocks/
    │   ├── hero/
    │   │   ├── Hero.tsx
    │   │   └── Hero.css        ← All .hero-* classes + layout overrides
    │   ├── cta/
    │   │   ├── CTA.tsx
    │   │   └── CTA.css         ← All .cta-* classes
    │   └── feature-grid/
    │       └── feature-card/
    │           ├── FeatureCard.tsx
    │           └── FeatureCard.css  ← All .feature-card-* classes
    ├── layout/
    │   └── section/
    │       ├── Section.tsx
    │       └── Section.css     ← All .section-* classes
    └── pages/
        └── index/
            └── Index.tsx       ← No CSS file — pure orchestration
```

### globals.css — orchestrator

The only file at `src/app/globals.css` holds the `@theme` block (primitive tokens) and imports each style file in cascade order:

```css
/* src/app/globals.css — thin orchestrator */
@import "tailwindcss";

@theme {
	/* Primitive tokens — see ADR-0001 Layer 1 for the full set
	   color, typography, spacing, radius, shadow, easing, duration */
	--color-white: oklch(100% 0 0);
	--color-black: oklch(0% 0 0);
	/* ... */
}

@import "../styles/tokens.css";
@import "../styles/utilities.css";
@import "../styles/base.css";

/* ── Primitives ── */
@import "../components/ui/button/Button.css";
@import "../components/ui/heading/Heading.css";
@import "../components/ui/text/Text.css";

/* ── Blocks ── */
@import "../components/blocks/hero/Hero.css";
@import "../components/blocks/cta/CTA.css";
@import "../components/blocks/feature-grid/feature-card/FeatureCard.css";

/* ── Layout ── */
@import "../components/layout/section/Section.css";
```

### tokens.css — :root, .dark, surface contexts (semantic tokens)

Primitive tokens (`@theme`) live in `globals.css` (see ADR-0001). This file defines only the semantic token layer:

```css
/* Semantic tokens */
:root {
	/* ...global semantic tokens... */
}
.dark {
	/* ...dark mode overrides... */
}

/* Surface context */
.surface-white { /* ... */ }
.surface-subtle { /* ... */ }
.surface-dark { /* ... */ }
.surface-accent { /* ... */ }
```

### utilities.css — @utility definitions

```css
/* ════════════════════════════════════════
   Surface utilities
   ════════════════════════════════════════ */
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

### base.css — base HTML resets & defaults

```css
/* ════════════════════════════════════════
   Base HTML resets & defaults
   ════════════════════════════════════════ */
@layer base {
	html { /* ... */ }
	body { /* ... */ }
}
```

### Component CSS files — @layer components

Each component wraps its co-located CSS rules in `@layer components`:

```css
/* src/components/ui/button/Button.css */
@layer components {
	/* ── Button variants ── */
	.btn-primary {
		background-color: var(--color-brand-500);
		color: var(--color-white);
	}
	.btn-primary:hover {
		background-color: var(--color-brand-600);
	}
	.btn-primary:active {
		background-color: var(--color-brand-700);
	}
	.btn-secondary {
		background-color: var(--color-surface-white);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border-strong);
	}
	.btn-secondary:hover {
		background-color: var(--color-surface-subtle);
	}
	/* ...more variants... */

	/* ── Button sizes ── */
	.btn-sm {
		padding: var(--spacing-2) var(--spacing-3);
		font-size: var(--text-sm);
		border-radius: var(--radius-md);
	}
	.btn-md {
		padding: var(--spacing-3) var(--spacing-5);
		font-size: var(--text-base);
		border-radius: var(--radius-lg);
	}
	.btn-lg {
		padding: var(--spacing-4) var(--spacing-6);
		font-size: var(--text-lg);
		border-radius: var(--radius-lg);
	}

	/* ── Button states ── */
	.btn-loading {
		pointer-events: none;
		opacity: 0.7;
	}
	.btn-disabled {
		pointer-events: none;
		opacity: 0.4;
	}
}
```

```css
/* src/components/blocks/hero/Hero.css */
@layer components {
	/* ── Hero layout variants ── */
	.hero--centered {
		text-align: center;
	}

	.hero--left-aligned {
		text-align: left;
	}
}
```

**Rules:**

- A component CSS file exists only when the component defines `@layer components` classes (variants, sizes, states). No empty files, no placeholders.
- File names match the component TSX name in PascalCase: `Button.css`, `Section.css`, `Hero.css`, `FeatureCard.css`. This creates three-way symmetry between the directory name, TSX filename, and CSS filename.
- Classes for the same component are grouped together within that file — never split across files.
- No empty sections, no commented-out classes.
- The `globals.css` orchestrator never defines component classes directly — it only imports.
- There is no `src/styles/components/` directory. The three files in `src/styles/` (`tokens.css`, `utilities.css`, `base.css`) hold semantic tokens, utilities, and base resets respectively. Primitive tokens live in `globals.css`'s `@theme` block (see ADR-0001).

---

## Convention 4: Styling What You Own

A component only defines styles for its own root and its direct named children. It does not reach into nested components to restyle them.

```tsx
// ✅ Correct — FeatureGrid styles its own grid container and passes props
function FeatureGrid({ features, columns = 3 }: FeatureGridProps) {
	return (
		<section className="feature-grid">
			<div className={cn("grid gap-8", `grid-cols-1 md:grid-cols-${columns}`)}>
				{features.map((f) => (
					<FeatureCard key={f.title} {...f} />
				))}
			</div>
		</section>
	);
}

// ✅ Correct — FeatureCard styles its own internals
function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<article className="feature-card p-6 rounded-xl border-on-surface surface-white">
			<div className="icon-wrapper mb-4">{icon}</div>
			<h3 className="text-on-surface text-xl font-semibold">{title}</h3>
			<p className="text-on-surface-muted mt-2">{description}</p>
		</article>
	);
}
```

A component wanting to style a child component uses the child's public props (variant, size, className), not descendant selectors:

```tsx
// ✅ Correct — uses child's public API
<Button variant="primary" size="md" />

// ❌ Wrong — reaching into child
// .hero .btn { background-color: red; }

// ❌ Wrong — component-imposed override via className passthrough
<Button className="hero-specific-btn" />
```

**Exception:** The `children` prop of `Section` is a raw `ReactNode` — it cannot be styled via props. This is acceptable because `Section` is intentionally a thin background wrapper, not a styling boundary. Block content carries its own surface adaptation through the cascade.

---

## Typography Scale

The Heading and Text primitives use a shared type scale defined in primitives, mapped to named roles:

| Role     | Component | Size token  | Weight        | Line height | Use                                |
| -------- | --------- | ----------- | ------------- | ----------- | ---------------------------------- |
| Display  | Heading   | `text-5xl`  | Bold          | `tight`     | Hero headline (desktop)            |
| Headline | Heading   | `text-4xl`  | Bold          | `tight`     | Section headings (h1/h2)           |
| Title    | Heading   | `text-3xl`  | Semibold      | `snug`      | Card titles, subheadings (h3)      |
| Subtitle | Heading   | `text-2xl`  | Semibold      | `snug`      | Block subheadings (h4)             |
| Lead     | Text      | `text-lg`   | Normal        | `relaxed`   | Hero subheadline, intro paragraphs |
| Body     | Text      | `text-base` | Normal        | `normal`    | Default copy                       |
| Small    | Text      | `text-sm`   | Normal        | `normal`    | Captions, metadata, footnotes      |
| Muted    | Text      | `text-base` | Muted variant | `normal`    | Secondary body copy                |

### Heading level mapping

The `Heading` component accepts a polymorphic `as` prop (`h1`–`h4`). The visual size is decoupled from the semantic level:

```tsx
// Semantic h1, visually size `h1` (default mapping)
<Heading as="h1">Page title</Heading>

// Semantic h2, visually same as h1 (for hero headings inside sections)
<Heading as="h2" size="h1">Section headline</Heading>
```

**Default size map:**

| `as` value | Default visual size           |
| ---------- | ----------------------------- |
| `h1`       | `text-4xl` → `text-5xl` (md+) |
| `h2`       | `text-3xl` → `text-4xl` (md+) |
| `h3`       | `text-2xl` → `text-3xl` (md+) |
| `h4`       | `text-xl` → `text-2xl` (md+)  |

Each heading also supports an explicit `size` override ("h1"–"h4") that decouples semantics from visual weight — necessary for SEO-correct hierarchy with hero-level visual display.

---

## Spacing and Rhythm

### Section spacing

The `Section` component defines the vertical rhythm between page sections using four size tiers:

```css
.section-sm {
	padding-block: var(--spacing-8);
} /*  32px */
.section-md {
	padding-block: var(--spacing-16);
} /*  64px */
.section-lg {
	padding-block: var(--spacing-24);
} /*  96px */
.section-xl {
	padding-block: var(--spacing-32);
} /* 128px */
```

**Rule:** Adjacent sections with the same surface merge visually via the shared background. When surfaces alternate, the padding isolates each section. No margin collapsing is relied upon — padding is the exclusive spacing mechanism.

### Component internal spacing

Every component uses the spacing primitive scale. Common patterns:

| Pattern             | Token         | Value |
| ------------------- | ------------- | ----- |
| Card padding        | `--spacing-6` | 24px  |
| Card gap (vertical) | `gap-6`       | 24px  |
| Grid gap            | `gap-8`       | 32px  |
| Stack (small)       | `gap-4`       | 16px  |
| Stack (large)       | `gap-6`       | 24px  |
| Inline icon gap     | `gap-2`       | 8px   |

**Rule:** Use `gap` on flex/grid containers rather than margin on children. This avoids margin collapsing surprises and ensures consistent spacing regardless of child visibility.

---

## Icon System

### Source

All icons use **Lucide** via `lucide-react`. Lucide provides:

- Consistent 1.5px stroke width
- 1,000+ icons covering marketing site needs
- Tree-shakable ESM imports
- No third-party CSS or font loading

### Sizing

Icons are sized using the typography scale to align with adjacent text:

```tsx
// Inline with body text — 16px
<Icon className="size-4" />

// Inline with heading — 24px
<Icon className="size-6" />

// Decorative/hero — 32px
<Icon className="size-8" />
```

### Integration pattern

```tsx
import { CheckCircle } from "lucide-react";

function FeatureCard({ icon: Icon, title }: FeatureCardProps) {
	return (
		<div className="flex gap-3">
			<Icon className="size-5 icon-on-surface shrink-0 mt-0.5" />
			<div>
				<h3 className="text-on-surface font-semibold">{title}</h3>
			</div>
		</div>
	);
}
```

**Rules:**

- Icons use `icon-on-surface` utility for color — they adapt to the current surface.
- Icons use `size-*` from the spacing/typography scale, never arbitrary values.
- Icons are passed as components (the Lucide import), not as string names.
- Icons are positioned using `flex` alignment with the adjacent text, not `absolute` positioning.

---

## Animation and Motion

### Token-based

Duration and easing primitives from ADR-0001 are the only values used in transitions:

```tsx
// In component className
"transition-all duration-fast ease-out";
"transition-opacity duration-normal ease-default";
"transition-transform duration-slow ease-spring";
```

### Entry animations

Blocks may animate on scroll using IntersectionObserver (not a library). The pattern:

```tsx
// In a Block
<div
  className={cn(
    "opacity-0 translate-y-4 transition-all duration-normal ease-out",
    isVisible && "opacity-100 translate-y-0",
  )}
>
```

**Rule:** Entry animations are optional per block and must respect `prefers-reduced-motion`. The `isVisible` pattern is never applied to more than the block's root container — never to individual children.

### Button press

All interactive primitives include a press animation:

```css
.btn-primary {
	transition: all var(--duration-fast) var(--ease-default);
}
.btn-primary:active {
	transform: scale(0.97);
}
```

---

## Documentation for Component Authors

Every new component must document its styling decisions in a block comment at the top of the component file:

```tsx
/**
 * Styling conventions for this component:
 *
 * Variants:    primary (default), secondary, ghost
 * Sizes:       md (default), sm, lg
 * Surface:     Adapts via --on-surface-* tokens
 * States:      hover, active, focus-visible, disabled
 * Animation:   Press scale 0.97 on active
 * Dependencies: none
 */
```

This comment serves as the design contract for the component. It is the first thing a future author or AI reads before modifying styles.

---

## Non-Goals

- No CSS modules or CSS-in-JS. Everything is Tailwind utility classes + `@layer components` in co-located CSS files alongside the component's TSX.
- No `styled-components`, `emotion`, or runtime style injection.
- No centralized `src/styles/components/` directory. Component CSS is co-located with the component TSX — not split by category into a separate directory.
- No `data-*` attributes used as styling hooks. The `data-surface` attribute on `Section` is a Section-only implementation detail and must not be queried by Block CSS or JavaScript.
- No `dark:` prefix usage in component utility classes (handled by token system).

---

## Consequences

### Positive

- **Component self-containment.** Every file that belongs to a component lives in its directory — TSX, types, tests, stories, mocks, and CSS. Understanding, adding, moving, or deleting a component means operating on a single directory without editing unrelated files.
- **Predictable class naming.** Every component follows the `{tag}-{variant}` / `{tag}-{size}` / `{tag}-{state}` pattern. If you know one component, you know all of them.
- **Surface adaptation without hidden dependencies.** Color tokens adapt via CSS cascade (no per-block logic). Layout variation is expressed through explicit Block props, making the dependency visible at the composition boundary rather than hidden in ancestor attribute selectors.
- **Component boundary enforcement.** The "style what you own" rule prevents the tangled CSS that plagues marketing sites built without conventions.
- **Single visible manifest.** The `globals.css` import list enumerates every component CSS file in the project — you can see all of them in one place, organized by architectural category.

### Negative

- **Growing import list in globals.css.** Every component with `@layer components` classes adds an `@import` line to `globals.css`. With 15+ components this remains manageable, but it is one more line per component than a hypothetical auto-loading approach.
- **Path depth in imports.** Co-located CSS lives at paths like `../components/blocks/feature-grid/feature-card/FeatureCard.css` rather than the flatter `../styles/components/feature-card.css` of a centralized approach. The full path is more descriptive but also longer.
- **No single `src/styles/components/` to grep.** A developer looking for "all component CSS at once" cannot open a single directory — they must rely on `globals.css` as the import manifest. Mitigated by the manifest being the canonical source of truth.

### Risks

- **Styling drift.** A component author may add inline styles or ad-hoc classes that bypass the convention system. Mitigation: an ESLint rule `no-inline-styles` (error on `style` prop) and a custom rule enforcing the `{tag}-{variant}` pattern for class names containing component variant selectors.

---

## Related Documents

- `docs/adr/0001-design-token-system.md` — Token architecture (primitives, semantic, component tokens)
- `docs/contributing.md` — Component file structure tiers, import conventions
- `docs/implementation.md` — Phase 2 (styling foundation), Phase 6 (UI primitives)
