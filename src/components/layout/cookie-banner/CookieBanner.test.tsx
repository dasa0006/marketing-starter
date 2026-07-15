import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { ConsentProvider } from "@/components/providers/ConsentProvider";
import { createFakeStorage } from "@/lib/consent/storage";
import { CookieBanner } from "./CookieBanner";

// Load the actual messages so CookieBanner translations resolve
import customEn from "@/../messages/custom/en.json";
import baseEn from "@/../messages/base/en.json";

const messages = { ...baseEn, ...customEn };

function renderWithProviders(
  ui: React.ReactElement,
  consentStatus: "undecided" | "accepted" | "declined" = "undecided"
) {
  const storage = createFakeStorage(consentStatus);
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ConsentProvider storage={storage}>{ui}</ConsentProvider>
    </NextIntlClientProvider>
  );
}

describe("CookieBanner", () => {
  it("renders the banner when consent is undecided", () => {
    renderWithProviders(<CookieBanner />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not render when consent is accepted", () => {
    renderWithProviders(<CookieBanner />, "accepted");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not render when consent is declined", () => {
    renderWithProviders(<CookieBanner />, "declined");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the title from i18n", () => {
    renderWithProviders(<CookieBanner />);
    expect(screen.getByText("We use cookies")).toBeInTheDocument();
  });

  it("renders the description from i18n", () => {
    renderWithProviders(<CookieBanner />);
    expect(
      screen.getByText("This site uses cookies to improve your experience.")
    ).toBeInTheDocument();
  });

  it("renders Accept button with i18n label", () => {
    renderWithProviders(<CookieBanner />);
    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
  });

  it("renders Decline button with i18n label", () => {
    renderWithProviders(<CookieBanner />);
    expect(screen.getByRole("button", { name: "Decline" })).toBeInTheDocument();
  });

  it("calls accept() when Accept button is clicked", async () => {
    const storage = createFakeStorage();
    const acceptSpy = vi.spyOn(storage, "setConsent");

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ConsentProvider storage={storage}>
          <CookieBanner />
        </ConsentProvider>
      </NextIntlClientProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    await waitFor(() => {
      expect(acceptSpy).toHaveBeenCalledWith("accepted");
    });
  });

  it("calls decline() when Decline button is clicked", async () => {
    const storage = createFakeStorage();
    const declineSpy = vi.spyOn(storage, "setConsent");

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ConsentProvider storage={storage}>
          <CookieBanner />
        </ConsentProvider>
      </NextIntlClientProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Decline" }));

    await waitFor(() => {
      expect(declineSpy).toHaveBeenCalledWith("declined");
    });
  });

  it("renders a privacy policy link with correct href", () => {
    renderWithProviders(<CookieBanner />);
    const privacyLink = screen.getByRole("link", { name: "Privacy Policy" });
    expect(privacyLink).toHaveAttribute("href", "/privacy");
  });

  it("applies the base 'cookie-banner' class", () => {
    renderWithProviders(<CookieBanner />);
    const banner = screen.getByRole("dialog");
    expect(banner.className).toContain("cookie-banner");
  });

  it("applies the 'slide-up' class after mount (animation trigger)", async () => {
    renderWithProviders(<CookieBanner />);
    const banner = screen.getByRole("dialog");
    await waitFor(() => {
      expect(banner.className).toContain("slide-up");
    });
  });

  it("forwards additional className", () => {
    renderWithProviders(<CookieBanner className="my-custom-class" />);
    const banner = screen.getByRole("dialog");
    expect(banner.className).toContain("my-custom-class");
  });

  it("forwards extra HTML attributes", () => {
    renderWithProviders(<CookieBanner aria-label="Cookie consent" />);
    const banner = screen.getByRole("dialog");
    expect(banner).toHaveAttribute("aria-label", "Cookie consent");
  });

  it("hides the banner after accepting", async () => {
    renderWithProviders(<CookieBanner />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("hides the banner after declining", async () => {
    renderWithProviders(<CookieBanner />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Decline" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
