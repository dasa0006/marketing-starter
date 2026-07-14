/**
 * Consent status values.
 *
 * - `"undecided"` — user has not yet made a choice (default)
 * - `"accepted"`  — user has accepted cookies
 * - `"declined"`  — user has declined cookies (opt-out)
 */
export type ConsentStatus = "undecided" | "accepted" | "declined";

/**
 * Storage seam for cookie consent persistence.
 *
 * Decouples consent persistence from the React provider so consumer
 * tests can inject an in-memory fake instead of mocking document.cookie.
 */
export interface ConsentStorage {
  /** Read current consent — never throws, returns "undecided" on error. */
  getConsent(): ConsentStatus;
  /** Persist a decision (accept or decline). */
  // eslint-disable-next-line no-unused-vars
  setConsent(status: ConsentStatus): void;
  /** Revert to undecided (reset / manage cookies). */
  clearConsent(): void;
}

/**
 * The cookie name used to persist consent status.
 */
export const CONSENT_COOKIE_NAME = "consent-status";
