"use client";

import { useConsent } from "@/components/providers/ConsentProvider";

/**
 * Resets consent, causing the CookieBanner to re-appear.
 *
 * Tier 0 — flat file, no directory, no story.
 * Renders a simple button that calls `reset()` on the consent context.
 */
export function ManageCookiesButton() {
  const { reset } = useConsent();

  return (
    <button
      type="button"
      onClick={reset}
      className="text-sm underline underline-offset-2 transition-colors hover:opacity-70"
    >
      Manage Cookies
    </button>
  );
}
