import type { Surface } from "@/lib/config/navigation";
import type { LinkButtonVariant } from "@/components/ui/link-button/LinkButton.types";

/** A single CTA link definition. */
export interface CTAItem {
  /** Button / link label text. */
  label: string;
  /** Target href. */
  href: string;
  /** Button variant. Defaults to `"primary"`. */
  variant?: LinkButtonVariant;
}

/** Visual layout for the CTA block. */
export type CTALayout = "center" | "left";

export interface CTAProps {
  /** Additional CSS class names. */
  className?: string;
  /** Headline text. */
  heading: string;
  /** Optional supporting paragraph. */
  description?: string;
  /** Primary call-to-action. */
  primaryCTA: CTAItem;
  /** Optional secondary call-to-action. */
  secondaryCTA?: CTAItem;
  /** The background surface — flows to LinkButton for colour adaptation. */
  surface?: Surface;
  /** Layout variant. Defaults to `"center"`. */
  layout?: CTALayout;
}
