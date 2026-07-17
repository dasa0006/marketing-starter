import { getCspPolicy } from "./csp";

/**
 * Response header descriptor — the shape consumed by `next.config.ts` `headers()`.
 */
export interface SecurityHeader {
  key: string;
  value: string;
}

/**
 * Build the complete set of HTTP security response headers.
 *
 * Returns an array of `{ key, value }` pairs suitable for use inside
 * `next.config.ts`:
 *
 * ```ts
 * async headers() {
 *   return [
 *     { source: "/(.*)", headers: createSecurityHeaders() },
 *   ];
 * }
 * ```
 *
 * **Applied headers:**
 *   - Content-Security-Policy (dev vs prod via `getCspPolicy()`)
 *   - X-Content-Type-Options: nosniff
 *   - X-Frame-Options: DENY
 *   - Referrer-Policy: strict-origin-when-cross-origin
 *   - Permissions-Policy: camera=(), microphone=(), geolocation=()
 *   - Strict-Transport-Security (production only)
 *
 * See architecture.md → Security for the rationale.
 */
export function createSecurityHeaders(): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    { key: "Content-Security-Policy", value: getCspPolicy() },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
  ];

  // HSTS is production-only — never send in dev (avoids locking out localhost)
  if (process.env.NODE_ENV === "production") {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });
  }

  return headers;
}
