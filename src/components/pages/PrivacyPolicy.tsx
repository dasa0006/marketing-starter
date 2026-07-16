"use client";

import { useTranslations } from "next-intl";
import { TextBlock } from "@/components/blocks/text-block/TextBlock";
import { Section } from "@/components/layout/section/Section";

/**
 * Privacy Policy page composition component.
 *
 * Renders a single text block with legal content from the `PrivacyPolicy`
 * message namespace, wrapped in a white Section.
 */
export default function PrivacyPolicy() {
  const t = useTranslations("PrivacyPolicy");

  return (
    <Section surface="white">
      <TextBlock heading={t("title")} content={t("body")} />
    </Section>
  );
}
