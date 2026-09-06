import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import LinkButton from "./LinkButton";

const meta = {
  component: LinkButton,
} satisfies Meta<typeof LinkButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "/",
    children: "Go home",
  },
};

export const Variants: Story = {
  args: { href: "/" },
  render: () => (
    <div className="space-x-8">
      <LinkButton href="/" variant="primary">
        Primary
      </LinkButton>
      <LinkButton href="/" variant="secondary">
        Secondary
      </LinkButton>
      <LinkButton href="/" variant="accent">
        Accent
      </LinkButton>
      <LinkButton href="/" variant="ghost">
        Ghost
      </LinkButton>
    </div>
  ),
};

export const Sizes: Story = {
  args: { href: "/" },
  render: () => (
    <div className="space-x-8">
      <LinkButton href="/" size="sm">
        Small
      </LinkButton>
      <LinkButton href="/" size="md">
        Medium
      </LinkButton>
      <LinkButton href="/" size="lg">
        Large
      </LinkButton>
    </div>
  ),
};
