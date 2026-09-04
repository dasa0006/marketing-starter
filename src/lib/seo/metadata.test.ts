import { describe, it, expect } from "vitest";
import { getPageMetadata } from "./metadata";

const baseParams = {
  locale: "en",
  path: "/about",
  title: "About",
  description: "About us",
  locales: ["en", "da"],
  defaultLocale: "en",
} as const;

describe("getPageMetadata", () => {
  it("appends the site name to the title", () => {
    const meta = getPageMetadata(baseParams);

    expect(meta.title).toBe("About | Marketing Starter");
    expect(meta.description).toBe("About us");
  });

  it("uses the un-prefixed URL for the default locale", () => {
    const meta = getPageMetadata(baseParams);

    expect(meta.alternates?.canonical).toBe("http://localhost:3000/about");
  });

  it("prefixes the URL for non-default locales", () => {
    const meta = getPageMetadata({ ...baseParams, locale: "da" });

    expect(meta.alternates?.canonical).toBe("http://localhost:3000/da/about");
  });

  it("builds hreflang alternates for every locale plus x-default", () => {
    const meta = getPageMetadata(baseParams);

    expect(meta.alternates?.languages).toEqual({
      en: "http://localhost:3000/about",
      da: "http://localhost:3000/da/about",
      "x-default": "http://localhost:3000/about",
    });
  });

  it("populates Open Graph fields", () => {
    const meta = getPageMetadata(baseParams);

    expect(meta.openGraph?.siteName).toBe("Marketing Starter");
    expect(meta.openGraph?.url).toBe("http://localhost:3000/about");
  });
});
