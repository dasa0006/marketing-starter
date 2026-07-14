"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
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
  const [status, setStatus] = useState<ConsentStatus>(() =>
    storage.getConsent()
  );

  const accept = useCallback(() => {
    storage.setConsent("accepted");
    setStatus("accepted");
  }, [storage]);

  const decline = useCallback(() => {
    storage.setConsent("declined");
    setStatus("declined");
  }, [storage]);

  const reset = useCallback(() => {
    storage.clearConsent();
    setStatus("undecided");
  }, [storage]);

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
