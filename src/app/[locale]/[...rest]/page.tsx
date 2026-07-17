import { notFound } from "next/navigation";

/**
 * Catch-all route — matches any path under `[locale]/` that isn't handled by
 * an explicit page.
 *
 * Calls `notFound()` to trigger the nearest `not-found.tsx` boundary.
 * No `generateStaticParams` (catch-all routes excluded per implementation
 * plan).
 */
export default function CatchAllPage() {
  notFound();
}
