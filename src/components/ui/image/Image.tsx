import NextImage, { type ImageProps as NextImageProps } from "next/image";

/**
 * Opinionated wrapper around `next/image` that provides sensible defaults
 * for marketing site imagery.
 *
 * **Added defaults:**
 * - `quality={85}` — higher visual fidelity than the Next.js default of 75.
 *   Requires `images.qualities` in `next.config.ts` to include 85.
 *
 * All standard `next/image` props are supported, including the deprecated
 * `priority` (use `preload` for new code — see Next.js 16 docs).
 */
export function Image({ alt, quality = 85, ...props }: NextImageProps) {
  return <NextImage alt={alt} quality={quality} {...props} />;
}
