import {
  type ConsentStatus,
  type ConsentStorage,
  CONSENT_COOKIE_NAME,
} from "@/lib/consent/storage.types";

/**
 * Create a ConsentStorage backed by `document.cookie`.
 *
 * Cookie attributes: `path=/; SameSite=Lax; max-age=31536000` (1 year).
 *
 * Never throws — malformed or unreadable cookies return `"undecided"`.
 */
export function createCookieStorage(): ConsentStorage {
  const readCookie = (): ConsentStatus => {
    try {
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`));
      if (!match) return "undecided";
      const value = match.split("=")[1] as ConsentStatus;
      return ["accepted", "declined"].includes(value) ? value : "undecided";
    } catch {
      return "undecided";
    }
  };

  const writeCookie = (status: ConsentStatus): void => {
    document.cookie = `${CONSENT_COOKIE_NAME}=${status}; path=/; SameSite=Lax; max-age=31536000`;
  };

  const clearCookie = (): void => {
    document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; SameSite=Lax; max-age=0`;
  };

  return {
    getConsent: readCookie,
    setConsent: writeCookie,
    clearConsent: clearCookie,
  };
}

/**
 * Create a ConsentStorage backed by an in-memory variable.
 *
 * Optional `initialStatus` parameter sets the starting state (defaults to
 * `"undecided"`). Use in tests to inject a known consent state without
 * touching `document.cookie`.
 */
export function createFakeStorage(
  initialStatus: ConsentStatus = "undecided"
): ConsentStorage {
  let status: ConsentStatus = initialStatus;

  return {
    getConsent: () => status,
    setConsent: (s) => {
      status = s;
    },
    clearConsent: () => {
      status = "undecided";
    },
  };
}
