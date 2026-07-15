import type { Surface } from "@/lib/config/navigation";

/** Visual layout mode for the hero section. */
export type HeroLayout = "center" | "left" | "split";

/** A single call-to-action link within a hero. */
export interface HeroCTA {
  /** Button / link label text. */
  label: string;
  /** Target href. */
  href: string;
}

export interface HeroProps {
  /** Additional CSS class names. */
  className?: string;
  /** Main heading text. */
  heading: string;
  /** Optional supporting paragraph. */
  subtitle?: string;
  /** Primary CTA — rendered as a prominent LinkButton. */
  primaryCTA?: HeroCTA;
  /** Secondary CTA — rendered as a secondary-styled LinkButton. */
  secondaryCTA?: HeroCTA;
  /** Optional hero image (used in `split` layout or as decoration). */
  image?: { src: string; alt: string };
  /** The background surface this hero sits on — flows to LinkButton. */
  surface?: Surface;
  /** Layout variant. Defaults to `"center"`. */
  layout?: HeroLayout;
}
