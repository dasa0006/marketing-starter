import { NextIntlClientProvider } from "next-intl";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ConsentProvider } from "@/components/providers/ConsentProvider";
import { createFakeStorage } from "@/lib/consent/storage";
import { CookieBanner } from "./CookieBanner";

const messages = {
  CookieBanner: {
    title: "We use cookies",
    description: "This site uses cookies to improve your experience.",
    accept: "Accept",
    decline: "Decline",
  },
  Legal: {
    privacyPolicy: "Privacy Policy",
  },
};

const meta: Meta<typeof CookieBanner> = {
  title: "Layout/CookieBanner",
  component: CookieBanner,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <ConsentProvider storage={createFakeStorage("undecided")}>
          <Story />
        </ConsentProvider>
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CookieBanner>;

/** Default undecided state — banner is visible with Accept/Decline. */
export const Undecided: Story = {};

/**
 * Custom class appended.
 */
export const CustomClassName: Story = {
  args: {
    className: "border-t-2 border-red-500",
  },
};
