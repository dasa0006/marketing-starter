import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config/site";
import { routing } from "@/i18n/routing";

/**
 * Build a locale-prefixed URL for a given locale and path.
 *
 * With `localePrefix: "as-needed"`, the default locale gets no prefix
 * while other locales are prefixed (e.g. `/da/about`).
 */
function localizedUrl(
  baseUrl: string,
  locale: string,
  path: string,
  defaultLocale: string
): string {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (locale === defaultLocale) {
    return `${cleanBase}${cleanPath}`;
  }
  return `${cleanBase}/${locale}${cleanPath}`;
}

/** The locale-relative paths that should appear in the sitemap. */
const PAGES = ["/", "/about", "/privacy", "/cookie-policy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const { locales, defaultLocale } = routing;
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PAGES) {
    // Build hreflang alternates once per path, not per locale entry.
    const languages: Record<string, string> = {};
    for (const locale of locales) {
      languages[locale] = localizedUrl(
        SITE_CONFIG.url,
        locale,
        path,
        defaultLocale
      );
    }

    for (const locale of locales) {
      entries.push({
        url: localizedUrl(SITE_CONFIG.url, locale, path, defaultLocale),
        alternates: {
          languages,
        },
        changeFrequency: path === "/" ? "monthly" : "yearly",
        priority: path === "/" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
