"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonProps } from "./Button.types";
import { track } from "@/lib/events";

const sizeClass: Record<string, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

const variantClass: Record<string, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  transparent: "btn-transparent",
  ghost: "btn-ghost",
};

/**
 * A presentational button with variant/size presets, loading state,
 * icon slots, disabled state, focus-visible ring, and tracking support.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      trackingLabel,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
      if (onClick) {
        onClick(event);
      }

      if (trackingLabel && !isDisabled) {
        track.event("button_click", {
          label: trackingLabel,
          variant,
        });
      }
    };

    return (
      <button
        ref={ref}
        className={cn("btn", variantClass[variant], sizeClass[size], className)}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        {children}
        {!loading && rightIcon ? (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";
