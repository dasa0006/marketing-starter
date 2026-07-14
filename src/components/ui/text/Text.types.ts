import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type TextSize = "sm" | "base" | "lg" | "lead";
export type TextVariant = "default" | "muted";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Semantic size — maps to font-size / line-height scales. */
  size?: TextSize;
  /** Visual variant. */
  variant?: TextVariant;
  /** The HTML element to render (polymorphic). */
  as?: ElementType;
  children: ReactNode;
}
