import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

// Variant → the built-in classes applied on top of the shared base styles.
const variantClasses: Record<string, string[]> = {
  primary: ["bg-[#091057]"],
  secondary: ["bg-[#024CAA]"],
  accent: ["bg-[#EC8305]"],
  ghost: [
    "text-black",
    "rounded-sm",
    "hover:bg-gray-100",
    "disabled:text-white",
  ],
};

// Size → the built-in classes applied on top of the shared base styles.
const sizeClasses: Record<string, string[]> = {
  sm: ["py-2", "px-4", "text-sm"],
  md: ["py-3", "px-6", "text-base"],
  lg: ["py-4", "px-8", "text-lg"],
};

// Shared classes present on every variant/size combination.
const baseClasses = [
  "cursor-pointer",
  "rounded-3xl",
  "transition-opacity",
  "hover:opacity-85",
  "font-semibold",
  "disabled:bg-gray-200",
  "disabled:opacity-85",
  "disabled:cursor-auto",
];

// ── Tests ─────────────────────────────────────────────────────────

describe("Button rendering", () => {
  it("renders a semantic <button> containing its content", () => {
    render(<Button>Get started</Button>);

    const button = screen.getByRole("button", { name: "Get started" });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
  });

  it("renders rich children (React nodes) inside the button", () => {
    render(
      <Button>
        Download <span>now</span>
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Download now");
    expect(button.querySelector("span")).toHaveTextContent("now");
  });

  it("renders no children when none are provided", () => {
    const { container } = render(<Button />);

    const button = container.querySelector("button");
    expect(button).toBeInTheDocument();
    expect(button).toBeEmptyDOMElement();
  });

  it("applies the shared base styles by default", () => {
    render(<Button>Action</Button>);

    const button = screen.getByRole("button");
    baseClasses.forEach((className) => {
      expect(button).toHaveClass(className);
    });
  });

  it("defaults to the 'primary' variant and 'md' size", () => {
    render(<Button>Action</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-[#091057]");
    expect(button).toHaveClass("py-3", "px-6", "text-base");
  });
});

describe("Button variants", () => {
  it.each(Object.entries(variantClasses))(
    "renders the %s variant with its built-in classes",
    (variant, expected) => {
      render(<Button variant={variant as "primary"}>Action</Button>);

      const button = screen.getByRole("button");
      expected.forEach((className) => {
        expect(button).toHaveClass(className);
      });
    }
  );

  it("keeps the genuinely shared base styles for every variant", () => {
    // These base classes are inherited by every variant. The border-radius,
    // opacity-transition and disabled *text* classes are intentionally overridden
    // by `ghost` via tailwind-merge, so they are asserted separately below.
    const inheritedByAll = [
      "cursor-pointer",
      "font-semibold",
      "disabled:bg-gray-200",
      "disabled:opacity-85",
      "disabled:cursor-auto",
    ];

    for (const variant of Object.keys(variantClasses)) {
      const { unmount } = render(
        <Button variant={variant as "primary"}>Action</Button>
      );

      const button = screen.getByRole("button");
      inheritedByAll.forEach((className) => {
        expect(button).toHaveClass(className);
      });
      unmount();
    }
  });

  it("lets the ghost variant override the conflicting rounded/transition base classes", () => {
    render(<Button variant="ghost">Action</Button>);

    const button = screen.getByRole("button");
    // tailwind-merge keeps the later (variant) classes and drops the base ones.
    expect(button).toHaveClass("rounded-sm", "transition");
    expect(button).not.toHaveClass("rounded-3xl", "transition-opacity");
  });
});

describe("Button sizes", () => {
  it.each(Object.entries(sizeClasses))(
    "renders the %s size with its built-in classes",
    (size, expected) => {
      render(<Button size={size as "sm"}>Action</Button>);

      const button = screen.getByRole("button");
      expected.forEach((className) => {
        expect(button).toHaveClass(className);
      });
    }
  );
});

describe("Button composition", () => {
  it("merges a custom className on top of the built-in styles", () => {
    render(<Button className="mx-auto">Action</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("mx-auto");
    // Built-in classes remain present.
    expect(button).toHaveClass("font-semibold");
  });

  it("lets a custom className override a conflicting built-in via tailwind-merge", () => {
    render(<Button className="py-1">Action</Button>);

    const button = screen.getByRole("button");
    // tailwind-merge keeps the tail (custom), so the default md padding is dropped.
    expect(button).not.toHaveClass("py-3");
    expect(button).toHaveClass("py-1");
  });

  it("forwards additional HTML attributes to the <button>", () => {
    render(
      <Button id="cta" aria-label="Sign up for the newsletter" type="submit">
        Action
      </Button>
    );

    const button = screen.getByRole("button", {
      name: "Sign up for the newsletter",
    });
    expect(button).toHaveAttribute("id", "cta");
    expect(button).toHaveAttribute("type", "submit");
  });
});

describe("Button behavior", () => {
  it("invokes the onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Action</Button>);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not invoke onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button onClick={onClick} disabled>
        Action
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies the disabled styling classes", () => {
    render(<Button disabled>Action</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    [
      "disabled:bg-gray-200",
      "disabled:opacity-85",
      "disabled:cursor-auto",
    ].forEach((className) => expect(button).toHaveClass(className));
  });

  it("forwards a ref bound to the rendered button element", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Action</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.tagName).toBe("BUTTON");
  });
});
