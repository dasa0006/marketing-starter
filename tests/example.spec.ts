import { test, expect } from "@playwright/test";

test("homepage renders successfully", async ({ page }) => {
  await page.goto("/");

  // Verify the page loaded without error — check for a known heading
  await expect(
    page.getByText("To get started, edit the page.tsx file.")
  ).toBeVisible();
});
