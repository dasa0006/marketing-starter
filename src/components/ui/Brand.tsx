import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/config/site";

export interface BrandProps extends HTMLAttributes<HTMLSpanElement> {
  /** When provided, wraps the brand in a link to this href. */
  href?: string;
}

/**
 * Site name with an accent-coloured dot.
 *
 * Tier 0 — flat file, no directory, no story.
 * Renders as a `<span>` by default, or an `<a>` when `href` is provided.
 */
export function Brand({ className, href, ...props }: BrandProps) {
  const content = (
    <>
      {SITE_CONFIG.name}
      <span className="text-[var(--surface-accent)]">.</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          "inline-flex items-center font-bold text-xl no-underline",
          className
        )}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center font-bold text-xl", className)}
      {...props}
    >
      {content}
    </span>
  );
}
