# ADR-0002: Event Tracking System

**Status:** Accepted
**Deciders:** Template author
**Date:** 2026-05-28
**Updated:** 2026-09-04 — revised after the template's component layer (UI primitives, blocks, layout shell, cookie banner) was removed. The event system ships as a typed dispatch library plus the `useButtonTracking` hook; project-owned components wire it in.
**Tags:** events, analytics, consent, hooks

---

## Context

Every marketing project needs to track user interactions and page activity, and each project has a different analytics vendor. Without a shared approach, each project wires its own solution — coupling components to vendor SDKs, scattering `data-*` attributes, and re-litigating consent-gating.

The template ships the cross-project part of that problem: a typed, consent-gated event dispatch layer and an analytics hook. The visual layer (components that call it) is added per project.

Key constraints:

- **Vendor-agnostic** — no analytics SDK ships in the template. The project chooses GA4, PostHog, Segment, or any other provider at startup.
- **Consent-gated by default** — events must not reach any adapter until the user has granted consent. Pre-consent events are silently dropped; denied consent also drops them.
- **Typed** — every event has a name and shape known to TypeScript. No stringly-typed payloads.
- **Template Instance / Project Instance boundary preserved** — the template owns event definitions and dispatch. The project owns the adapter wiring and the components that fire events.

---

## Decision

We implement a module-level adapter pattern with four pieces:

1. **Consent gating** — consent state is read synchronously from the existing storage seam (`lib/consent/storage.ts`); `ConsentProvider` provides reactive state via React context for consumer re-renders.
2. **Event catalog + dispatch** (`lib/events.ts`) — typed discriminated union, generic `track.event()` method, `configureTracking()` entry point.
3. **Hook** (`hooks/useButtonTracking.ts`) — wraps an `onClick` with a `button_click` event before invoking the original handler.
4. **Project wiring** — the project calls `configureTracking()` once at module scope (root layout) and fires events from its own components.

### Consent Gating

The storage seam (`lib/consent/storage.ts`) is the single source of truth for consent state:

```ts
type ConsentStatus = "undecided" | "accepted" | "declined";
interface ConsentStorage {
  getConsent(): ConsentStatus;
  setConsent(status: ConsentStatus): void;
  clearConsent(): void;
}
```

The `ConsentProvider` wraps this storage seam in React context, exposing `status`, `accept()`, `decline()`, and `reset()` to consumer components. When the user acts (via a project-owned consent UI), the provider calls `storage.setConsent()` and updates its internal React state to trigger re-renders.

The event dispatch layer reads consent status **synchronously** from the storage seam on every event dispatch — a sub-millisecond cookie read. No subscription, no bridging, no second module to keep in sync.

**Dispatch rules by consent status:**

| Consent status | Action                                       |
| -------------- | -------------------------------------------- |
| `"undecided"`  | Drop silently. No event reaches the adapter. |
| `"accepted"`   | Forward to adapter immediately.              |
| `"declined"`   | Drop silently. No event reaches the adapter. |

This consolidation eliminates:

- A separate `lib/consent.ts` module with a duplicated state type and different enum values (`"pending"`/`"granted"`/`"denied"` vs. `"undecided"`/`"accepted"`/`"declined"`)
- Bridging logic that must call both modules on every user action
- The risk of one module falling out of sync with the other (e.g., storage write succeeds but notification fails, causing silent event loss)

### Event Catalog

Every event is a member of a typed discriminated union. Each carries `timestamp` and `metadata` (path, locale) auto-attached by dispatch:

```ts
type TypedEvent = BaseFields &
  (
    | { name: "link_click"; url: string; label: string; newTab: boolean }
    | { name: "menu_open"; menu: "mobile" | "desktop" }
    | { name: "menu_close"; menu: "mobile" | "desktop" }
    | { name: "button_click"; label: string; variant: string }
    | { name: "page_view"; path: string; referrer?: string }
    | { name: "section_view"; section: string }
    | { name: "section_exit"; section: string }
    | { name: "scroll_depth_25"; depth: 25 }
    | { name: "scroll_depth_50"; depth: 50 }
    | { name: "scroll_depth_75"; depth: 75 }
    | { name: "scroll_depth_100"; depth: 100 }
    | { name: "time_on_page_30s" }
    | { name: "time_on_page_60s" }
    | { name: "consent_granted"; categories: string[] }
    | { name: "consent_updated"; categories: string[] }
    | { name: "consent_withdrawn" }
  );
```

Six event families:

| Family      | Events                                                    |
| ----------- | --------------------------------------------------------- |
| navigation  | `link_click`, `menu_open`, `menu_close`                   |
| interaction | `button_click`                                            |
| page        | `page_view`, `section_view`, `section_exit`               |
| scroll      | `scroll_depth_25/50/75/100`                               |
| engagement  | `time_on_page_30s`, `time_on_page_60s`                    |
| consent     | `consent_granted`, `consent_updated`, `consent_withdrawn` |

The union is the catalog. Template code does not fire these today — the project's components do, via `track.event()`.

### Type Utilities

A generic `ExtractPayload` type extracts the event-specific payload (all fields except `name` and `BaseFields`) from any member of the discriminated union:

```ts
type ExtractPayload<
  U extends { name: string },
  N extends U["name"],
> = U extends { name: N } ? Omit<U, "name" | keyof BaseFields> : never;
```

This enables a single generic `track.event()` method whose payload type is inferred from the event name:

```ts
// payload type is { url: string; label: string; newTab: boolean }
track.event("link_click", { url, label, newTab });

// payload type is { menu: "mobile" | "desktop" }
track.event("menu_open", { menu: "mobile" });

// payload type is {} — second argument omitted or empty
track.event("time_on_page_30s");
```

### API Surface

The `track` object exposes a single generic method:

```ts
import { track } from "@/lib/events";

track.event("link_click", {
  url: "/pricing",
  label: "Pricing CTA",
  newTab: false,
});
track.event("button_click", { label: "Get Started", variant: "primary" });
track.event("page_view", { path: "/about", referrer: "https://example.com" });
track.event("time_on_page_30s");
track.event("consent_granted", { categories: ["analytics"] });
```

Each call constructs the event, attaches `timestamp` and `metadata`, then calls `dispatch()`.

**Design rationale.** A single generic method replaces 12+ named helpers (`track.linkClick()`, `track.menuOpen()`, etc.). The tradeoff is weighed in [Consequences](#consequences) below.

### Adapter & Dispatch

**Adapter shape:**

```ts
type TrackingAdapter = (event: TypedEvent) => void;
```

Single-method. Receives a fully-constructed event with timestamp and metadata already attached.

**`configureTracking()`:**

```ts
function configureTracking(adapter: TrackingAdapter): void;
```

Called once by the project at module scope in the root layout. Registers the adapter.

Dispatch reads consent status synchronously from the storage seam on every event (see [Consent Gating](#consent-gating)); when consent is `"accepted"`, the event is forwarded to the adapter.

### Hook

`useButtonTracking(label, variant, onClick?)` fires `button_click` before calling the original `onClick`. It ships for project-owned buttons to opt into tracking:

```ts
const handleClick = useButtonTracking(() => { ... }, "primary-cta", "primary");
```

Originally the ADR planned dedicated hooks for page views, scroll depth, time-on-page, and section visibility, plus template-owned components (header, section, buttons) that consumed them. Those consumers were removed with the template's component layer, so only the generic dispatch path and `useButtonTracking` ship.

### Non-Goals

- No analytics provider code ships in the template.
- No event storage/persistence on the template side.
- No server-side event tracking (template has no backend).
- No template-owned components fire events — firing is the project's responsibility.
- No form events, user identity tracking, event replay, or retry.

---

## Consequences

### Positive

- **Vendor lock-in avoided.** The project swaps the adapter, not its components. Switching from GA4 to PostHog is a one-line change in the root layout.
- **Consent is not an afterthought.** Every event path runs through the consent gate by default. There is no "add consent later" path.
- **Type safety.** A misspelled event name or wrong payload shape is a compile error, not a runtime data quality problem.
- **Small, auditable surface.** Tracking can be audited by searching for `track.event(` and `useButtonTracking` references.
- **Low marginal cost per event.** Adding a new event requires only a new union member in `TypedEvent` — no new helper function, no new export, no new test surface for dispatch wrappers. The `track.event()` method handles any event automatically via type inference.
- **Template/Project boundary preserved.** The template owns the event definitions and dispatch. The project supplies a single adapter function and its own wiring.

### Negative

- **Module-level state in dispatch.** `lib/events.ts` stores the adapter in a module-level variable. Tests need a reset mechanism. A `resetForTesting()` export or `vi.resetModules()` is required per test file.
- **Pre-consent events are silently dropped.** Events fired before the user consents are lost even if the user subsequently grants consent. This is acceptable for a marketing site. Projects that need replay can reintroduce a buffer.
- **Generic method is less self-documenting than named helpers.** `track.event("link_click", { url, label, newTab })` requires the developer to know the event name string and payload shape, whereas `track.linkClick(url, label, newTab)` is self-documenting via the function name and positional parameters. Mitigation: the `TypedEvent` union serves as the single source of truth — a developer can open the union to enumerate all event names and their shapes.

---

## Related Documents

- `architecture.md` — Analytics section, consent storage seam
- `CONTEXT.md` — Glossary (Template Instance, Project Instance)
