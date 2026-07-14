import type { ElementType } from "react";
import { cn } from "@/lib/utils";
import type { HeadingProps } from "./Heading.types";

const levelClass: Record<number, string> = {
  1: "heading-h1",
  2: "heading-h2",
  3: "heading-h3",
  4: "heading-h4",
};

const defaultTag: Record<number, ElementType> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
};

/**
 * Polymorphic heading component (h1-h4) with consistent styling.
 *
 * The `level` prop controls the visual style. The `as` prop overrides
 * the HTML element while keeping the level's visual style.
 */
export function Heading({
  className,
  level = 1,
  as,
  children,
  ...props
}: HeadingProps) {
  const Tag = as ?? defaultTag[level];

  return (
    <Tag className={cn("heading", levelClass[level], className)} {...props}>
      {children}
    </Tag>
  );
}
