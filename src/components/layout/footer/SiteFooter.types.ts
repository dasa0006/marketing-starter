import type { HTMLAttributes } from "react";

/** A single social-media link in the footer. */
export interface SocialLink {
  label: string;
  href: string;
  /** Lucide icon component — the consumer imports and passes the element. */
  icon: React.ReactNode;
}

export interface SiteFooterProps extends HTMLAttributes<HTMLElement> {
  /** Override default social links. */
  socialLinks?: SocialLink[];
}
