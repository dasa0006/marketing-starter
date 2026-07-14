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
 * in light mode (to switch to dark). Falls back to Sun when theme is
 * not yet resolved (SSR safety).
 */
export function ToggleMode({ className }: ToggleModeProps) {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-[var(--color-foreground)] transition-colors hover:bg-[var(--border-light)] focus-visible:outline-2 focus-visible:outline-[var(--surface-accent)]",
        className
      )}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={20} aria-hidden="true" />
      ) : (
        <Moon size={20} aria-hidden="true" />
      )}
    </button>
  );
}
