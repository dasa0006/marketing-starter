import type { Meta, StoryObj, Decorator } from "@storybook/nextjs-vite";
import { Image } from "./Image";

const meta: Meta<typeof Image> = {
  title: "UI/Image",
  component: Image,
  argTypes: {
    alt: { control: "text" },
    width: { control: "number" },
    height: { control: "number" },
    quality: { control: "number", description: "Defaults to 85 via wrapper" },
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
    src: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='38' viewBox='0 0 180 38'%3E%3Crect fill='%23eee' width='180' height='38'/%3E%3C/svg%3E",
    alt: "Placeholder image",
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
    src: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%23eee' width='400' height='200'/%3E%3C/svg%3E",
    alt: "Placeholder image filling container",
    fill: true,
    className: "object-contain",
  },
  decorators: [fillContainerDecorator],
};
