import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Section } from "./Section";
import { sectionSizes, sectionSurfaces } from "./Section.mocks";

const meta: Meta<typeof Section> = {
  title: "Layout/Section",
  component: Section,
  argTypes: {
    size: { control: "select", options: sectionSizes },
    surface: { control: "select", options: sectionSurfaces },
    contained: { control: "boolean" },
    as: { control: "select", options: ["section", "div", "article", "aside"] },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Playground: Story = {
  args: {
    children: (
      <div className="space-y-2">
        <h2 className="heading heading-h2">Section Title</h2>
        <p className="text-base text-default">
          This is a section with default settings. Resize the viewport to see
          container constraints.
        </p>
      </div>
    ),
    size: "md",
    surface: "white",
    contained: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-0">
      {sectionSizes.map((size) => (
        <Section key={size} size={size} surface="white">
          <div className="text-center">
            <p className="heading heading-h3">Size: {size}</p>
            <p className="text-base text-default">
              Vertical padding varies per breakpoint token.
            </p>
          </div>
        </Section>
      ))}
    </div>
  ),
};

export const AllSurfaces: Story = {
  render: () => (
    <div className="space-y-0">
      {sectionSurfaces.map((surface) => (
        <Section key={surface} surface={surface}>
          <div className="text-center">
            <p className="heading heading-h3" style={{ color: "inherit" }}>
              Surface: {surface.charAt(0).toUpperCase() + surface.slice(1)}
            </p>
            <p className="text-base" style={{ color: "inherit" }}>
              Background and text color adapt to the surface context.
            </p>
          </div>
        </Section>
      ))}
    </div>
  ),
};

export const FullWidth: Story = {
  args: {
    contained: false,
    surface: "subtle",
    children: (
      <div className="text-center">
        <p className="heading heading-h3">Full Width Section</p>
        <p className="text-base text-default">
          This section spans the entire viewport width with no container
          constraint.
        </p>
      </div>
    ),
  },
};

export const AllCombinations: Story = {
  render: () => (
    <div className="space-y-0">
      {sectionSurfaces.map((surface) => (
        <div key={surface}>
          {sectionSizes.map((size) => (
            <Section key={`${surface}-${size}`} size={size} surface={surface}>
              <div className="text-center">
                <p className="heading heading-h4" style={{ color: "inherit" }}>
                  {surface.charAt(0).toUpperCase() + surface.slice(1)} / {size}
                </p>
              </div>
            </Section>
          ))}
        </div>
      ))}
    </div>
  ),
};
