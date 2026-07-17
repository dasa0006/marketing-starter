/**
 * Loading UI shown during page transitions within the `[locale]` segment.
 *
 * Renders a simple centered spinner. This is a Server Component by default
 * (no `"use client"` directive needed).
 */
export default function LocaleLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
