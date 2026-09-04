import { JsonLdScripts } from "@/components/seo/JsonLdScripts";
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
  const t = await getTranslations({ locale, namespace: "Metadata.home" });

  return getPageMetadata({
    locale,
    path: "/",
    title: t("title"),
    description: t("description"),
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
  });
}

export default function HomePage() {
  return <JsonLdScripts />;
}
