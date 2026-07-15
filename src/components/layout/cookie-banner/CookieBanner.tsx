"use client";

import { useEffect, useState, type HTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import { useConsent } from "@/components/providers/ConsentProvider";
import { PRIVACY } from "@/lib/config/routes";
import { cn } from "@/lib/utils";

/**
 * Fixed-bottom cookie consent banner with slide-up animation.
 *
 * - Only renders when consent status is "undecided".
 * - Provides Accept / Decline buttons that persist the user's choice.
 * - Includes a link to the Privacy Policy page.
 * - Slide-up animation (transform + opacity) triggers on mount.
 */
export function CookieBanner({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { status, accept, decline } = useConsent();
  const t = useTranslations("CookieBanner");
  const legal = useTranslations("Legal");
  const [mounted, setMounted] = useState(false);

  // Trigger slide-up animation on mount via requestAnimationFrame so the
  // browser has a chance to paint the initial position before the transition.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Don't render anything when the user has already made a choice.
  if (status !== "undecided") return null;

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className={cn("cookie-banner", mounted && "slide-up", className)}
      {...props}
    >
      <div className="cookie-banner-content">
        <p className="cookie-banner-title">{t("title")}</p>
        <p className="cookie-banner-description">{t("description")}</p>
        <div className="cookie-banner-actions">
          <button
            type="button"
            className="cookie-banner-decline"
            onClick={decline}
          >
            {t("decline")}
          </button>
          <button
            type="button"
            className="cookie-banner-accept"
            onClick={accept}
          >
            {t("accept")}
          </button>
        </div>
        <a href={PRIVACY} className="cookie-banner-privacy-link">
          {legal("privacyPolicy")}
        </a>
      </div>
    </div>
  );
}
