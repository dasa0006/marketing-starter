import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { ConsentProvider } from "@/components/providers/ConsentProvider";
import { SiteFooter } from "./SiteFooter";

// Load the actual messages so SiteFooter translations resolve
import customEn from "@/../messages/custom/en.json";
import baseEn from "@/../messages/base/en.json";

const messages = { ...baseEn, ...customEn };

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ConsentProvider>{ui}</ConsentProvider>
    </NextIntlClientProvider>
  );
}

describe("SiteFooter", () => {
  it("renders a <footer> element", () => {
    renderWithProviders(<SiteFooter />);
    const footer = document.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("applies the base 'site-footer' class", () => {
    renderWithProviders(<SiteFooter />);
    const footer = document.querySelector("footer");
    expect(footer?.className).toContain("site-footer");
  });

  it("renders the Brand component", () => {
    renderWithProviders(<SiteFooter />);
    // Brand renders the site name from SITE_CONFIG
    expect(document.querySelector("footer")?.textContent).toContain(
      "Marketing Starter"
    );
  });

  it("renders the tagline from i18n", () => {
    renderWithProviders(<SiteFooter />);
    expect(
      screen.getByText("Build better marketing sites.")
    ).toBeInTheDocument();
  });

  it("renders i18n-aware column headings", () => {
    renderWithProviders(<SiteFooter />);
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(screen.getByText("Social")).toBeInTheDocument();
  });

  it("renders main navigation links from config", () => {
    renderWithProviders(<SiteFooter />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders legal links from config", () => {
    renderWithProviders(<SiteFooter />);
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Cookie Policy")).toBeInTheDocument();
  });

  it("renders the ManageCookiesButton", () => {
    renderWithProviders(<SiteFooter />);
    expect(
      screen.getByRole("button", { name: "Manage Cookies" })
    ).toBeInTheDocument();
  });

  it("renders default social links with icons", () => {
    renderWithProviders(<SiteFooter />);
    // Each social link should be an <a> with the label text
    expect(screen.getByText("GitHub").closest("a")).toHaveAttribute(
      "href",
      "https://github.com"
    );
  });

  it("renders the copyright line with the current year", () => {
    renderWithProviders(<SiteFooter />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it("renders a nav landmark for each link section", () => {
    renderWithProviders(<SiteFooter />);
    const navs = document.querySelectorAll("footer nav");
    expect(navs.length).toBeGreaterThanOrEqual(2);
  });

  it("forwards additional className", () => {
    renderWithProviders(<SiteFooter className="my-custom-class" />);
    const footer = document.querySelector("footer");
    expect(footer?.className).toContain("my-custom-class");
  });

  it("forwards extra HTML attributes", () => {
    renderWithProviders(<SiteFooter aria-label="Site footer" />);
    const footer = document.querySelector("footer");
    expect(footer).toHaveAttribute("aria-label", "Site footer");
  });

  it("allows overriding social links via props", () => {
    const customLinks = [
      {
        label: "Custom",
        href: "https://custom.com",
        icon: <span data-testid="custom-icon">*</span>,
      },
    ];
    renderWithProviders(<SiteFooter socialLinks={customLinks} />);
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});
