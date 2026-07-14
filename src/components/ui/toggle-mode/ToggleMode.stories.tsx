import type { Meta, StoryObj, Decorator } from "@storybook/nextjs-vite";
import { ToggleMode } from "./ToggleMode";

const darkClassDecorator: Decorator = (StoryComponent) => (
  <div className="dark">
    <StoryComponent />
  </div>
);

const meta: Meta<typeof ToggleMode> = {
  title: "UI/ToggleMode",
  component: ToggleMode,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToggleMode>;

export const Light: Story = {};

export const Dark: Story = {
  decorators: [darkClassDecorator],
};
