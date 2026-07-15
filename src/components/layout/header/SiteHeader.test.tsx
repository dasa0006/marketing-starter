import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { SiteHeader } from "./SiteHeader";
import { MobileDrawer } from "./MobileDrawer";
import { mainNavLinks } from "@/lib/config/navigation";
import { track } from "@/lib/events";

// Mock the track module
vi.mock("@/lib/events", () => ({
  track: {
    event: vi.fn(),
  },
}));

// Mock next-themes useTheme
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next-intl hooks while keeping the real provider
vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();
  return {
    ...actual,
    useLocale: () => "en",
    useTranslations: () => (key: string) => key,
  };
});

// Mock next-intl/navigation
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

// Load messages
import baseEn from "@/../messages/base/en.json";

const messages = { ...baseEn };

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        {ui}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

describe("SiteHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a <header> element", () => {
    renderWithProviders(<SiteHeader />);
    const header = document.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  it("applies the base 'site-header' class", () => {
    renderWithProviders(<SiteHeader />);
    const header = document.querySelector("header");
    expect(header?.className).toContain("site-header");
  });

  it("renders the Brand component", () => {
    renderWithProviders(<SiteHeader />);
    expect(document.querySelector("header")?.textContent).toContain(
      "Marketing Starter"
    );
  });

  it("renders navigation links from config", () => {
    renderWithProviders(<SiteHeader />);
    for (const link of mainNavLinks) {
      const links = screen.getAllByText(link.label);
      // Links appear in both header nav and mobile drawer
      expect(links.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders ToggleMode and LocaleSwitcher", () => {
    renderWithProviders(<SiteHeader />);
    // LocaleSwitcher renders as a select - appears in both header and drawer
    const selects = screen.getAllByLabelText("Select language");
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the hamburger button", () => {
    renderWithProviders(<SiteHeader />);
    expect(screen.getByLabelText("Open navigation menu")).toBeInTheDocument();
  });

  it("applies solid variant class by default", () => {
    renderWithProviders(<SiteHeader />);
    const header = document.querySelector("header");
    expect(header?.className).toContain("site-header--solid");
  });

  it("applies transparent variant class when specified", () => {
    renderWithProviders(<SiteHeader variant="transparent" />);
    const header = document.querySelector("header");
    expect(header?.className).toContain("site-header--transparent");
  });

  it("forwards additional className", () => {
    renderWithProviders(<SiteHeader className="my-custom-class" />);
    const header = document.querySelector("header");
    expect(header?.className).toContain("my-custom-class");
  });

  it("forwards extra HTML attributes", () => {
    renderWithProviders(<SiteHeader aria-label="Site header" />);
    const header = document.querySelector("header");
    expect(header).toHaveAttribute("aria-label", "Site header");
  });

  it("tracks link_click when clicking a desktop nav link", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteHeader />);

    // Use getAllByText and pick the first (desktop header nav link)
    const homeLinks = screen.getAllByText("Home");
    const desktopHomeLink = homeLinks[0]; // Desktop link comes first in DOM
    await user.click(desktopHomeLink);

    expect(track.event).toHaveBeenCalledWith("link_click", {
      url: "/",
      label: "Home",
      newTab: false,
    });
  });

  it("opens the drawer when hamburger is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteHeader />);

    const hamburger = screen.getByLabelText("Open navigation menu");
    await user.click(hamburger);

    // After clicking, the drawer should be visible
    const drawer = document.querySelector(".mobile-drawer");
    expect(drawer?.className).toContain("mobile-drawer--open");
  });

  it("closes the drawer when close button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteHeader />);

    // Open drawer
    const hamburger = screen.getByLabelText("Open navigation menu");
    await user.click(hamburger);

    // Use the drawer-specific close button (X icon in drawer header)
    const closeButtons = screen.getAllByLabelText("Close navigation menu");
    // The drawer close button (X icon) has class "mobile-drawer-close"
    const drawerClose = closeButtons.find(
      (btn) => btn.className === "mobile-drawer-close"
    );
    expect(drawerClose).toBeDefined();
    if (drawerClose) {
      await user.click(drawerClose);
    }

    const drawer = document.querySelector(".mobile-drawer");
    expect(drawer?.className).not.toContain("mobile-drawer--open");
  });

  it("tracks menu_open when drawer opens", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteHeader />);

    const hamburger = screen.getByLabelText("Open navigation menu");
    await user.click(hamburger);

    expect(track.event).toHaveBeenCalledWith("menu_open", {
      menu: "mobile",
    });
  });

  it("tracks menu_close when drawer closes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteHeader />);

    // Open drawer
    const hamburger = screen.getByLabelText("Open navigation menu");
    await user.click(hamburger);

    // Clear the open tracking call
    vi.clearAllMocks();

    // Close drawer via drawer close button
    const closeButtons = screen.getAllByLabelText("Close navigation menu");
    const drawerClose = closeButtons.find(
      (btn) => btn.className === "mobile-drawer-close"
    );
    expect(drawerClose).toBeDefined();
    if (drawerClose) {
      await user.click(drawerClose);
    }

    expect(track.event).toHaveBeenCalledWith("menu_close", {
      menu: "mobile",
    });
  });
});

describe("MobileDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders navigation links", () => {
    renderWithProviders(
      <MobileDrawer open={true} onClose={() => {}} navLinks={mainNavLinks} />
    );

    for (const link of mainNavLinks) {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    }
  });

  it("does not render when closed", () => {
    renderWithProviders(
      <MobileDrawer open={false} onClose={() => {}} navLinks={mainNavLinks} />
    );

    const drawer = document.querySelector(".mobile-drawer");
    expect(drawer?.className).not.toContain("mobile-drawer--open");
  });

  it("renders children in the bottom section", () => {
    renderWithProviders(
      <MobileDrawer open={true} onClose={() => {}} navLinks={mainNavLinks}>
        <div data-testid="extra-content">Extra</div>
      </MobileDrawer>
    );

    expect(screen.getByTestId("extra-content")).toBeInTheDocument();
  });

  it("closes on backdrop click", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <MobileDrawer open={true} onClose={onClose} navLinks={mainNavLinks} />
    );

    const backdrop = document.querySelector(".mobile-drawer-backdrop");
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      await user.click(backdrop);
    }

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("tracks menu_open when opened", () => {
    renderWithProviders(
      <MobileDrawer open={true} onClose={() => {}} navLinks={mainNavLinks} />
    );

    expect(track.event).toHaveBeenCalledWith("menu_open", {
      menu: "mobile",
    });
  });
});
