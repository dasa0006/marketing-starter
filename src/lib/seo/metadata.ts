import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config/site";

// ── Types ─────────────────────────────────────────────────────────

export interface PageMetadataParams {
  /** Current locale (e.g. "en", "da"). */
  locale: string;
  /** Locale-relative path including leading slash (e.g. "/about"). */
  path: string;
  /** Page title — appended with site name suffix automatically. */
  title: string;
  /** Meta description. */
  description: string;
  /** All shipped locales for hreflang alternates. */
  locales: readonly string[];
  /** The default locale (used to decide which URL is canonical). */
  defaultLocale: string;
}

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Build the locale-prefixed URL for a given locale and path.
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
  // Strip trailing slash from base, ensure path starts with /
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (locale === defaultLocale) {
    return `${cleanBase}${cleanPath}`;
  }
  return `${cleanBase}/${locale}${cleanPath}`;
}

// ── Metadata builder ──────────────────────────────────────────────

/**
 * Build a Next.js `Metadata` object with canonical URL, hreflang
 * alternates, Open Graph, and Twitter Card in one call.
 *
 * Call this from a page's `generateMetadata` export:
 *
 * ```ts
 * export async function generateMetadata(
 *   { params }: { params: Promise<{ locale: string }> },
 * ): Promise<Metadata> {
 *   const { locale } = await params;
 *   return getPageMetadata({
 *     locale,
 *     path: "/",
 *     title: "Home",
 *     description: "Welcome to our site",
 *     locales,
 *     defaultLocale: "en",
 *   });
 * }
 * ```
 */
export function getPageMetadata({
  locale,
  path,
  title,
  description,
  locales,
  defaultLocale,
}: PageMetadataParams): Metadata {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const canonicalUrl = localizedUrl(
    SITE_CONFIG.url,
    locale,
    path,
    defaultLocale
  );

  // Build hreflang alternates for every shipped locale.
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = localizedUrl(SITE_CONFIG.url, l, path, defaultLocale);
  }
  // Add x-default pointing at the default-locale URL.
  languages["x-default"] = localizedUrl(
    SITE_CONFIG.url,
    defaultLocale,
    path,
    defaultLocale
  );

  return {
    title: fullTitle,
    description,

    alternates: {
      canonical: canonicalUrl,
      languages,
    },

    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => localizedUrl(SITE_CONFIG.url, l, path, defaultLocale)),
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
