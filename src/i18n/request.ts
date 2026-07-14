import { getRequestConfig } from "next-intl/server";
import type { GetRequestConfigParams, RequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Creates the server-side request configuration for the current locale.
 *
 * Merges two message layers so that custom (per-project) messages override
 * base (template) messages for the same key:
 *
 *   1. `messages/base/{locale}.json` — pre-translated template strings
 *   2. `messages/custom/{locale}.json` — per-project additions/overrides
 *
 * The merge is a shallow spread (`{...base, ...custom}`) — top-level keys
 * from `custom` fully replace matching keys from `base`. This is intentional:
 * the two layers have disjoint top-level namespaces (base owns CookieBanner,
 * NotFound, Error, Legal; custom owns SiteHeader, SiteFooter, page content,
 * metadata), so a shallow merge is the correct semantics.
 *
 * Dynamic `import()` works correctly here because this function runs in the
 * server module graph — no bundler limitations on computed dynamic imports
 * for JSON files.
 *
 * Exported separately so unit tests can invoke the callback without going
 * through `getRequestConfig` (which is an identity function at runtime).
 *
 * @see https://next-intl.dev/docs/usage/configuration#i18n-request
 */
export async function createRequestConfig({
  requestLocale,
}: GetRequestConfigParams): Promise<RequestConfig> {
  let locale = routing.defaultLocale;

  if (requestLocale) {
    const requested = await requestLocale;
    if (hasLocale(routing.locales, requested)) {
      locale = requested;
    }
  }

  return {
    locale,
    messages: {
      ...(await import(`../../messages/base/${locale}.json`)).default,
      ...(await import(`../../messages/custom/${locale}.json`)).default,
    },
  };
}

export default getRequestConfig(createRequestConfig);
