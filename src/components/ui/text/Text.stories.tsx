import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Text } from "./Text";
import { mockTextSizes, mockTextVariants } from "./Text.mocks";

const meta: Meta<typeof Text> = {
  title: "UI/Text",
  component: Text,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "base", "lg", "lead"],
    },
    variant: {
      control: "select",
      options: ["default", "muted"],
    },
    as: {
      control: "select",
      options: ["p", "span", "div", "label", "figcaption"],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Playground: Story = {
  args: {
    children:
      "This is a text component that can render as any HTML element with configurable size and variant.",
    size: "base",
    variant: "default",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      {mockTextSizes.map((props, i) => (
        <Text key={i} {...props} />
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      {mockTextVariants.map((props, i) => (
        <Text key={i} {...props} />
      ))}
    </div>
  ),
};

export const Polymorphic: Story = {
  render: () => (
    <div className="space-y-4">
      <Text as="p">Rendered as a paragraph (default)</Text>
      <Text as="span">Rendered as a span</Text>
      <Text as="div">Rendered as a div</Text>
      <Text as="label">Rendered as a label</Text>
      <Text as="figcaption">Rendered as a figcaption</Text>
      <Text as="small">Rendered as a small element</Text>
    </div>
  ),
};
