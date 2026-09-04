import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useLocale, useTranslations } from "next-intl";

/**
 * Example component demonstrating next-intl inside Storybook.
 *
 * The `.storybook/preview.tsx` decorator wraps every story in
 * `NextIntlClientProvider`, and the `Locale` toolbar switches the active
 * locale. This component reads the merged base + custom messages through the
 * public hooks — no Next.js routing involved.
 *
 * Uses inline styles (rather than Tailwind) so the example renders correctly
 * regardless of how global CSS is wired into the Storybook preview.
 */
function LocalizedContent() {
  const locale = useLocale();
  const t = useTranslations("Error");

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 320,
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontSize: 12,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {locale}
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 600, margin: "4px 0 0" }}>
        {t("title")}
      </h2>
      <p style={{ color: "#475569", margin: "8px 0 0" }}>{t("description")}</p>
      <button
        type="button"
        style={{
          marginTop: 16,
          background: "#0f172a",
          color: "#ffffff",
          padding: "8px 16px",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
        }}
      >
        {t("retry")}
      </button>
    </div>
  );
}

const meta = {
  title: "Examples/NextIntl",
  component: LocalizedContent,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LocalizedContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Follows the locale selected in the Storybook toolbar (default: en). */
export const ToolbarLocale: Story = {};

/** Pinned to Danish, overriding the toolbar selection. */
export const Danish: Story = {
  globals: { locale: "da" },
};
