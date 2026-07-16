import { SITE_CONFIG } from "@/lib/config/site";

// ── Types ─────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  item: string;
}

// ── Schema builders ───────────────────────────────────────────────

/**
 * Schema.org Organization structured data.
 *
 * Returns a plain object suitable for JSON-LD serialisation.
 * Based on the site-wide config so it stays in sync automatically.
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
  } as const;
}

/**
 * Schema.org WebSite structured data.
 *
 * Ideally paired with `Organization` — most sites benefit from having both.
 */
export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
  } as const;
}

/**
 * Schema.org BreadcrumbList from an ordered array of items.
 *
 * Each item should have a display `name` and the locale-relative `item` path.
 * The `item` will be resolved against the site URL at render time.
 *
 * ```ts
 * buildBreadcrumbSchema([
 *   { name: "Home", item: "/" },
 *   { name: "About", item: "/about" },
 * ]);
 * ```
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, item }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${SITE_CONFIG.url}${item}`,
    })),
  } as const;
}
