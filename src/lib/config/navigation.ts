import { ABOUT, PRIVACY, COOKIE_POLICY } from "@/lib/config/routes";

// ── Types ─────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderCTA {
  label: string;
  href: string;
}

/**
 * A surface is the background colour context a Section or Block sits on.
 *
 * - `"white"`   — light background, dark text
 * - `"subtle"`  — slightly off-white/light-grey, dark text
 * - `"dark"`    — dark background, light text
 * - `"accent"`  — brand accent background, light text
 */
export type Surface = "white" | "subtle" | "dark" | "accent";

// ── Navigation data ───────────────────────────────────────────────

export const mainNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: ABOUT },
];

export const headerCTAs: HeaderCTA[] = [];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: PRIVACY },
  { label: "Cookie Policy", href: COOKIE_POLICY },
];
