"use client";

import { useTranslations } from "next-intl";
import { Github, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/ui/Brand";
import { ManageCookiesButton } from "@/components/ui/ManageCookiesButton";
import { mainNavLinks, legalLinks } from "@/lib/config/navigation";
import type { SiteFooterProps, SocialLink } from "./SiteFooter.types";

const defaultSocialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: <Github size={20} aria-hidden="true" />,
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: <Twitter size={20} aria-hidden="true" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: <Linkedin size={20} aria-hidden="true" />,
  },
];

/**
 * Site footer with multi-column layout.
 *
 * Renders brand + tagline, navigation links (from config), legal links (from
 * config), social links, ManageCookiesButton, and copyright line.
 *
 * Responsive: stacks on mobile, CSS grid on desktop.
 */
export function SiteFooter({
  className,
  socialLinks = defaultSocialLinks,
  ...props
}: SiteFooterProps) {
  const t = useTranslations("SiteFooter");
  const year = new Date().getFullYear();

  return (
    <footer className={cn("site-footer", className)} {...props}>
      <div className="site-footer-grid">
        {/* Brand + tagline column */}
        <div className="site-footer-brand">
          <Brand href="/" />
          <p className="site-footer-tagline">{t("tagline")}</p>
        </div>

        {/* Main navigation column */}
        <div className="site-footer-nav">
          <h3 className="site-footer-nav-title">{t("navHeading")}</h3>
          <nav aria-label={t("navHeading")}>
            <ul className="site-footer-links">
              {mainNavLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="site-footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Legal links column */}
        <div className="site-footer-nav">
          <h3 className="site-footer-nav-title">{t("legalHeading")}</h3>
          <nav aria-label={t("legalHeading")}>
            <ul className="site-footer-links">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="site-footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Social links column */}
        <div className="site-footer-nav">
          <h3 className="site-footer-nav-title">{t("socialHeading")}</h3>
          <div className="site-footer-social">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="site-footer-social-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                {link.icon}
                <span className="site-footer-social-label">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="site-footer-bottom">
        <p className="site-footer-copyright">
          &copy; {year} Marketing Starter. {t("copyright")}
        </p>
        <ManageCookiesButton />
      </div>
    </footer>
  );
}
