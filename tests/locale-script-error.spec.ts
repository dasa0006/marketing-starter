import { test, expect } from "@playwright/test";

test.describe("Locale switch — no script-tag console errors", () => {
  test("initial page load does NOT produce script-tag error", async ({
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

    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    const scriptTagErrors = consoleErrors.filter(
      (e) =>
        e.includes("script tag") ||
        e.includes("Scripts inside React components") ||
        e.includes("template tag")
    );

    expect(scriptTagErrors).toHaveLength(0);
  });

  test("switching locale does NOT produce script-tag error", async ({
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

    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    // Clear initial errors (if any) to focus on locale-switch errors
    consoleErrors.length = 0;

    // Switch locale to Danish via the UI dropdown (client-side navigation)
    const localeSelect = page
      .getByRole("banner")
      .getByRole("combobox", { name: "Select language" });
    await localeSelect.selectOption("da");

    await expect(page).toHaveURL(/\/da(?:\/|$)/);
    await page.waitForLoadState("networkidle");

    const scriptTagErrors = consoleErrors.filter(
      (e) =>
        e.includes("script tag") ||
        e.includes("Scripts inside React components") ||
        e.includes("template tag")
    );

    expect(scriptTagErrors).toHaveLength(0);
  });

  test("client-side navigation between pages on same locale does NOT produce script-tag error", async ({
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

    await page.goto("/"); // default locale (en) has no prefix with "as-needed"
    await page.waitForLoadState("networkidle");

    // Clear initial errors (if any)
    consoleErrors.length = 0;

    // Click a nav link to trigger client-side navigation within same locale
    await page.getByRole("link", { name: "About" }).first().click();
    await page.waitForLoadState("networkidle");

    // Verify we navigated — English locale so no prefix
    await expect(page).toHaveURL(/\/about(?:\/|$)/);

    const scriptTagErrors = consoleErrors.filter(
      (e) =>
        e.includes("script tag") ||
        e.includes("Scripts inside React components") ||
        e.includes("template tag")
    );

    expect(scriptTagErrors).toHaveLength(0);
  });
});
