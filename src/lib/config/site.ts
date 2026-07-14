import { env } from "@/lib/env";

const DEFAULT_NAME = "Marketing Starter";
const DEFAULT_DESCRIPTION =
  "A production-grade Next.js marketing site template";

/**
 * Site-wide configuration.
 *
 * This is an **override seam** — per-project edits are expected here.
 * The validation guard below warns if default values are still in place.
 */
export const SITE_CONFIG = {
  name: DEFAULT_NAME,
  description: DEFAULT_DESCRIPTION,
  url: env.NEXT_PUBLIC_SITE_URL,
  timezone: "Europe/Copenhagen",
  locale: "en",
} as const;

// ── Validation guard ──────────────────────────────────────────────
// Throw in production if defaults haven't been customised — the
// template values are placeholders and should be changed per project.
if (process.env.NODE_ENV === "production") {
  if (SITE_CONFIG.name === DEFAULT_NAME) {
    throw new Error(
      "SITE_CONFIG.name is still the default value. " +
        "Edit src/lib/config/site.ts to set your site name."
    );
  }
  if (SITE_CONFIG.description === DEFAULT_DESCRIPTION) {
    throw new Error(
      "SITE_CONFIG.description is still the default value. " +
        "Edit src/lib/config/site.ts to set your site description."
    );
  }
}
