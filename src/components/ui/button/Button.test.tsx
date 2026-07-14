import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";
import { configureTracking, _resetForTesting } from "@/lib/events";

beforeEach(() => {
  _resetForTesting();
  // Reset cookies
  document.cookie = "consent-status=; path=/; max-age=0";
});

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("applies the default variant class", () => {
    render(<Button>Click</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("btn-primary");
  });

  it("applies a custom variant class", () => {
    render(<Button variant="secondary">Click</Button>);
    expect(screen.getByRole("button").className).toContain("btn-secondary");
  });

  it("applies a custom size class", () => {
    render(<Button size="lg">Click</Button>);
    expect(screen.getByRole("button").className).toContain("btn-lg");
  });

  it("shows loading state and disables the button", () => {
    render(<Button loading>Loading</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    // Spinner icon should be present
    expect(btn.querySelector("svg")).toBeInTheDocument();
  });

  it("hides left icon when loading", () => {
    render(
      <Button loading leftIcon={<span data-testid="left-icon">*</span>}>
        Loading
      </Button>
    );
    // Spinner replaces the left icon
    expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
  });

  it("renders left icon", () => {
    render(
      <Button leftIcon={<span data-testid="left-icon">*</span>}>Click</Button>
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders right icon", () => {
    render(
      <Button rightIcon={<span data-testid="right-icon">*</span>}>Click</Button>
    );
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Click
      </Button>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Click
      </Button>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards the ref", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Click</Button>);
    expect(ref).toHaveBeenCalledOnce();
  });

  it("renders with additional className", () => {
    render(<Button className="extra-class">Click</Button>);
    expect(screen.getByRole("button").className).toContain("extra-class");
  });

  it("fires tracking event when trackingLabel is provided", () => {
    // Set consent to accepted so events get dispatched
    document.cookie = "consent-status=accepted; path=/; SameSite=Lax";

    const adapter = vi.fn();
    configureTracking(adapter);

    render(
      <Button trackingLabel="test-button" variant="primary">
        Tracked
      </Button>
    );
    fireEvent.click(screen.getByRole("button", { name: "Tracked" }));

    expect(adapter).toHaveBeenCalledTimes(1);
    const event = adapter.mock.calls[0][0];
    expect(event.name).toBe("button_click");
    expect(event.label).toBe("test-button");
    expect(event.variant).toBe("primary");
  });
});
