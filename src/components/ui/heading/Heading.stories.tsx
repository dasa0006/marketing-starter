import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heading } from "./Heading";
import { mockHeadingLevels } from "./Heading.mocks";

const meta: Meta<typeof Heading> = {
  title: "UI/Heading",
  component: Heading,
  argTypes: {
    level: { control: "select", options: [1, 2, 3, 4] },
    as: { control: "select", options: ["h1", "h2", "h3", "h4"] },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Playground: Story = {
  args: {
    children: "This is a heading",
    level: 1,
  },
};

export const AllLevels: Story = {
  render: () => (
    <div className="space-y-4">
      {mockHeadingLevels.map((props) => (
        <Heading key={props.level} {...props} />
      ))}
    </div>
  ),
};
