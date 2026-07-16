"use client";

import { useTranslations } from "next-intl";
import { TextBlock } from "@/components/blocks/text-block/TextBlock";
import { Section } from "@/components/layout/section/Section";

/**
 * Cookie Policy page composition component.
 *
 * Renders a single text block with cookie policy content from the
 * `CookiePolicy` message namespace, wrapped in a white Section.
 */
export default function CookiePolicy() {
  const t = useTranslations("CookiePolicy");

  return (
    <Section surface="white">
      <TextBlock heading={t("title")} content={t("body")} />
    </Section>
  );
}
