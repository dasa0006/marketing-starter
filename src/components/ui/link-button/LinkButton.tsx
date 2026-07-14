"use client";

import { forwardRef } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { LinkButtonProps } from "./LinkButton.types";

const sizeClass: Record<string, string> = {
  sm: "link-btn-sm",
  md: "link-btn-md",
  lg: "link-btn-lg",
};

const variantClass: Record<string, string> = {
  primary: "link-btn-primary",
  secondary: "link-btn-secondary",
  accent: "link-btn-accent",
};

const surfaceClass: Record<string, string> = {
  white: "",
  subtle: "",
  dark: "link-btn-on-dark",
  accent: "link-btn-on-accent",
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
          "link-btn",
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
