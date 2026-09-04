# Marketing Starter

This is a production-grade Next.js marketing site template. It ships with pre-translated base messages and a core (Template Instance), while allowing per-project additions (Project Instance) to sit cleanly alongside it.

## Language

**Template Instance**:
Code, config, messages, and assets that ship with the starter. Certain shipped files are designated as **override seams** — the documented per-project configuration surface (e.g., `src/lib/config/site.ts`, `messages/custom/`), intended to be edited per project.

**Project Instance**:
Code, config, messages, and assets that are added or changed per-project. Client-specific additions that sit alongside the Template Instance.

**Override Seam**:
A Template Instance file that is explicitly documented as the per-project configuration surface — the place the end-user edits to configure and brand their site. Examples include `src/lib/config/site.ts` and files within `messages/custom/`.

**Base Message**:
A translation string whose translation cost is borne by the template author. Base Messages are pre-translated for all shipped locales before the project receives them, and are never extracted for re-translation per project.
_Avoid_: Template Message

**Custom Message**:
A translation string whose translation cost is borne by the project. Custom Messages are extracted and sent to the project's translators on every project for every locale.
_Avoid_: Project Message
