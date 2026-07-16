"use client";

import { useTranslations } from "next-intl";
import { TextBlock } from "@/components/blocks/text-block/TextBlock";
import { Section } from "@/components/layout/section/Section";

/**
 * About page composition component.
 *
 * Renders two text sections — "Our Story" and "Our Mission" — each wrapped
 * in a Section with alternating surfaces. Messages are read from the
 * `AboutPage` namespace.
 *
 * @remarks The spec describes image-right / image-left layout for the two
 * TextBlocks. The current `TextBlock` component does not accept an `image`
 * prop, so images are deferred until `TextBlock` gains image support.
 */
export default function About() {
  const t = useTranslations("AboutPage");

  return (
    <>
      <Section surface="white">
        <TextBlock heading={t("section1Heading")} content={t("section1Body")} />
      </Section>

      <Section surface="subtle">
        <TextBlock heading={t("section2Heading")} content={t("section2Body")} />
      </Section>
    </>
  );
}
