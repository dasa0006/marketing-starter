import type { CTAProps } from "./CTA.types";

export const mockCTAProps: CTAProps = {
  heading: "Ready to Get Started?",
  description:
    "Join thousands of teams building better marketing sites with our starter template.",
  primaryCTA: { label: "Get Started", href: "/", variant: "primary" },
  secondaryCTA: {
    label: "Contact Sales",
    href: "/about",
    variant: "secondary",
  },
  surface: "white",
  layout: "center",
};

export const mockCTALeft: CTAProps = {
  ...mockCTAProps,
  layout: "left",
};

export const mockCTANoDescription: CTAProps = {
  heading: "Ready to Get Started?",
  primaryCTA: { label: "Get Started", href: "/", variant: "primary" },
  surface: "white",
  layout: "center",
};

export const mockCTAVariants: CTAProps[] = [
  mockCTAProps,
  { ...mockCTAProps, layout: "left", surface: "white" },
  {
    ...mockCTAProps,
    surface: "dark",
    primaryCTA: { label: "Get Started", href: "/" },
    secondaryCTA: { label: "Learn More", href: "/about" },
  },
  {
    ...mockCTAProps,
    surface: "accent",
    primaryCTA: { label: "Get Started", href: "/" },
  },
];
