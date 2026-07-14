import { cn } from "@/lib/utils";
import type { TextProps } from "./Text.types";

const sizeClass: Record<string, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  lead: "text-lead",
};

const variantClass: Record<string, string> = {
  default: "text-default",
  muted: "text-muted",
};

/**
 * Polymorphic body copy component with size and variant presets.
 *
 * Renders a `<p>` by default; use `as` to change the element.
 */
export function Text({
  className,
  size = "base",
  variant = "default",
  as: Tag = "p",
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(sizeClass[size], variantClass[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
