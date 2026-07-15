import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Section } from "@/components/layout/section/Section";
import { CTA } from "./CTA";
import { mockCTAProps, mockCTALeft, mockCTANoDescription } from "./CTA.mocks";

const meta: Meta<typeof CTA> = {
  title: "Blocks/CTA",
  component: CTA,
  argTypes: {
    layout: {
      control: "select",
      options: ["center", "left"],
    },
    surface: {
      control: "select",
      options: ["white", "subtle", "dark", "accent"],
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
type Story = StoryObj<typeof CTA>;

export const Playground: Story = {
  args: mockCTAProps,
};

export const LeftAligned: Story = {
  args: mockCTALeft,
};

export const NoDescription: Story = {
  args: mockCTANoDescription,
};

export const AllSurfaces: Story = {
  render: () => (
    <div className="space-y-0">
      <Section surface="white">
        <CTA {...mockCTAProps} surface="white" />
      </Section>
      <Section surface="subtle">
        <CTA {...mockCTAProps} surface="subtle" />
      </Section>
      <Section surface="dark">
        <CTA {...mockCTAProps} surface="dark" />
      </Section>
      <Section surface="accent">
        <CTA {...mockCTAProps} surface="accent" />
      </Section>
    </div>
  ),
};
