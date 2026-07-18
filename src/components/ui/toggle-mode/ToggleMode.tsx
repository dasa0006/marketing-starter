"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleModeProps {
  className?: string;
}

/**
 * Dark / light mode toggle using `next-themes`.
 *
 * Renders a Sun icon in dark mode (to switch to light) and a Moon icon
 * in light mode (to switch to dark). Uses CSS `dark:` variants to toggle
 * icon visibility — both SVGs are always in the DOM, avoiding hydration
 * mismatches between SSR (theme-unaware) and client (theme-aware).
 *
 * The injected next-themes `<script>` sets the `dark` class on `<html>`
 * before React hydrates, so the correct icon is visible from the start.
 */
export function ToggleMode({ className }: ToggleModeProps) {
  const { setTheme, resolvedTheme } = useTheme();

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-[var(--color-foreground)] transition-colors hover:bg-[var(--border-light)] focus-visible:outline-2 focus-visible:outline-[var(--surface-accent)]",
        className
      )}
      onClick={toggle}
      aria-label="Toggle theme"
    >
      <Sun size={20} aria-hidden="true" className="hidden dark:block" />
      <Moon size={20} aria-hidden="true" className="dark:hidden" />
    </button>
  );
}
