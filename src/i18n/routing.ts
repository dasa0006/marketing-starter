import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "da"] as const,
  defaultLocale: "en",
  localePrefix: "as-needed",
});

/** Convenience shorthand for `routing.locales`. */
export const locales = routing.locales;

/** Single source of truth for the `Locale` union type. */
export type Locale = (typeof routing.locales)[number];

/**
 * Convenience helper for `generateStaticParams` in locale-aware routes.
 *
 * Every route that uses `[locale]` should re-export this:
 *
 * ```ts
 * export { generateStaticParamsForLocales as generateStaticParams } from "@/i18n/routing";
 * ```
 *
 * Adding a new locale is a single edit to `routing.ts`; the new locale flows
 * through every page automatically.
 */
export function generateStaticParamsForLocales() {
  return routing.locales.map((locale) => ({ locale }));
}
