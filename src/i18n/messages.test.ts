import { describe, it, expect } from "vitest";
import { getMessagesForLocale } from "./messages";

describe("getMessagesForLocale", () => {
  it("merges base and custom messages for en", () => {
    const messages = getMessagesForLocale("en");

    // Base layer (template infrastructure strings).
    expect(messages.NotFound.title).toBe("Page Not Found");
    expect(messages.Error.retry).toBe("Try Again");
    // Custom layer (per-project content).
    expect(messages.Metadata.home.title).toBe("Marketing Starter");
  });

  it("merges base and custom messages for da", () => {
    const messages = getMessagesForLocale("da");

    expect(messages.NotFound.title).toBe("Siden blev ikke fundet");
    expect(messages.Error.retry).toBe("Prøv igen");
    expect(messages.Metadata.home.title).toBe("Marketing Starter");
  });

  it("returns messages for every shipped locale", () => {
    // Exercise both keys of the Record<Locale, …> map.
    expect(getMessagesForLocale("en")).toBeDefined();
    expect(getMessagesForLocale("da")).toBeDefined();
  });
});
