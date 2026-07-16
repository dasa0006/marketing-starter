import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * i18n middleware — handles locale detection, negotiation, and URL rewriting.
 *
 * With `localePrefix: "as-needed"`:
 *   - Default locale (`en`) → no prefix in the URL
 *   - Other locales (`da`) → prefixed (`/da/...`)
 *
 * The middleware works in tandem with `createNextIntlPlugin` in next.config.ts.
 * The plugin provides the request config (message loading); this middleware
 * handles the routing layer (URL rewriting, locale detection).
 */
export default createMiddleware(routing);

export const config = {
  // Match all request paths except for:
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /favicon.ico, /robots.txt, etc. (static files with extensions)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
