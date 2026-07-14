// ── Consent gating ────────────────────────────────────────────────
// The dispatch layer reads consent status synchronously from the storage
// seam on every event. No subscription, no bridging, no second module.

import { createCookieStorage } from "@/lib/consent/storage";

const _storage = createCookieStorage();

// ── Types ─────────────────────────────────────────────────────────

export interface BaseFields {
  /** Epoch milliseconds when the event was created. */
  timestamp: number;
  /** Ambient metadata attached by dispatch. */
  metadata: {
    path: string;
    locale: string;
  };
}

/**
 * Every event is a member of this typed discriminated union.
 * Adding a new event is a single union member — no new helpers needed.
 */
export type TypedEvent = BaseFields &
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

/** Extract the event-specific payload (excluding name and BaseFields). */
export type ExtractPayload<
  U extends { name: string },
  N extends U["name"],
> = U extends { name: N } ? Omit<U, "name" | keyof BaseFields> : never;

// ── Adapter ───────────────────────────────────────────────────────

/**
 * A tracking adapter receives fully-constructed events with timestamp
 * and metadata already attached.
 */
// eslint-disable-next-line no-unused-vars
export type TrackingAdapter = (event: TypedEvent) => void;

let _adapter: TrackingAdapter | null = null;
let _adapterConfigured = false;

/**
 * Register the project's analytics adapter.
 *
 * Must be called once at module scope in the root layout before any
 * event fires. Calling more than once is an error.
 */
export function configureTracking(adapter: TrackingAdapter): void {
  if (_adapterConfigured) {
    throw new Error("configureTracking() called more than once");
  }
  _adapter = adapter;
  _adapterConfigured = true;
}

/**
 * Reset the adapter state for testing.
 *
 * Not exported from the package — tests use `vi.resetModules()` or call
 * this via the test setup.
 */
export function _resetForTesting(): void {
  _adapter = null;
  _adapterConfigured = false;
}

// ── Metadata helpers ──────────────────────────────────────────────

let _currentPath =
  typeof window !== "undefined" ? window.location.pathname : "/";
let _currentLocale = "en";

/** Update the path that gets attached to every event (called by router). */
export function _setCurrentPath(path: string): void {
  _currentPath = path;
}

/** Update the locale that gets attached to every event (called by providers). */
export function _setCurrentLocale(locale: string): void {
  _currentLocale = locale;
}

// ── Dispatch ──────────────────────────────────────────────────────

function dispatch(event: TypedEvent): void {
  const consent = _storage.getConsent();

  // Drop silently if consent hasn't been granted.
  if (consent !== "accepted") return;

  // Forward to the adapter synchronously.
  _adapter?.(event);

  // Fallback: log to console in development when no adapter is set.
  if (process.env.NODE_ENV === "development" && !_adapter) {
    console.debug("[track]", event.name, event);
  }
}

// ── Public API ────────────────────────────────────────────────────

/**
 * Type-safe event tracking.
 *
 * The payload type is inferred from the event name:
 *
 * ```ts
 * track.event("link_click", { url, label, newTab });
 * track.event("time_on_page_30s");
 * ```
 */
export const track = {
  event: <N extends TypedEvent["name"]>(
    name: N,
    ...[payload]: ExtractPayload<TypedEvent, N> extends Record<string, never>
      ? []
      : [payload: ExtractPayload<TypedEvent, N>]
  ): void => {
    const base: BaseFields = {
      timestamp: Date.now(),
      metadata: {
        path: _currentPath,
        locale: _currentLocale,
      },
    };

    const event = {
      ...base,
      name,
      ...(payload ?? {}),
    } as TypedEvent;

    dispatch(event);
  },
};
