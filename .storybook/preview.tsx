import { getMessagesForLocale } from "@/i18n/messages";
import { locales, type Locale } from "@/i18n/routing";
import type { Preview } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";

import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },

  // Locale switcher in the Storybook toolbar. Stories read the active locale
  // through `context.globals.locale` (or override it per-story with
  // `globals: { locale: "da" }`).
  globalTypes: {
    locale: {
      name: "Locale",
      description: "Active next-intl locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: locales.map((locale) => ({ value: locale, title: locale })),
      },
    },
  },

  // Wrap every story in NextIntlClientProvider so components can use
  // `useTranslations`, `useFormatter`, `useLocale`, etc.
  decorators: [
    (Story, context) => {
      const requested = context.globals.locale as string;
      const locale: Locale = locales.includes(requested as Locale)
        ? (requested as Locale)
        : "en";

      return (
        <NextIntlClientProvider
          locale={locale}
          messages={getMessagesForLocale(locale)}
          // Mirrors SITE_CONFIG.timezone. Kept as a literal so we don't pull
          // src/lib/config/site (which imports env + a production validation
          // guard) into the Storybook bundle.
          timeZone="Europe/Copenhagen"
        >
          <Story />
        </NextIntlClientProvider>
      );
    },
  ],
};

export default preview;
