import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigates from homepage to About page via nav link", async ({
    page,
  }) => {
    await page.goto("/en");

    // Click the "About" link in the main navigation
    const aboutLink = page
      .getByRole("navigation", {
        name: "Main navigation",
      })
      .getByRole("link", { name: "About" });
    await aboutLink.click();

    // Verify page content — "Our Story" section is rendered
    await expect(
      page.getByRole("heading", { name: "Our Story" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Our Mission" })
    ).toBeVisible();
  });

  test("navigates to About page via Hero secondary CTA", async ({ page }) => {
    await page.goto("/en");

    // "Learn More" is the secondary CTA on Hero, linking to /about
    const learnMore = page.getByRole("link", { name: "Learn More" });
    await learnMore.first().click();

    // Verify page content
    await expect(
      page.getByRole("heading", { name: "Our Story" })
    ).toBeVisible();
  });
});
