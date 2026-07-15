"use client";

import { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { track } from "@/lib/events";
import type { NavLink } from "@/lib/config/navigation";

interface MobileDrawerProps {
  /** Whether the drawer is open. */
  open: boolean;
  /** Callback to close the drawer. */
  onClose: () => void;
  /** Navigation links to render inside the drawer. */
  navLinks: NavLink[];
  /** Optional bottom content (e.g. CTA buttons, ToggleMode, LocaleSwitcher). */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Slide-in mobile navigation drawer.
 *
 * Slides in from the right with a semi-transparent backdrop. Traps focus,
 * locks body scroll, and closes on Escape or backdrop click.
 */
export function MobileDrawer({
  open,
  onClose,
  navLinks,
  children,
  className,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(drawerRef, open, onClose);
  useScrollLock(open);

  // Track menu open/close
  useEffect(() => {
    if (open) {
      track.event("menu_open", { menu: "mobile" });
    } else {
      track.event("menu_close", { menu: "mobile" });
    }
  }, [open]);

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleNavLinkClick = useCallback(
    (link: NavLink) => {
      track.event("link_click", {
        url: link.href,
        label: link.label,
        newTab: false,
      });
      onClose();
    },
    [onClose]
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "mobile-drawer-backdrop",
          open && "mobile-drawer-backdrop--open"
        )}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal={open}
        aria-label="Navigation menu"
        className={cn(
          "mobile-drawer",
          open && "mobile-drawer--open",
          className
        )}
      >
        <div className="mobile-drawer-header">
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <nav className="mobile-drawer-nav" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-drawer-nav-link"
              onClick={() => handleNavLinkClick(link)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {children && <div className="mobile-drawer-bottom">{children}</div>}
      </div>
    </>
  );
}
