# ADR-0002: Event Tracking System

**Status:** Accepted  
**Deciders:** Template author  
**Date:** 2026-05-28  
**Tags:** events, analytics, consent, hooks

---

## Context

The marketing-starter template ships interactive components (Button, SiteHeader, CookieBanner) that need to fire analytics events. Every project also needs page-level events (page views, scroll depth, time on page) and section visibility tracking. Without a shared approach, each project wires its own solution — coupling components to vendor SDKs, scattering `data-*` attributes, and re-litigating consent-gating.

Key constraints:

- **Vendor-agnostic** — no analytics SDK ships in the template. The project chooses GA4, PostHog, Segment, or any other provider at startup.
- **Consent-gated by default** — events must not reach any adapter until the user has granted consent. Pre-consent events are silently dropped; denied consent also drops them.
- **Typed** — every event has a name and shape known to TypeScript. No stringly-typed payloads.
- **Template Instance / Project Instance boundary preserved** — the template owns event definitions, dispatch, and component integration. The project owns the adapter wiring.

---

## Decision

We implement a module-level adapter pattern with four layers:

1. **Consent gating** — consent state read synchronously from the existing storage seam (`lib/consent/storage.ts`); `ConsentProvider` provides reactive state via React context for component re-renders, eliminating a separate module with a different state machine.
2. **Event catalog + dispatch** (`lib/events.ts`) — typed discriminated union, generic `track.event()` method, `configureTracking()` entry point.
3. **Hooks** (`hooks/`) — five hooks that wire events into components and the root layout.
4. **Component integration** — Button, Section, SiteHeader, ConsentProvider, and root layout call the hooks or `track.event()`.

### Consent Gating

There is no standalone reactive consent module. The storage seam (`lib/consent/storage.ts`) is the single source of truth for consent state:

```ts
// From lib/consent/storage.ts
type ConsentStatus = "undecided" | "accepted" | "declined";
interface ConsentStorage {
  getConsent(): ConsentStatus;
  setConsent(status: ConsentStatus): void;
  clearConsent(): void;
}
```

The `ConsentProvider` wraps this storage seam in React context, exposing `status`, `accept()`, `decline()`, and `reset()` to child components (e.g., `CookieBanner`). When the user acts, the provider calls `storage.setConsent()` and updates its internal React state to trigger re-renders.

The event dispatch layer reads consent status **synchronously** from the storage seam on every event dispatch — a sub-millisecond cookie read. No subscription, no bridging, no second module to keep in sync.

**Dispatch rules by consent status:**

| Consent status | Action                                                   |
| -------------- | -------------------------------------------------------- |
| `"undecided"`  | Drop silently. No event reaches the adapter.             |
| `"accepted"`   | Forward to adapter immediately.                          |
| `"declined"`   | Drop silently. No event reaches the adapter.             |

When the user grants consent, `ConsentProvider` fires `track.event("consent_granted", { categories })`. That event's dispatch triggers the synchronous `getConsent()` read, which returns `"accepted"`, and the event is forwarded to the adapter.

This consolidation eliminates:
- A separate `lib/consent.ts` module with a duplicated state type and different enum values (`"pending"`/`"granted"`/`"denied"` vs. `"undecided"`/`"accepted"`/`"declined"`)
- Bridging logic in `ConsentProvider` that must call both modules on every user action
- The risk of one module falling out of sync with the other (e.g., storage write succeeds but notification fails, causing silent event loss)

### Event Catalog

Every event is a member of a typed discriminated union. Each carries `timestamp` and `metadata` (path, locale) auto-attached by dispatch.

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

| Family      | Events                                                    | Source                   |
| ----------- | --------------------------------------------------------- | ------------------------ |
| navigation  | `link_click`, `menu_open`, `menu_close`                   | SiteHeader, inline links |
| interaction | `button_click`                                            | Button primitive         |
| page        | `page_view`, `section_view`, `section_exit`               | Root layout, Section     |
| scroll      | `scroll_depth_25/50/75/100`                               | Root layout              |
| engagement  | `time_on_page_30s`, `time_on_page_60s`                    | Root layout              |
| consent     | `consent_granted`, `consent_updated`, `consent_withdrawn` | ConsentProvider          |

### Type Utilities

A generic `ExtractPayload` type extracts the event-specific payload (all fields except `name` and `BaseFields`) from any member of the discriminated union:

```ts
type ExtractPayload<U extends { name: string }, N extends U["name"]> =
  U extends { name: N } ? Omit<U, "name" | keyof BaseFields> : never;
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

track.event("link_click", { url: "/pricing", label: "Pricing CTA", newTab: false });
track.event("menu_open", { menu: "mobile" });
track.event("menu_close", { menu: "mobile" });
track.event("button_click", { label: "Get Started", variant: "primary" });
track.event("page_view", { path: "/about", referrer: "https://example.com" });
track.event("section_view", { section: "hero" });
track.event("section_exit", { section: "hero" });
track.event("scroll_depth_50", { depth: 50 });
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

Dispatch rules are defined in the [Consent Gating](#consent-gating) section above — the dispatch layer reads consent status synchronously from the storage seam on every event, so no subscription is needed. When consent transitions to `"accepted"`, the next dispatched event triggers a synchronous `getConsent()` read, and the event is forwarded to the adapter.

### Hooks

Five hooks wire events into the component tree:

| Hook                                          | Fires                                                  | Integration point |
| --------------------------------------------- | ------------------------------------------------------ | ----------------- |
| `usePageView()`                               | `page_view` on mount                                   | Root layout       |
| `useScrollTracking()`                         | `scroll_depth_*` via throttled scroll listener         | Root layout       |
| `useTimeOnPage()`                             | `time_on_page_30s`/`60s` via setTimeout                | Root layout       |
| `useSectionVisibility(ref, key)`              | `section_view`/`section_exit` via IntersectionObserver | Section component |
| `useButtonTracking(label, variant, onClick?)` | `button_click` before calling original onClick         | Button primitive  |

### Integration Map

```
Root Layout
├── configureTracking(adapter)       ← project wiring (module scope)
├── usePageView()
├── useScrollTracking()
└── useTimeOnPage()

Section component
└── useSectionVisibility(ref, sectionKey)  ← opt-in via sectionKey prop

Button primitive
└── useButtonTracking(label, variant, onClick)  ← opt-in via trackingLabel prop

SiteHeader
└── Direct track.event("link_click", ...), track.event("menu_open/close", ...)

ConsentProvider
├── storage.setConsent("accepted" | "declined")
├── Updates React context state (triggers CookieBanner re-render)
├── Fires track.event("consent_granted/updated/withdrawn", ...)
└── Dispatch reads getConsent() from storage synchronously
```

### Non-Goals

- No analytics provider code ships in the template.
- No event storage/persistence on the template side.
- No server-side event tracking (template has no backend).
- No form events.
- No user identity tracking.
- No event replay or retry.

---

## Consequences

### Positive

- **Vendor lock-in avoided.** The project swaps the adapter, not the components. Switching from GA4 to PostHog is a one-line change in the root layout.
- **Consent is not an afterthought.** Every event path runs through the consent gate by default. There is no "add consent later" path.
- **Type safety.** A misspelled event name or wrong payload shape is a compile error, not a runtime data quality problem.
- **Discoverable integration surface.** The five hooks are a closed set. A developer or AI agent can audit all tracking by searching for `track.event(` and `use.*Tracking` references.
- **Low marginal cost per event.** Adding a new event requires only a new union member in `TypedEvent` — no new helper function, no new export, no new test surface for dispatch wrappers. The `track.event()` method handles any event automatically via type inference.
- **Template/Project boundary preserved.** The template owns the event definitions, hooks, and component wiring. The project supplies a single function.

### Negative

- **Module-level state in dispatch.** `lib/events.ts` stores the adapter in a module-level variable. Tests need a reset mechanism. A `resetForTesting()` export or `vi.resetModules()` is required per test file.
- **Pre-consent events are silently dropped.** Events fired before the user consents (e.g., scroll depth at 25% before accepting cookies) are lost even if the user subsequently grants consent. This is acceptable for a marketing site — the consent events themselves are the high-signal interaction, and a page view fires only once. Projects that need replay can reintroduce a buffer.
- **Generic method is less self-documenting than named helpers.** `track.event("link_click", { url, label, newTab })` requires the developer to know the event name string and payload shape, whereas `track.linkClick(url, label, newTab)` is self-documenting via the function name and positional parameters. The generic approach trades inline discoverability for a smaller API surface and lower marginal cost per event. Mitigation: the `TypedEvent` union serves as the single source of truth — a developer can open the union to enumerate all event names and their shapes.

### Risks

- **Scroll tracking test fragility.** The `useScrollTracking` test stubs `window.innerHeight` and `document.body.scrollHeight`. These are global mutations that must be carefully cleaned up. Mitigation: use `vi.stubGlobal` or vitest's `original` restore pattern.

---

## Related Documents

- `architecture.md` — Analytics section, consent storage seam
- `CONTEXT.md` — Glossary (Template Instance, Project Instance)
