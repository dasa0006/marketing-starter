import type { ElementType, HTMLAttributes, ReactNode } from "react";

/** Vertical padding size for the Section. Maps to `--section-padding-y-*` tokens. */
export type SectionSize = "sm" | "md" | "lg" | "xl";

/** Surface background variant. Maps to `--surface-*` / `--text-on-*` tokens. */
export type SectionSurface = "white" | "subtle" | "dark" | "accent";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Vertical padding size. Defaults to "md". */
  size?: SectionSize;
  /** Surface background variant. Defaults to "white". */
  surface?: SectionSurface;
  /** Override the HTML element — useful for semantic correctness. Defaults to "section". */
  as?: ElementType;
  /** When true applies a containing width constraint (mx-auto max-w-7xl px-4 sm:px-6 lg:px-8). Defaults to true. */
  contained?: boolean;
  children: ReactNode;
}
