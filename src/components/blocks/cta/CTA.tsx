import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading/Heading";
import { Text } from "@/components/ui/text/Text";
import { LinkButton } from "@/components/ui/link-button/LinkButton";
import type { CTAProps, CTALayout } from "./CTA.types";

const layoutClass: Record<CTALayout, string> = {
  center: "cta-layout-center",
  left: "cta-layout-left",
};

/**
 * CTA block — a focused call-to-action section with heading, optional
 * description, and one or two action links.
 *
 * Composes Heading, Text, and LinkButton primitives. Designed to be wrapped
 * in a `<Section>` that owns the background surface and spacing.
 */
export function CTA({
  className,
  heading,
  description,
  primaryCTA,
  secondaryCTA,
  surface = "white",
  layout = "center",
}: CTAProps) {
  return (
    <div className={cn("cta", layoutClass[layout], className)}>
      <div className="cta-content">
        <Heading level={2}>{heading}</Heading>

        {description && <Text size="lg">{description}</Text>}

        <div className="cta-actions">
          <LinkButton
            href={primaryCTA.href}
            variant={primaryCTA.variant ?? "primary"}
            size="lg"
            surface={surface}
          >
            {primaryCTA.label}
          </LinkButton>

          {secondaryCTA && (
            <LinkButton
              href={secondaryCTA.href}
              variant={secondaryCTA.variant ?? "secondary"}
              size="lg"
              surface={surface}
            >
              {secondaryCTA.label}
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );
}
