import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Section } from "@/components/layout/section/Section";
import { Hero } from "./Hero";
import {
  mockHeroProps,
  mockHeroLeft,
  mockHeroSplit,
  mockHeroMinimal,
  mockHeroSurfaces,
} from "./Hero.mocks";

const meta: Meta<typeof Hero> = {
  title: "Blocks/Hero",
  component: Hero,
  argTypes: {
    layout: {
      control: "select",
      options: ["center", "left", "split"],
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
type Story = StoryObj<typeof Hero>;

export const Playground: Story = {
  args: mockHeroProps,
};

export const Minimal: Story = {
  args: mockHeroMinimal,
};

export const LeftAligned: Story = {
  args: mockHeroLeft,
};

export const SplitLayout: Story = {
  args: mockHeroSplit,
};

export const AllSurfaces: Story = {
  render: () => (
    <div className="space-y-0">
      {mockHeroSurfaces.map((props) => (
        <Section key={props.surface} surface={props.surface}>
          <Hero {...props} />
        </Section>
      ))}
    </div>
  ),
};
