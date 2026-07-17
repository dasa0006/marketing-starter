/**
 * Content Security Policy string generator.
 *
 * Returns a CSP policy string appropriate for the current environment:
 *   - **Development** — allows `'unsafe-eval'` (React DevTools HMR) and
 *     `'unsafe-inline'` (Turbopack hot module replacement)
 *   - **Production** — stricter: drops `'unsafe-eval'`, keeps `'unsafe-inline'`
 *     for Next.js runtime injection, Tailwind, and font loading.
 *
 * This module is pure TypeScript with no Next.js dependency, making it
 * unit-testable in any runner.
 */
export function getCspPolicy(): string {
  const isDev = process.env.NODE_ENV === "development";

  // prettier-ignore
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ];

  return directives.join("; ");
}
