import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LinkButton } from "./LinkButton";

const meta: Meta<typeof LinkButton> = {
  title: "UI/LinkButton",
  component: LinkButton,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "accent"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    surface: {
      control: "select",
      options: ["white", "subtle", "dark", "accent"],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LinkButton>;

export const Playground: Story = {
  args: {
    children: "Get Started",
    href: "/",
    variant: "primary",
    size: "md",
    surface: "white",
  },
};

export const OnWhite: Story = {
  render: () => (
    <div className="space-y-4 rounded-lg bg-[var(--surface-white)] p-8">
      <div className="flex flex-wrap gap-4">
        <LinkButton href="/" variant="primary" surface="white">
          Primary
        </LinkButton>
        <LinkButton href="/" variant="secondary" surface="white">
          Secondary
        </LinkButton>
        <LinkButton href="/" variant="accent" surface="white">
          Accent
        </LinkButton>
      </div>
    </div>
  ),
};

export const OnDark: Story = {
  render: () => (
    <div className="space-y-4 rounded-lg bg-[var(--surface-dark)] p-8">
      <div className="flex flex-wrap gap-4">
        <LinkButton href="/" variant="primary" surface="dark">
          Primary
        </LinkButton>
        <LinkButton href="/" variant="secondary" surface="dark">
          Secondary
        </LinkButton>
        <LinkButton href="/" variant="accent" surface="dark">
          Accent
        </LinkButton>
      </div>
    </div>
  ),
};

export const OnAccent: Story = {
  render: () => (
    <div className="space-y-4 rounded-lg bg-[#1d4ed8] p-8">
      <div className="flex flex-wrap gap-4">
        <LinkButton href="/" variant="primary" surface="accent">
          Primary
        </LinkButton>
        <LinkButton href="/" variant="secondary" surface="accent">
          Secondary
        </LinkButton>
        <LinkButton href="/" variant="accent" surface="accent">
          Accent
        </LinkButton>
      </div>
    </div>
  ),
};
