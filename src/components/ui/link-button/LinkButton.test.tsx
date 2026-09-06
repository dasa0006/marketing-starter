import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import LinkButton from "./LinkButton";

// The real next-intl `Link` wraps Next.js' Link and cannot be imported in the
// jsdom unit environment (it resolves `next/navigation`, which requires the
// app-router runtime). Replace it with a plain anchor so the tests exercise
// `LinkButton`'s own behaviour — variant/size styling, className merging, and
// prop forwarding — rather than next-intl's internals.
vi.mock("@/i18n/navigation", async () => {
  const React = await import("react");
  const Link = React.forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
    function MockLink({ children, ...props }, ref) {
      return React.createElement("a", { ref, ...props }, children);
    }
  );
  return { Link };
});

// ── Tests ─────────────────────────────────────────────────────────

describe("LinkButton rendering", () => {
  it("renders a semantic link with its content and href", () => {
    render(<LinkButton href="/about">About us</LinkButton>);

    const link = screen.getByRole("link", { name: "About us" });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/about");
  });

  it("renders rich children (React nodes) inside the link", () => {
    render(
      <LinkButton href="/download">
        Download <span>now</span>
      </LinkButton>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveTextContent("Download now");
    expect(link.querySelector("span")).toHaveTextContent("now");
  });

  it("defaults to the 'primary' variant and 'md' size", () => {
    render(<LinkButton href="/">Home</LinkButton>);

    const link = screen.getByRole("link");
    expect(link).toHaveClass("bg-[#091057]");
    expect(link).toHaveClass("py-3", "px-6", "text-base");
  });
});

describe("LinkButton styling", () => {
  // The full variant/size/ghost-override matrix lives in Button.test.tsx, the
  // canonical home for the shared `buttonVariants` config. Here we only verify
  // that `LinkButton` wires `variant` and `size` into that shared config.
  it("applies the requested variant and size via the shared buttonVariants config", () => {
    render(
      <LinkButton href="/" variant="accent" size="lg">
        Action
      </LinkButton>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("bg-[#EC8305]");
    expect(link).toHaveClass("py-4", "px-8", "text-lg");
  });
});

describe("LinkButton composition", () => {
  it("merges a custom className on top of the built-in styles", () => {
    render(
      <LinkButton href="/" className="mx-auto">
        Action
      </LinkButton>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveClass("mx-auto");
    expect(link).toHaveClass("font-semibold");
  });

  it("lets a custom className override a conflicting built-in via tailwind-merge", () => {
    render(
      <LinkButton href="/" className="py-1">
        Action
      </LinkButton>
    );

    const link = screen.getByRole("link");
    // tailwind-merge keeps the tail (custom), so the default md padding is dropped.
    expect(link).not.toHaveClass("py-3");
    expect(link).toHaveClass("py-1");
  });

  it("forwards additional anchor attributes to the <a>", () => {
    render(
      <LinkButton
        href="/docs"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open documentation"
      >
        Docs
      </LinkButton>
    );

    const link = screen.getByRole("link", { name: "Open documentation" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("LinkButton ref", () => {
  it("forwards a ref bound to the rendered anchor element", () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <LinkButton href="/" ref={ref}>
        Action
      </LinkButton>
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current?.tagName).toBe("A");
  });
});
