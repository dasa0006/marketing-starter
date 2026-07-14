import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4;

export interface HeadingProps extends HTMLAttributes<HTMLElement> {
  /** The heading level (1-4), which determines both the HTML element and styling. */
  level?: HeadingLevel;
  /** Override the HTML element — useful for semantic correctness with visual styling. */
  as?: ElementType;
  children: ReactNode;
}
