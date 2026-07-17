import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Locale-scoped 404 page.
 *
 * Renders when `notFound()` is called within the `[locale]` segment.
 * Reads translated messages from the NotFound namespace and provides a
 * `backToHome` link using the locale-aware next-intl `Link`.
 */
export default async function LocaleNotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "NotFound" });

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">{t("title")}</h2>
      <p className="text-muted-foreground max-w-md">{t("description")}</p>
      <Link
        href="/"
        className="rounded-md bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-90"
      >
        {t("backToHome")}
      </Link>
    </div>
  );
}
