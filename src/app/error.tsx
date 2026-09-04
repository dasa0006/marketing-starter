"use client";

import { useEffect } from "react";

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
      <p className="max-w-md text-slate-500">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="rounded-md bg-slate-900 px-4 py-2 text-white transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
