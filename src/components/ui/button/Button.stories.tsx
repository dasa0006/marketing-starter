import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";
import { mockButtonVariants, mockButtonSizes } from "./Button.mocks";
import { ArrowRight, Mail } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "accent", "transparent", "ghost"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: {
    children: "Click me",
    variant: "primary",
    size: "md",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {mockButtonVariants.map((props) => (
        <Button key={String(props.children)} {...props} />
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {mockButtonSizes.map((props) => (
        <Button key={String(props.children)} {...props} />
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button leftIcon={<Mail size={16} />}>Email</Button>
      <Button rightIcon={<ArrowRight size={16} />}>Learn More</Button>
      <Button
        leftIcon={<Mail size={16} />}
        rightIcon={<ArrowRight size={16} />}
      >
        Contact
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button loading>Loading</Button>
      <Button loading variant="secondary">
        Loading
      </Button>
      <Button loading variant="accent">
        Loading
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button disabled>Disabled</Button>
      <Button disabled variant="secondary">
        Disabled
      </Button>
      <Button disabled variant="accent">
        Disabled
      </Button>
    </div>
  ),
};
