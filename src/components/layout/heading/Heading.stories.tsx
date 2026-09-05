import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Heading from "./Heading";
import {
  longHeadingMocks,
  sectionHeadingMocks,
  shortHeadingMocks,
} from "./Heading.mocks";

const meta = {
  component: Heading,
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: shortHeadingMocks,
};

export const Long: Story = {
  args: longHeadingMocks,
};

/** A lower-level heading, e.g. inside a page section beneath the main h1. */
export const Subsection: Story = {
  args: sectionHeadingMocks,
};

/** An accessible heading hierarchy: one h1 followed by its h2 children. */
export const Hierarchy: Story = {
  render: () => (
    <div className="space-y-8">
      <Heading {...shortHeadingMocks} />
      <Heading {...sectionHeadingMocks} />
      <Heading as="h3" {...shortHeadingMocks} />
    </div>
  ),
};
