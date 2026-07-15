import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Youtube, Linkedin } from "lucide-react";
import { SiteFooter } from "./SiteFooter";
import type { SocialLink } from "./SiteFooter.types";

const alternateSocialLinks: SocialLink[] = [
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: <Youtube size={20} aria-hidden="true" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: <Linkedin size={20} aria-hidden="true" />,
  },
];

const meta: Meta<typeof SiteFooter> = {
  title: "Layout/SiteFooter",
  component: SiteFooter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SiteFooter>;

export const Default: Story = {};

export const CustomSocialLinks: Story = {
  args: {
    socialLinks: alternateSocialLinks,
  },
};
