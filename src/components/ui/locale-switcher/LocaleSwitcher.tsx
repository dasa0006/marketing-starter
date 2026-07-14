"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LocaleSwitcherProps {
  className?: string;
}

/**
 * Toggle between available locales without a full page reload.
 *
 * Renders a styled `<select>` with each locale as an option.
 * Uses `useTransition` to show pending state during navigation.
 */
export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <select
      className={cn(
        "appearance-none cursor-pointer rounded-md border border-[var(--border-light)] bg-transparent px-2 py-1 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--surface-accent)] focus-visible:outline-2 focus-visible:outline-[var(--surface-accent)]",
        isPending && "opacity-50",
        className
      )}
      value={currentLocale}
      onChange={handleChange}
      aria-label="Select language"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale === "en" ? "EN" : "DA"}
        </option>
      ))}
    </select>
  );
}
