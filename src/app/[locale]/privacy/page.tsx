import PrivacyPolicy from "@/components/pages/PrivacyPolicy";
import { getPageMetadata } from "@/lib/seo/metadata";
import { routing, generateStaticParamsForLocales } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export { generateStaticParamsForLocales as generateStaticParams };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.privacy" });

  return getPageMetadata({
    locale,
    path: "/privacy",
    title: t("title"),
    description: t("description"),
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
  });
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
