import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileDrawer } from "./MobileDrawer";
import { mainNavLinks } from "@/lib/config/navigation";
import { ToggleMode } from "@/components/ui/toggle-mode/ToggleMode";
import { LocaleSwitcher } from "@/components/ui/locale-switcher/LocaleSwitcher";

const meta: Meta<typeof MobileDrawer> = {
  title: "Layout/MobileDrawer",
  component: MobileDrawer,
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
type Story = StoryObj<typeof MobileDrawer>;

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    navLinks: mainNavLinks,
  },
};

export const Open: Story = {
  args: {
    open: true,
    onClose: () => {},
    navLinks: mainNavLinks,
  },
};

export const OpenWithExtras: Story = {
  args: {
    open: true,
    onClose: () => {},
    navLinks: mainNavLinks,
    children: (
      <>
        <ToggleMode />
        <LocaleSwitcher />
      </>
    ),
  },
};
