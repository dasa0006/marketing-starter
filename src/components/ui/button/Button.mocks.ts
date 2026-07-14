import type { ButtonProps } from "./Button.types";

export const mockButtonProps: ButtonProps = {
  children: "Button",
  variant: "primary",
  size: "md",
};

export const mockButtonVariants: ButtonProps[] = [
  { children: "Primary", variant: "primary", size: "md" },
  { children: "Secondary", variant: "secondary", size: "md" },
  { children: "Accent", variant: "accent", size: "md" },
  { children: "Transparent", variant: "transparent", size: "md" },
  { children: "Ghost", variant: "ghost", size: "md" },
];

export const mockButtonSizes: ButtonProps[] = [
  { children: "Small", variant: "primary", size: "sm" },
  { children: "Medium", variant: "primary", size: "md" },
  { children: "Large", variant: "primary", size: "lg" },
];
