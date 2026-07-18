import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ConsentProvider } from "@/components/providers/ConsentProvider";
import { createFakeStorage } from "@/lib/consent/storage";
import { CookieBanner } from "./CookieBanner";

const meta: Meta<typeof CookieBanner> = {
  title: "Layout/CookieBanner",
  component: CookieBanner,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ConsentProvider storage={createFakeStorage("undecided")}>
        <Story />
      </ConsentProvider>
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
