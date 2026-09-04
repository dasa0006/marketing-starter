import { describe, it, expect } from "vitest";
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
  buildBreadcrumbSchema,
} from "./schemas";

describe("SEO schema builders", () => {
  it("buildOrganizationSchema returns an Organization schema from site config", () => {
    const schema = buildOrganizationSchema();

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("Marketing Starter");
    expect(schema.url).toBe("http://localhost:3000");
  });

  it("buildWebsiteSchema returns a WebSite schema from site config", () => {
    const schema = buildWebsiteSchema();

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.name).toBe("Marketing Starter");
  });

  it("buildBreadcrumbSchema returns a positioned BreadcrumbList", () => {
    const schema = buildBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "About", item: "/about" },
    ]);

    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "http://localhost:3000/",
    });
    expect(schema.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: "http://localhost:3000/about",
    });
  });
});
