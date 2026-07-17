import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders Hero heading, FeatureGrid heading, and CTA heading", async ({
    page,
  }) => {
    await page.goto("/en");

    // ── Hero ─────────────────────────────────────────────────────
    const heroHeading = page.getByRole("heading", {
      level: 1,
      name: "Build Better Marketing Sites",
    });
    await expect(heroHeading).toBeVisible();

    // ── FeatureGrid ──────────────────────────────────────────────
    const featuresHeading = page.getByRole("heading", {
      level: 2,
      name: "Everything You Need",
    });
    await expect(featuresHeading).toBeVisible();

    // ── CTA ──────────────────────────────────────────────────────
    const ctaHeading = page.getByRole("heading", {
      level: 2,
      name: "Ready to Get Started?",
    });
    await expect(ctaHeading).toBeVisible();
  });

  test("renders CTA action links", async ({ page }) => {
    await page.goto("/en");

    const getStarted = page.getByRole("link", { name: "Get Started" });
    await expect(getStarted.first()).toBeVisible();

    const learnMore = page.getByRole("link", { name: "Learn More" });
    await expect(learnMore.first()).toBeVisible();
  });
});
