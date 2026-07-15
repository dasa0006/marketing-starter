import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Section } from "@/components/layout/section/Section";
import { TextBlock } from "./TextBlock";
import {
  mockTextBlockProps,
  mockTextBlockNoHeading,
  mockTextBlockSingleParagraph,
} from "./TextBlock.mocks";

const meta: Meta<typeof TextBlock> = {
  title: "Blocks/TextBlock",
  component: TextBlock,
  argTypes: {},
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
type Story = StoryObj<typeof TextBlock>;

export const Playground: Story = {
  args: mockTextBlockProps,
};

export const NoHeading: Story = {
  args: mockTextBlockNoHeading,
};

export const SingleParagraph: Story = {
  args: mockTextBlockSingleParagraph,
};
