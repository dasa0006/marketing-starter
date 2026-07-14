"use client";

import { forwardRef } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { LinkButtonProps } from "./LinkButton.types";

const sizeClass: Record<string, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

const variantClass: Record<string, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
};

const surfaceClass: Record<string, string> = {
  white: "",
  subtle: "",
  dark: "btn-on-dark",
  accent: "btn-on-accent",
};

/**
 * A styled link that looks like a button, wrapping next-intl's `<Link>`
 * with variant/size presets and surface-aware colour adaptation.
 */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      surface = "white",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Link
        ref={ref}
        className={cn(
          "btn",
          variantClass[variant],
          sizeClass[size],
          surfaceClass[surface],
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

LinkButton.displayName = "LinkButton";
