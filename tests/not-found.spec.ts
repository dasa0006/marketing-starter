import { test, expect } from "@playwright/test";

test.describe("404 Not Found", () => {
  test("shows 404 page for invalid routes", async ({ page }) => {
    await page.goto("/en/some-nonexistent-page");

    // The catch-all route renders the locale-scoped not-found page
    await expect(page.getByText("404")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Page Not Found" })
    ).toBeVisible();
    await expect(
      page.getByText(
        "The page you are looking for doesn't exist or has been moved."
      )
    ).toBeVisible();
  });

  test("provides a link back to the homepage", async ({ page }) => {
    await page.goto("/en/this-does-not-exist");

    // next-intl Link renders "/" for the default locale (en)
    const backLink = page.getByRole("link", { name: "Back to Home" });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute("href", "/");
  });
});
