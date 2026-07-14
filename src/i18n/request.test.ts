import { describe, it, expect, vi, beforeEach } from "vitest";
import { routing } from "./routing";
import { createRequestConfig } from "./request";

// ---------------------------------------------------------------------------
// Helper: mock module-level dynamic imports used by createRequestConfig
// ---------------------------------------------------------------------------

vi.mock("../../messages/base/en.json", () => ({
  default: { BaseMessage: "base-en", SharedMessage: "from-base" },
}));

vi.mock("../../messages/base/da.json", () => ({
  default: { BaseMessage: "base-da", SharedMessage: "from-base-da" },
}));

vi.mock("../../messages/custom/en.json", () => ({
  default: { CustomMessage: "custom-en", SharedMessage: "from-custom" },
}));

vi.mock("../../messages/custom/da.json", () => ({
  default: { CustomMessage: "custom-da", SharedMessage: "from-custom-da" },
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("routing config", () => {
  it("defines the expected locales", () => {
    expect(routing.locales).toEqual(["en", "da"]);
  });

  it("sets defaultLocale to en", () => {
    expect(routing.defaultLocale).toBe("en");
  });

  it("uses as-needed locale prefix", () => {
    expect(routing.localePrefix).toBe("as-needed");
  });
});

describe("generateStaticParamsForLocales", () => {
  it("returns one param entry per locale", async () => {
    const { generateStaticParamsForLocales } = await import("./routing");
    const result = generateStaticParamsForLocales();
    expect(result).toEqual([{ locale: "en" }, { locale: "da" }]);
  });
});

describe("createRequestConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the default locale (en) when requestLocale is undefined", async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve(undefined),
    });
    expect(config.locale).toBe("en");
  });

  it("returns the default locale (en) when requestLocale is an empty string", async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve(""),
    });
    expect(config.locale).toBe("en");
  });

  it('returns "da" when requestLocale is "da"', async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve("da"),
    });
    expect(config.locale).toBe("da");
  });

  it("falls back to default locale for unsupported locale values", async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve("fr"),
    });
    expect(config.locale).toBe("en");
  });

  it("falls back to default locale for garbage locale strings", async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve("!!invalid!!"),
    });
    expect(config.locale).toBe("en");
  });

  it("merges base and custom messages for en (custom overrides base)", async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve("en"),
    });

    expect(config.messages).toEqual({
      // From base
      BaseMessage: "base-en",
      // From custom
      CustomMessage: "custom-en",
      // Custom overrides base on shared keys
      SharedMessage: "from-custom",
    });
  });

  it("merges base and custom messages for da", async () => {
    const config = await createRequestConfig({
      requestLocale: Promise.resolve("da"),
    });

    expect(config.messages).toEqual({
      BaseMessage: "base-da",
      CustomMessage: "custom-da",
      SharedMessage: "from-custom-da",
    });
  });
});
