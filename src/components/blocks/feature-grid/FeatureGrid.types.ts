import type { LucideIcon } from "lucide-react";

/** Number of grid columns. */
export type FeatureGridColumns = 2 | 3 | 4;

/** A single feature item rendered as a card within the grid. */
export interface FeatureItem {
  /** Lucide icon component to display. */
  icon: LucideIcon;
  /** Feature heading. */
  heading: string;
  /** Feature description. */
  description: string;
}

export interface FeatureGridProps {
  /** Additional CSS class names. */
  className?: string;
  /** Section-level heading above the grid. */
  heading: string;
  /** Optional supporting paragraph below the heading. */
  description?: string;
  /** Array of feature items to display. */
  features: FeatureItem[];
  /** Number of grid columns. Defaults to `3`. */
  columns?: FeatureGridColumns;
}
