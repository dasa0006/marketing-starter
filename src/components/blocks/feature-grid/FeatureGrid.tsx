import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading/Heading";
import { Text } from "@/components/ui/text/Text";
import type { FeatureGridProps, FeatureGridColumns } from "./FeatureGrid.types";

const columnsClass: Record<FeatureGridColumns, string> = {
  2: "feature-grid-cols-2",
  3: "feature-grid-cols-3",
  4: "feature-grid-cols-4",
};

/**
 * FeatureGrid block — a grid of feature cards, each with an icon, heading,
 * and description.
 *
 * Composes Heading and Text primitives. Designed to be wrapped in a `<Section>`
 * that owns the background surface and spacing.
 */
export function FeatureGrid({
  className,
  heading,
  description,
  features,
  columns = 3,
}: FeatureGridProps) {
  return (
    <div className={cn("feature-grid", className)}>
      <div className={cn("feature-grid-header", "feature-grid-header-center")}>
        <Heading level={2}>{heading}</Heading>
        {description && <Text size="lg">{description}</Text>}
      </div>

      <div className={cn("feature-grid-grid", columnsClass[columns])}>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="feature-card">
              <span className="feature-card-icon">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <Heading level={3}>{feature.heading}</Heading>
              <Text size="sm">{feature.description}</Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
