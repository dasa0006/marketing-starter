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
    src: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23eee' width='400' height='300'/%3E%3C/svg%3E",
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
    image: {
      src: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23eee' width='400' height='300'/%3E%3C/svg%3E",
      alt: "Hero illustration",
    },
  },
];

export const mockHeroSurfaces: HeroProps[] = [
  { ...mockHeroProps, surface: "white" },
  { ...mockHeroProps, surface: "subtle" },
  { ...mockHeroProps, surface: "dark" },
  { ...mockHeroProps, surface: "accent" },
];
