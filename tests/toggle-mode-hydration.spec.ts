import { test, expect } from "@playwright/test";

/**
 * Hydration mismatch: ToggleMode uses `theme` from next-themes' useTheme().
 *
 * SSR renders with `theme = undefined` (no localStorage access) → Moon icon.
 * Client hydrates with `theme = "dark"` (from localStorage) → Sun icon.
 *
 * This test seeds localStorage before any page script runs, then checks
 * that no React hydration error was logged.
 */
test.describe("ToggleMode hydration", () => {
  test("no hydration error when theme is stored as dark", async ({
    context,
    page,
  }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    // Seed localStorage *before* the page's scripts run — mimics a
    // returning visitor who previously toggled to dark mode.
    await context.addInitScript(() => {
      localStorage.setItem("theme", "dark");
    });

    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    const hydrationErrors = consoleErrors.filter(
      (e) => e.includes("Hydration failed") || e.includes("did not match")
    );

    expect(hydrationErrors).toHaveLength(0);
  });
});
