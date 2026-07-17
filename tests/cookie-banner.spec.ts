import { test, expect } from "@playwright/test";

test.describe("Cookie banner", () => {
  test.beforeEach(async ({ context }) => {
    // Clear any existing consent cookie so the banner is visible
    await context.clearCookies();
  });

  test("appears on first visit when no consent is saved", async ({ page }) => {
    await page.goto("/en");

    const banner = page.getByRole("dialog", { name: "We use cookies" });
    await expect(banner).toBeVisible();
    await expect(
      page.getByText("This site uses cookies to improve your experience.")
    ).toBeVisible();
  });

  test("hides after accepting cookies", async ({ page, context }) => {
    await page.goto("/en");

    const banner = page.getByRole("dialog", { name: "We use cookies" });
    await expect(banner).toBeVisible();

    await page.getByRole("button", { name: "Accept" }).click();

    // Banner should disappear
    await expect(banner).not.toBeVisible();

    // Consent cookie should be set
    const cookies = await context.cookies();
    const consentCookie = cookies.find((c) => c.name === "consent-status");
    expect(consentCookie).toBeDefined();
    expect(consentCookie?.value).toBe("accepted");
  });

  test("hides after declining cookies", async ({ page, context }) => {
    await page.goto("/en");

    const banner = page.getByRole("dialog", { name: "We use cookies" });
    await expect(banner).toBeVisible();

    await page.getByRole("button", { name: "Decline" }).click();

    // Banner should disappear
    await expect(banner).not.toBeVisible();

    // Consent cookie should be set to declined
    const cookies = await context.cookies();
    const consentCookie = cookies.find((c) => c.name === "consent-status");
    expect(consentCookie).toBeDefined();
    expect(consentCookie?.value).toBe("declined");
  });

  test("does not reappear after accepting and reloading the page", async ({
    page,
  }) => {
    // First visit: accept cookies
    await page.goto("/en");
    const banner = page.getByRole("dialog", { name: "We use cookies" });
    await expect(banner).toBeVisible();
    await page.getByRole("button", { name: "Accept" }).click();
    await expect(banner).not.toBeVisible();

    // Reload: banner should stay hidden (cookie persists across requests)
    await page.reload();
    await expect(
      page.getByRole("dialog", { name: "We use cookies" })
    ).not.toBeVisible();
  });

  test("renders privacy policy link in the banner", async ({ page }) => {
    await page.goto("/en");

    const banner = page.getByRole("dialog", { name: "We use cookies" });
    await expect(banner).toBeVisible();

    const privacyLink = banner.getByRole("link", { name: "Privacy Policy" });
    await expect(privacyLink).toBeVisible();
    await expect(privacyLink).toHaveAttribute("href", "/privacy");
  });
});
