import CookiePolicy from "@/components/pages/CookiePolicy";
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
  const t = await getTranslations({
    locale,
    namespace: "Metadata.cookie-policy",
  });

  return getPageMetadata({
    locale,
    path: "/cookie-policy",
    title: t("title"),
    description: t("description"),
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
  });
}

export default function CookiePolicyPage() {
  return <CookiePolicy />;
}
