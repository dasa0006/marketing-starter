import type { Preview } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import React from "react";

// Self-host Geist fonts via fontsource for Storybook parity with next/font/google.
// These side-effect imports add @font-face rules for the variable font files.
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import "../src/app/globals.css";

/**
 * Design Decision: @storybook/addon-vitest over @storybook/test-runner
 * -------------------------------------------------------------------
 * The original plan called for @storybook/test-runner (a standalone Playwright-based
 * runner that boots the static build). The project instead uses @storybook/addon-vitest
 * because:
 *
 * 1. Everything runs through a single test runner (Vitest) — no parallel infra.
 * 2. The addon integrates with Vitest's browser mode (Playwright) directly.
 * 3. Already installed and configured in vitest.config.ts via storybookTest() plugin.
 * 4. Run with: vitest run --project storybook
 *
 * If interaction tests require server-side rendering context in the future,
 * this decision can be revisited.
 */

/**
 * ThemeProvider stub — replaced in Phase 5 when the real provider is built.
 * Wraps children without adding any theme context yet.
 * TODO: Replace with actual ThemeProvider from src/app/providers once implemented.
 */
function StubThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'error' - fail CI on a11y violations
      // 'todo' - show a11y violations in the test UI only
      // 'off' - skip a11y checks entirely
      test: "error",
    },
  },

  decorators: [
    (Story) => (
      // The inline style sets --font-geist-sans / --font-geist-mono so that
      // Tailwind's font-sans / font-mono (defined in globals.css @theme inline)
      // resolve to the fontsource self-hosted variable fonts.
      <div
        style={
          {
            "--font-geist-sans": "Geist Variable",
            "--font-geist-mono": "Geist Mono Variable",
          } as React.CSSProperties
        }
      >
        <NextIntlClientProvider locale="en">
          <StubThemeProvider>
            <Story />
          </StubThemeProvider>
        </NextIntlClientProvider>
      </div>
    ),
  ],
};

export default preview;
