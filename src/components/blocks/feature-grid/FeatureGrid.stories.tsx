import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Section } from "@/components/layout/section/Section";
import { FeatureGrid } from "./FeatureGrid";
import {
  mockFeatureGridProps,
  mockFeatureGridTwoColumns,
  mockFeatureGridFourColumns,
} from "./FeatureGrid.mocks";

const meta: Meta<typeof FeatureGrid> = {
  title: "Blocks/FeatureGrid",
  component: FeatureGrid,
  argTypes: {
    columns: {
      control: "select",
      options: [2, 3, 4],
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Section>
        <Story />
      </Section>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FeatureGrid>;

export const Playground: Story = {
  args: mockFeatureGridProps,
};

export const TwoColumns: Story = {
  args: mockFeatureGridTwoColumns,
};

export const ThreeColumns: Story = {
  args: mockFeatureGridProps,
};

export const FourColumns: Story = {
  args: mockFeatureGridFourColumns,
};
