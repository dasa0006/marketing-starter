import { describe, it, expect } from "vitest";
import { createFakeStorage, createCookieStorage } from "@/lib/consent/storage";
import { CONSENT_COOKIE_NAME } from "@/lib/consent/storage.types";

describe("createFakeStorage", () => {
  it("defaults to undecided", () => {
    const storage = createFakeStorage();
    expect(storage.getConsent()).toBe("undecided");
  });

  it("accepts initial status", () => {
    const storage = createFakeStorage("accepted");
    expect(storage.getConsent()).toBe("accepted");
  });

  it("setConsent updates status", () => {
    const storage = createFakeStorage();
    storage.setConsent("accepted");
    expect(storage.getConsent()).toBe("accepted");
    storage.setConsent("declined");
    expect(storage.getConsent()).toBe("declined");
  });

  it("clearConsent reverts to undecided", () => {
    const storage = createFakeStorage("accepted");
    storage.clearConsent();
    expect(storage.getConsent()).toBe("undecided");
  });
});

describe("createCookieStorage", () => {
  it("reads consent-status from document.cookie", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=accepted; path=/; SameSite=Lax`;
    const storage = createCookieStorage();
    expect(storage.getConsent()).toBe("accepted");
  });

  it("returns undecided when cookie is missing", () => {
    // Clear any existing consent cookie
    document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; max-age=0`;
    const storage = createCookieStorage();
    expect(storage.getConsent()).toBe("undecided");
  });

  it("setConsent writes cookie", () => {
    const storage = createCookieStorage();
    storage.setConsent("declined");
    expect(document.cookie).toContain(`${CONSENT_COOKIE_NAME}=declined`);
  });

  it("clearConsent makes getConsent return undecided", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=accepted; path=/; SameSite=Lax`;
    const storage = createCookieStorage();

    storage.clearConsent();

    expect(storage.getConsent()).toBe("undecided");
  });

  it("returns undecided on malformed cookie value", () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=garbage; path=/; SameSite=Lax`;
    const storage = createCookieStorage();
    expect(storage.getConsent()).toBe("undecided");
  });
});
