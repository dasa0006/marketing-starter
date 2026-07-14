import type { Meta, StoryObj, Decorator } from "@storybook/nextjs-vite";
import { Image } from "./Image";

const meta: Meta<typeof Image> = {
  title: "UI/Image",
  component: Image,
  argTypes: {
    alt: { control: "text" },
    width: { control: "number" },
    height: { control: "number" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Image>;

/**
 * Image with explicit dimensions — the standard use case.
 */
export const WithDimensions: Story = {
  args: {
    src: "/next.svg",
    alt: "Next.js logo",
    width: 180,
    height: 38,
  },
};

const fillContainerDecorator: Decorator = (StoryComponent) => (
  <div className="relative h-48 w-full rounded-md border border-[var(--border-light)]">
    <StoryComponent />
  </div>
);

/**
 * The `fill` prop lets the image fill its parent container.
 * The parent must have `position: relative` and defined dimensions.
 */
export const FillContainer: Story = {
  args: {
    src: "/next.svg",
    alt: "Next.js logo filling container",
    fill: true,
    className: "object-contain",
  },
  decorators: [fillContainerDecorator],
};
