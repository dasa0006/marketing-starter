import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "./Section";

describe("Section", () => {
  it("renders children", () => {
    render(<Section>Hello world</Section>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders as a <section> element by default", () => {
    render(<Section>Default</Section>);
    const el = screen.getByText("Default");
    expect(el.tagName).toBe("SECTION");
  });

  it("applies the base 'section' class", () => {
    render(<Section>Class check</Section>);
    const el = screen.getByText("Class check");
    expect(el.className).toContain("section");
  });

  it.each([
    ["sm", "section-size-sm"],
    ["md", "section-size-md"],
    ["lg", "section-size-lg"],
    ["xl", "section-size-xl"],
  ] as const)("applies the %s size class", (size, expectedClass) => {
    render(<Section size={size}>Size {size}</Section>);
    expect(screen.getByText(`Size ${size}`).className).toContain(expectedClass);
  });

  it.each([
    ["white", "section-surface-white"],
    ["subtle", "section-surface-subtle"],
    ["dark", "section-surface-dark"],
    ["accent", "section-surface-accent"],
  ] as const)("applies the %s surface class", (surface, expectedClass) => {
    render(<Section surface={surface}>Surface {surface}</Section>);
    expect(screen.getByText(`Surface ${surface}`).className).toContain(
      expectedClass
    );
  });

  it("applies the contained class by default", () => {
    render(<Section>Contained</Section>);
    expect(screen.getByText("Contained").className).toContain(
      "section-contained"
    );
  });

  it("applies the full class when contained is false", () => {
    render(<Section contained={false}>Full width</Section>);
    const el = screen.getByText("Full width");
    expect(el.className).toContain("section-full");
    expect(el.className).not.toContain("section-contained");
  });

  it("renders as a different element with the as prop", () => {
    render(
      <Section as="article" data-testid="poly">
        Polymorphic
      </Section>
    );
    const el = screen.getByTestId("poly");
    expect(el.tagName).toBe("ARTICLE");
  });

  it("forwards additional className", () => {
    render(<Section className="my-custom-class">Extra</Section>);
    expect(screen.getByText("Extra").className).toContain("my-custom-class");
  });

  it("forwards extra HTML attributes", () => {
    render(
      <Section aria-label="test section" data-testid="attrs">
        Attributes
      </Section>
    );
    const el = screen.getByTestId("attrs");
    expect(el).toHaveAttribute("aria-label", "test section");
  });
});
