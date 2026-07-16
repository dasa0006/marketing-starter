import About from "@/components/pages/About";
import { JsonLdScripts } from "@/components/seo/JsonLdScripts";
import { buildBreadcrumbSchema } from "@/lib/seo/schemas";
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
  const t = await getTranslations({ locale, namespace: "Metadata.about" });

  return getPageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("description"),
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SiteHeader.nav" });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: t("home"), item: "/" },
    { name: t("about"), item: "/about" },
  ]);

  return (
    <>
      <About />
      <JsonLdScripts schemas={[breadcrumbSchema]} />
    </>
  );
}
