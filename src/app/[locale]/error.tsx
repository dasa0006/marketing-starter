"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button/Button";

/**
 * Locale-scoped error boundary.
 *
 * Shown when an error is thrown within the `[locale]` segment or any of its
 * children (pages, nested layouts). Reads translated messages from the Error
 * namespace.
 *
 * The `unstable_retry` prop re-fetches and re-renders the errored segment.
 */
export default function LocaleError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground max-w-md">{t("description")}</p>
      <Button onClick={() => unstable_retry()}>{t("retry")}</Button>
    </div>
  );
}
