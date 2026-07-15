import type { ElementType } from "react";
import { cn } from "@/lib/utils";
import type {
  SectionProps,
  SectionSize,
  SectionSurface,
} from "./Section.types";

const sizeClass: Record<SectionSize, string> = {
  sm: "section-size-sm",
  md: "section-size-md",
  lg: "section-size-lg",
  xl: "section-size-xl",
};

const surfaceClass: Record<SectionSurface, string> = {
  white: "section-surface-white",
  subtle: "section-surface-subtle",
  dark: "section-surface-dark",
  accent: "section-surface-accent",
};

const defaultTag: ElementType = "section";

/**
 * Layout section wrapper with size (vertical padding), surface (background),
 * and container control.
 *
 * Renders a `<section>` by default; use `as` to change the element.
 */
export function Section({
  className,
  size = "md",
  surface = "white",
  contained = true,
  as,
  children,
  ...props
}: SectionProps) {
  const Tag = as ?? defaultTag;

  return (
    <Tag
      className={cn(
        "section",
        sizeClass[size],
        surfaceClass[surface],
        contained ? "section-contained" : "section-full",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
