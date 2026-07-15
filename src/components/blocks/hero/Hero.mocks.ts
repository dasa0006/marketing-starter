import type { HeroProps } from "./Hero.types";

export const mockHeroProps: HeroProps = {
  heading: "Build Better Marketing Sites",
  subtitle:
    "A production-grade Next.js starter with i18n, theming, and block-based composable pages.",
  primaryCTA: { label: "Get Started", href: "/" },
  secondaryCTA: { label: "Learn More", href: "/about" },
  surface: "white",
  layout: "center",
};

export const mockHeroLeft: HeroProps = {
  ...mockHeroProps,
  layout: "left",
};

export const mockHeroSplit: HeroProps = {
  ...mockHeroProps,
  layout: "split",
  image: {
    src: "/file.svg",
    alt: "Hero illustration",
  },
};

export const mockHeroMinimal: HeroProps = {
  heading: "Simple Hero",
  surface: "white",
  layout: "center",
};

export const mockHeroVariants: HeroProps[] = [
  mockHeroProps,
  { ...mockHeroProps, layout: "left", surface: "white" },
  {
    ...mockHeroProps,
    layout: "center",
    surface: "dark",
    primaryCTA: { label: "Get Started", href: "/" },
    secondaryCTA: { label: "Learn More", href: "/about" },
  },
  {
    ...mockHeroProps,
    layout: "split",
    image: { src: "/file.svg", alt: "Hero illustration" },
  },
];

export const mockHeroSurfaces: HeroProps[] = [
  { ...mockHeroProps, surface: "white" },
  { ...mockHeroProps, surface: "subtle" },
  { ...mockHeroProps, surface: "dark" },
  { ...mockHeroProps, surface: "accent" },
];
