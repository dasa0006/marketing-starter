import NextImage, { type ImageProps as NextImageProps } from "next/image";

/**
 * Thin wrapper around `next/image` that ensures `alt` is always provided.
 *
 * All standard `next/image` props are supported except for the deprecated
 * `priority` — use `preload` instead (Next.js 16 API).
 */
export function Image({ alt, ...props }: NextImageProps) {
  return <NextImage alt={alt} {...props} />;
}
