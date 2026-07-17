import { test, expect } from "@playwright/test";

test.describe("Locale switching", () => {
  test("switches from English to Danish via locale switcher", async ({
    page,
  }) => {
    await page.goto("/en");

    // Verify initial English content
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Build Better Marketing Sites",
      })
    ).toBeVisible();

    // Switch locale to Danish using the select element
    const localeSelect = page.getByRole("combobox", {
      name: "Select language",
    });
    await localeSelect.selectOption("da");

    // Wait for navigation to complete — URL should now contain /da
    await expect(page).toHaveURL(/\/da(?:\/|$)/);

    // Verify page now shows Danish content
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Byg Bedre Marketingssider",
      })
    ).toBeVisible();
  });

  test("switches from Danish to English via locale switcher", async ({
    page,
  }) => {
    await page.goto("/da");

    // Verify initial Danish content
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Byg Bedre Marketingssider",
      })
    ).toBeVisible();

    // Switch locale to English
    const localeSelect = page.getByRole("combobox", {
      name: "Select language",
    });
    await localeSelect.selectOption("en");

    // Wait for navigation to complete — URL should now contain /en
    await expect(page).toHaveURL(/\/en(?:\/|$)/);

    // Verify page now shows English content
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Build Better Marketing Sites",
      })
    ).toBeVisible();
  });
});
