import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "transparent"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant — controls colour scheme. */
  variant?: ButtonVariant;
  /** Size preset. */
  size?: ButtonSize;
  /** Show a loading spinner and disable interaction. */
  loading?: boolean;
  /** Icon or element placed before the label. */
  leftIcon?: ReactNode;
  /** Icon or element placed after the label. */
  rightIcon?: ReactNode;
  /**
   * When provided, fires a `button_click` tracking event on click.
   * The label value is sent as the event label.
   */
  trackingLabel?: string;
}
