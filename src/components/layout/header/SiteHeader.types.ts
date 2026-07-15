import type { HTMLAttributes } from "react";

/** Visual variant for the header background. */
export type HeaderVariant = "solid" | "transparent";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  /** Visual variant. "transparent" allows hero content to show through.
   *  "solid" always shows the background colour. Defaults to "solid". */
  variant?: HeaderVariant;
}
