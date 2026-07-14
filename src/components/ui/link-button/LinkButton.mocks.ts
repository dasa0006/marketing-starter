import type { LinkButtonProps } from "./LinkButton.types";

export const mockLinkButtonProps: LinkButtonProps = {
  children: "Get Started",
  href: "/",
  variant: "primary",
  size: "md",
  surface: "white",
};

export const mockLinkButtonSurfaces: LinkButtonProps[] = [
  { children: "On White", href: "/", variant: "primary", surface: "white" },
  { children: "On Dark", href: "/", variant: "primary", surface: "dark" },
  { children: "On Accent", href: "/", variant: "primary", surface: "accent" },
];
