import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Surface } from "@/lib/config/navigation";

export type LinkButtonVariant = "primary" | "secondary" | "accent";
export type LinkButtonSize = "sm" | "md" | "lg";

export interface LinkButtonProps extends Omit<
  ComponentProps<typeof Link>,
  "children"
> {
  /** Visual variant. */
  variant?: LinkButtonVariant;
  /** Size preset. */
  size?: LinkButtonSize;
  /** The background surface this link sits on — controls colour adaptation. */
  surface?: Surface;
  children: ReactNode;
}
