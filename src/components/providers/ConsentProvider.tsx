"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  type ConsentStatus,
  type ConsentStorage,
} from "@/lib/consent/storage.types";
import { createCookieStorage } from "@/lib/consent/storage";

// ── Types ─────────────────────────────────────────────────────────

export interface ConsentContextValue {
  /** Current consent status. */
  status: ConsentStatus;
  /** Persist consent granted. */
  accept: () => void;
  /** Persist consent denied. */
  decline: () => void;
  /** Revert to undecided (re-shows the banner). */
  reset: () => void;
}

// ── Context ───────────────────────────────────────────────────────

const ConsentContext = createContext<ConsentContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────

export function ConsentProvider({
  children,
  storage = createCookieStorage(),
}: {
  children: ReactNode;
  /** Storage seam — defaults to cookie storage. Inject `createFakeStorage()` in tests. */
  storage?: ConsentStorage;
}) {
  // useSyncExternalStore is the correct React 19 pattern for syncing
  // state from an external source (document.cookie).  The third argument
  // (getServerSnapshot) returns "undecided" during SSR where document
  // isn't available.  After hydration the client-side getSnapshot reads
  // the actual cookie — if it differs, React re-renders once with the
  // correct value, without triggering a hydration warning.
  //
  // Because cookies have no external change-event mechanism, we pair
  // subscribe with a tick counter: accept/decline/reset write to the
  // cookie and bump the tick, which re-renders the component.  During
  // that re-render getSnapshot re-reads the cookie, and
  // useSyncExternalStore detects the value change.
  const [, bump] = useState(0);

  const status: ConsentStatus = useSyncExternalStore(
    () => () => {},
    () => storage.getConsent(),
    () => "undecided"
  );

  const accept = useCallback(() => {
    storage.setConsent("accepted");
    bump((n) => n + 1);
  }, [storage, bump]);

  const decline = useCallback(() => {
    storage.setConsent("declined");
    bump((n) => n + 1);
  }, [storage, bump]);

  const reset = useCallback(() => {
    storage.clearConsent();
    bump((n) => n + 1);
  }, [storage, bump]);

  return (
    <ConsentContext.Provider value={{ status, accept, decline, reset }}>
      {children}
    </ConsentContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────

/**
 * Access the consent context.
 *
 * Must be called within a `<ConsentProvider>`. Throws otherwise —
 * check for null in consuming code if you need optional access.
 */
export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (context === null) {
    throw new Error("useConsent() must be used within a <ConsentProvider>");
  }
  return context;
}
