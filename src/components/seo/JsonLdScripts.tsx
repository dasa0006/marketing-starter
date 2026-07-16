import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo/schemas";

// ── Types ─────────────────────────────────────────────────────────

export interface JsonLdScriptsProps {
  /**
   * Additional JSON-LD schema objects to render.
   *
   * Use this to pass page-specific schemas (e.g. BreadcrumbList)
   * alongside the always-present Organization + WebSite.
   */
  schemas?: Record<string, unknown>[];
}

// ── Component ─────────────────────────────────────────────────────

/**
 * Renders JSON-LD structured data for improved search-engine理解和
 * rich-result eligibility.
 *
 * Always includes `Organization` and `WebSite` schemas derived from
 * the site-wide config. Accepts optional additional schemas via the
 * `schemas` prop (e.g. BreadcrumbList, Article, Product).
 *
 * ```tsx
 * <JsonLdScripts schemas={[breadcrumbSchema]} />
 * ```
 */
export function JsonLdScripts({ schemas = [] }: JsonLdScriptsProps) {
  const baseSchemas = [buildOrganizationSchema(), buildWebsiteSchema()];
  const allSchemas = [...baseSchemas, ...schemas];

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
