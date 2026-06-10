# Marketing Starter

This is a production-grade Next.js marketing site template with a composable architecture of Primitives, Blocks, Layouts, and Surfaces. It ships with pre-translated base messages and an immutable core (Template Instance), while allowing per-project additions (Project Instance) to sit cleanly alongside it.

## Language

**Primitive**:
A low-level, single-purpose presentational component with no business meaning.

**Block**:
A page-level content composer that composes primitives into a reusable marketing pattern.
_Avoid_: Section, Page Section

**Layout**:
A structural shell component responsible for page chrome and positioning.

**Surface**:
The background color context a Section or Block sits on. One of `"white"`, `"subtle"`, `"dark"`, or `"accent"`.

**Page**:
A route that composes Layout and Blocks into a complete page.

**Section**:
A narrow wrapper around Blocks providing background Surface and vertical spacing. Not to be confused with the generic concept of a "page section."
_Avoid_: Block, Page Section

**Template Instance**:
Code, config, messages, and assets that ship with the starter and form the template's immutable core. Template component code must never be modified per-project. However, certain files shipped with the template are designated as **override seams** — configuration files, token files, and message files that are explicitly documented as per-project configuration (e.g., `src/lib/config/site.ts`, `src/app/globals.css` token overrides, `messages/custom/`). These are part of the template's API surface, not its implementation internals, and are intended to be edited per-project. All other template code is immutable.

**Project Instance**:
Code, config, messages, and assets that are added or changed per-project. Client-specific additions that sit alongside the Template Instance.

**Override Seam**:
A Template Instance file that is explicitly documented as per-project configuration and intended to be modified per-project. Override seams are part of the template's API surface, not its implementation internals. Examples include `src/lib/config/site.ts`, `src/app/globals.css` token overrides, and files within `messages/custom/`. All other template code remains immutable.

**Template-Component**:
A component that belongs to the Template Instance. Ships with the starter because it solves a repeating pattern across projects.

**Project-Component**:
A component that belongs to the Project Instance. Client-specific additions that sit alongside Template Components.

**Base Message**:
A translation string whose translation cost is borne by the template author. Base Messages are pre-translated for all shipped locales before the project receives them, and are never extracted for re-translation per project.
_Avoid_: Template Message

**Custom Message**:
A translation string whose translation cost is borne by the project. Custom Messages are extracted and sent to the project's translators on every project for every locale.
_Avoid_: Project Message

**Component CSS**:
A CSS file co-located in the same directory as its component's TSX file, present only when the component defines `@layer components` classes (variants, sizes, states). Not every component has a Component CSS file — components built purely from Tailwind utility classes do not. Component CSS files use PascalCase filenames matching their component (e.g., `Section.tsx` → `Section.css`). All Component CSS files are imported explicitly by `globals.css`. This applies uniformly to Template-Components and Project-Components across all architectural categories (ui, blocks, layout, pages).
