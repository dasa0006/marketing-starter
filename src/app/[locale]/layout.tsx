import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { getPageMetadata } from "@/lib/seo/metadata";
import { SITE_CONFIG } from "@/lib/config/site";
import { routing, generateStaticParamsForLocales } from "@/i18n/routing";
import { ConsentProvider } from "@/components/providers/ConsentProvider";
import "../globals.css";

export { generateStaticParamsForLocales as generateStaticParams };

// ── Types ─────────────────────────────────────────────────────────

type LocaleLayoutProps = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

// ── Metadata ──────────────────────────────────────────────────────

/**
 * Default metadata for all pages under this locale segment.
 *
 * Individual pages can override this by exporting their own
 * `generateMetadata` — layout-level metadata acts as a fallback.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return getPageMetadata({
    locale,
    path: "/",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
  });
}

// ── Layout ────────────────────────────────────────────────────────

/**
 * Locale-scoped layout — locale-aware providers and page body.
 *
 * Renders the provider chain (NextIntlClientProvider → ConsentProvider)
 * around the page content.
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={SITE_CONFIG.timezone}
    >
      <ConsentProvider>
        <main>{children}</main>
      </ConsentProvider>
    </NextIntlClientProvider>
  );
}
