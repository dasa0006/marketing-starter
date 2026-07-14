import type { TextProps } from "./Text.types";

export const mockTextSizes: TextProps[] = [
  { children: "Small body text — 14px / 1.5", size: "sm", variant: "default" },
  {
    children: "Base body text — 16px / 1.625 (default)",
    size: "base",
    variant: "default",
  },
  { children: "Large body text — 18px / 1.7", size: "lg", variant: "default" },
  {
    children: "Lead paragraph — 20px / 1.75",
    size: "lead",
    variant: "default",
  },
];

export const mockTextVariants: TextProps[] = [
  {
    children: "Default variant — full opacity foreground colour.",
    size: "base",
    variant: "default",
  },
  {
    children: "Muted variant — reduced opacity for secondary content.",
    size: "base",
    variant: "muted",
  },
];
