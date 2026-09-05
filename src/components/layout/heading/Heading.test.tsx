import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import Heading, { HeadingTag } from "./Heading";
import {
  longHeadingMocks,
  sectionHeadingMocks,
  shortHeadingMocks,
} from "./Heading.mocks";

// ── Tests ─────────────────────────────────────────────────────────

describe("Heading", () => {
  it("renders a semantic <h1> containing its content", () => {
    render(<Heading>{shortHeadingMocks.children}</Heading>);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: shortHeadingMocks.children,
    });
    expect(heading).toBeInTheDocument();
  });

  it("wraps a long headline as a single <h1> with the full text", () => {
    render(<Heading>{longHeadingMocks.children}</Heading>);

    expect(
      screen.getByRole("heading", { level: 1, name: longHeadingMocks.children })
    ).toBeInTheDocument();
  });

  it("applies built-in typographic classes by default", () => {
    render(<Heading>Headline</Heading>);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass(
      "text-4xl",
      "sm:text-5xl",
      "text-pretty",
      "font-semibold",
      "tracking-tight",
      "text-zinc-800"
    );
  });

  it("merges a custom className on top of the built-in styles", () => {
    render(<Heading className="text-center text-zinc-900">Headline</Heading>);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("text-center", "text-zinc-900");
    // tailwind-merge drops the conflicting default color, not the custom one.
    expect(heading).not.toHaveClass("text-zinc-800");
  });

  it("forwards additional HTML attributes to the <h1>", () => {
    render(
      <Heading id="hero-title" aria-label="Main marketing headline">
        Headline
      </Heading>
    );

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Main marketing headline",
    });
    expect(heading).toHaveAttribute("id", "hero-title");
    expect(heading).toHaveAttribute("aria-label", "Main marketing headline");
  });

  it("renders rich children (React nodes) inside the heading", () => {
    render(
      <Heading>
        Grow <span className="text-zinc-950 underline">your audience</span>{" "}
        today
      </Heading>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Grow your audience today");
    expect(heading.querySelector("span")).toHaveClass(
      "text-zinc-950",
      "underline"
    );
  });
});

describe("Heading polymorphic `as`", () => {
  it.each<[HeadingTag, number, string]>([
    ["h1", 1, "H1"],
    ["h2", 2, "H2"],
    ["h3", 3, "H3"],
    ["h4", 4, "H4"],
    ["h5", 5, "H5"],
    ["h6", 6, "H6"],
  ])("renders as %s with accessible level %i", (as, level, tagName) => {
    render(<Heading as={as}>Section</Heading>);

    const heading = screen.getByRole("heading", {
      level,
      name: "Section",
    });
    expect(heading.tagName).toBe(tagName);
  });

  it("defaults to an <h1> when no `as` is provided", () => {
    render(<Heading>Page title</Heading>);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.tagName).toBe("H1");
  });

  it("uses the `sectionHeadingMocks` `as` value to render an <h2>", () => {
    render(<Heading {...sectionHeadingMocks} />);

    const heading = screen.getByRole("heading", {
      level: 2,
      name: sectionHeadingMocks.children,
    });
    expect(heading.tagName).toBe("H2");
  });

  it("keeps the built-in typographic classes for any heading level", () => {
    render(<Heading as="h3">Sub-serve heading</Heading>);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveClass(
      "text-4xl",
      "sm:text-5xl",
      "text-pretty",
      "font-semibold",
      "tracking-tight",
      "text-zinc-800"
    );
  });

  it("forwards a ref bound to the rendered heading element", () => {
    const ref = createRef<HTMLHeadingElement>();

    render(
      <Heading as="h2" ref={ref}>
        Section
      </Heading>
    );

    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    expect(ref.current?.tagName).toBe("H2");
  });
});
