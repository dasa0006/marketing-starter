import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading/Heading";
import { Text } from "@/components/ui/text/Text";
import { Image } from "@/components/ui/image/Image";
import { LinkButton } from "@/components/ui/link-button/LinkButton";
import type { HeroProps, HeroLayout } from "./Hero.types";

const layoutClass: Record<HeroLayout, string> = {
  center: "hero-layout-center",
  left: "hero-layout-left",
  split: "hero-layout-split",
};

/**
 * Hero block — a prominent page-header composition with heading, optional
 * subtitle, optional CTAs, and an optional image slot.
 *
 * Composes Heading, Text, LinkButton, and Image primitives. Designed to be
 * wrapped in a `<Section>` that owns the background surface and spacing.
 */
export function Hero({
  className,
  heading,
  subtitle,
  primaryCTA,
  secondaryCTA,
  image,
  surface = "white",
  layout = "center",
}: HeroProps) {
  return (
    <div className={cn("hero", layoutClass[layout], className)}>
      <div className="hero-content">
        <Heading level={1}>{heading}</Heading>

        {subtitle && <Text size="lg">{subtitle}</Text>}

        {(primaryCTA || secondaryCTA) && (
          <div className="hero-ctas">
            {primaryCTA && (
              <LinkButton
                href={primaryCTA.href}
                variant="primary"
                size="lg"
                surface={surface}
              >
                {primaryCTA.label}
              </LinkButton>
            )}
            {secondaryCTA && (
              <LinkButton
                href={secondaryCTA.href}
                variant="secondary"
                size="lg"
                surface={surface}
              >
                {secondaryCTA.label}
              </LinkButton>
            )}
          </div>
        )}
      </div>

      {image && layout === "split" && (
        <div className="hero-image">
          <Image
            src={image.src}
            alt={image.alt}
            width={600}
            height={400}
            priority
          />
        </div>
      )}
    </div>
  );
}
