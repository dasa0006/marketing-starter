"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button/Button";

/**
 * Root-level error boundary (outside locale context).
 *
 * Minimal fallback — no i18n, no providers. Only provides a retry button.
 * Errors in the root layout itself are not caught here (use `global-error.js`
 * for that).
 */
export default function RootError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={() => unstable_retry()}>Try again</Button>
    </div>
  );
}
