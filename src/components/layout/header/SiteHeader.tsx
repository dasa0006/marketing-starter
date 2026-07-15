"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/ui/Brand";
import { Button } from "@/components/ui/button/Button";
import { ToggleMode } from "@/components/ui/toggle-mode/ToggleMode";
import { LocaleSwitcher } from "@/components/ui/locale-switcher/LocaleSwitcher";
import { mainNavLinks, headerCTAs } from "@/lib/config/navigation";
import { track } from "@/lib/events";
import type { NavLink } from "@/lib/config/navigation";
import type { HeaderProps } from "./SiteHeader.types";
import { MobileDrawer } from "./MobileDrawer";

/**
 * Sticky site header with Brand, navigation links, CTAs, theme toggle,
 * locale switcher, and a mobile hamburger menu that opens MobileDrawer.
 *
 * Supports `solid` and `transparent` variants. When `transparent`, the
 * header gains a background + shadow after scrolling past a threshold.
 */
export function SiteHeader({
  className,
  variant = "solid",
  ...props
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Scroll-based background transition ─────────────────────────

  useEffect(() => {
    const threshold = 10;

    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    // Check initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Handlers ───────────────────────────────────────────────────

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleNavLinkClick = useCallback((link: NavLink) => {
    track.event("link_click", {
      url: link.href,
      label: link.label,
      newTab: false,
    });
  }, []);

  // ── Render ─────────────────────────────────────────────────────

  return (
    <>
      <header
        className={cn(
          "site-header",
          variant === "transparent"
            ? "site-header--transparent"
            : "site-header--solid",
          scrolled && variant === "transparent" && "site-header--scrolled",
          className
        )}
        {...props}
      >
        <div className="site-header-inner">
          {/* Left: Brand */}
          <div className="site-header-left">
            <Brand href="/" />
          </div>

          {/* Center: Desktop navigation links */}
          <nav className="site-header-center" aria-label="Main navigation">
            {mainNavLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="site-header-nav-link"
                onClick={() => handleNavLinkClick(link)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: CTAs, ToggleMode, LocaleSwitcher, Hamburger */}
          <div className="site-header-right">
            {/* Desktop-only items */}
            <div className="site-header-desktop-only">
              {headerCTAs.map((cta) => (
                <Button
                  key={cta.href}
                  variant="primary"
                  size="sm"
                  trackingLabel={cta.label}
                  onClick={() =>
                    track.event("link_click", {
                      url: cta.href,
                      label: cta.label,
                      newTab: false,
                    })
                  }
                >
                  {cta.label}
                </Button>
              ))}

              <ToggleMode />
              <LocaleSwitcher />
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="site-header-hamburger"
              onClick={toggleDrawer}
              aria-label={
                drawerOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={drawerOpen}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        navLinks={mainNavLinks}
      >
        <div>
          {headerCTAs.map((cta) => (
            <Button
              key={cta.href}
              variant="primary"
              size="sm"
              trackingLabel={cta.label}
              onClick={() => {
                track.event("link_click", {
                  url: cta.href,
                  label: cta.label,
                  newTab: false,
                });
                closeDrawer();
              }}
            >
              {cta.label}
            </Button>
          ))}
          <ToggleMode />
          <LocaleSwitcher />
        </div>
      </MobileDrawer>
    </>
  );
}
