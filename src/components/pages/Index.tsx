"use client";

import { useTranslations } from "next-intl";
import { Zap, Shield, Globe, BarChart3, Users, Bell } from "lucide-react";
import { Hero } from "@/components/blocks/hero/Hero";
import { FeatureGrid } from "@/components/blocks/feature-grid/FeatureGrid";
import type { FeatureItem } from "@/components/blocks/feature-grid/FeatureGrid.types";
import { CTA } from "@/components/blocks/cta/CTA";
import { Section } from "@/components/layout/section/Section";

/**
 * Index page composition component.
 *
 * Combines Hero, FeatureGrid, and CTA blocks to form the landing page.
 * Messages are read from the `Hero`, `FeatureGrid`, and `CTA` namespaces.
 */
export default function Index() {
  const t = useTranslations();

  const features: FeatureItem[] = [
    {
      icon: Zap,
      heading: t("FeatureGrid.lightning.heading"),
      description: t("FeatureGrid.lightning.description"),
    },
    {
      icon: Shield,
      heading: t("FeatureGrid.secure.heading"),
      description: t("FeatureGrid.secure.description"),
    },
    {
      icon: Globe,
      heading: t("FeatureGrid.globe.heading"),
      description: t("FeatureGrid.globe.description"),
    },
    {
      icon: BarChart3,
      heading: t("FeatureGrid.analytics.heading"),
      description: t("FeatureGrid.analytics.description"),
    },
    {
      icon: Users,
      heading: t("FeatureGrid.team.heading"),
      description: t("FeatureGrid.team.description"),
    },
    {
      icon: Bell,
      heading: t("FeatureGrid.notifications.heading"),
      description: t("FeatureGrid.notifications.description"),
    },
  ];

  return (
    <>
      <Hero
        heading={t("Hero.heading")}
        subtitle={t("Hero.subtitle")}
        primaryCTA={{ label: t("Hero.primaryCTA"), href: "/" }}
        secondaryCTA={{ label: t("Hero.secondaryCTA"), href: "/about" }}
      />

      <Section surface="white">
        <FeatureGrid
          heading={t("FeatureGrid.heading")}
          description={t("FeatureGrid.description")}
          features={features}
        />
      </Section>

      <Section surface="subtle">
        <CTA
          heading={t("CTA.heading")}
          description={t("CTA.description")}
          primaryCTA={{ label: t("CTA.primaryCTA"), href: "/" }}
          secondaryCTA={{ label: t("CTA.secondaryCTA"), href: "/about" }}
          surface="subtle"
        />
      </Section>
    </>
  );
}
