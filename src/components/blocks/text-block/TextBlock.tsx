import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading/Heading";
import type { TextBlockProps } from "./TextBlock.types";

/**
 * TextBlock — a simple rich-text content block with an optional heading.
 *
 * The `content` string is split on double-newlines to produce separate
 * paragraphs. Designed to be wrapped in a `<Section>` that owns the
 * background surface and spacing.
 */
export function TextBlock({ className, heading, content }: TextBlockProps) {
  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <div className={cn("text-block", className)}>
      {heading && <Heading level={2}>{heading}</Heading>}

      <div className="text-block-content">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
