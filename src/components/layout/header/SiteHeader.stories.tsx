import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteHeader } from "./SiteHeader";
import { MobileDrawer } from "./MobileDrawer";
import { mainNavLinks } from "@/lib/config/navigation";

const meta: Meta<typeof SiteHeader> = {
  title: "Layout/SiteHeader",
  component: SiteHeader,
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "transparent"],
    },
  },
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Solid: Story = {
  args: {
    variant: "solid",
  },
};

export const Transparent: Story = {
  args: {
    variant: "transparent",
  },
  parameters: {
    // Show on a dark background to demonstrate transparency
    backgrounds: { default: "dark" },
  },
};

/**
 * Standalone MobileDrawer story for visual testing.
 */
export const DrawerOpen: StoryObj<typeof MobileDrawer> = {
  render: () => (
    <MobileDrawer open={true} onClose={() => {}} navLinks={mainNavLinks} />
  ),
};
