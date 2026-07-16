import { test, expect } from "@playwright/test";

test("homepage renders successfully", async ({ page }) => {
  await page.goto("/");

  // Verify the page loaded without error — check for the hero heading
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
