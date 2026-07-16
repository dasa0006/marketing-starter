import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { getPageMetadata } from "@/lib/seo/metadata";
import { SITE_CONFIG } from "@/lib/config/site";
import { routing, generateStaticParamsForLocales } from "@/i18n/routing";
import { ConsentProvider } from "@/components/providers/ConsentProvider";
import { SiteHeader } from "@/components/layout/header/SiteHeader";
import { SiteFooter } from "@/components/layout/footer/SiteFooter";
import { CookieBanner } from "@/components/layout/cookie-banner/CookieBanner";
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
 * Locale-scoped layout — the full HTML shell for every page.
 *
 * Renders the provider chain (ThemeProvider → NextIntlClientProvider →
 * ConsentProvider), SiteHeader, <main>, SiteFooter, and CookieBanner.
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={SITE_CONFIG.timezone}
      >
        <ConsentProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CookieBanner />
        </ConsentProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
