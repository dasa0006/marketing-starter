import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useButtonTracking } from "./useButtonTracking";
import { configureTracking, _resetForTesting } from "@/lib/events";

beforeEach(() => {
  _resetForTesting();
  document.cookie = "consent-status=; path=/; max-age=0";
});

describe("useButtonTracking", () => {
  it("calls the original onClick handler", () => {
    const onClick = vi.fn();
    const handler = renderHook(() =>
      useButtonTracking(onClick, "test-button", "primary")
    ).result.current;

    const event = new MouseEvent("click", { bubbles: true });
    handler(event as unknown as React.MouseEvent<HTMLButtonElement>);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not error when onClick is undefined", () => {
    const handler = renderHook(() =>
      useButtonTracking(undefined, "test-button")
    ).result.current;

    const event = new MouseEvent("click", { bubbles: true });
    expect(() => {
      handler(event as unknown as React.MouseEvent<HTMLButtonElement>);
    }).not.toThrow();
  });

  it("fires tracking event when trackingLabel is provided", () => {
    document.cookie = "consent-status=accepted; path=/; SameSite=Lax";
    const adapter = vi.fn();
    configureTracking(adapter);

    const handler = renderHook(() =>
      useButtonTracking(undefined, "my-button", "secondary")
    ).result.current;

    const event = new MouseEvent("click", { bubbles: true });
    handler(event as unknown as React.MouseEvent<HTMLButtonElement>);

    expect(adapter).toHaveBeenCalledTimes(1);
    const tracked = adapter.mock.calls[0][0];
    expect(tracked.name).toBe("button_click");
    expect(tracked.label).toBe("my-button");
    expect(tracked.variant).toBe("secondary");
  });

  it("does not fire tracking when trackingLabel is undefined", () => {
    document.cookie = "consent-status=accepted; path=/; SameSite=Lax";
    const adapter = vi.fn();
    configureTracking(adapter);

    const handler = renderHook(() => useButtonTracking(undefined, undefined))
      .result.current;

    const event = new MouseEvent("click", { bubbles: true });
    handler(event as unknown as React.MouseEvent<HTMLButtonElement>);

    expect(adapter).not.toHaveBeenCalled();
  });

  it("does not fire tracking when event is defaultPrevented", () => {
    document.cookie = "consent-status=accepted; path=/; SameSite=Lax";
    const adapter = vi.fn();
    configureTracking(adapter);

    const handler = renderHook(() =>
      useButtonTracking(undefined, "prevented-button")
    ).result.current;

    const event = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(event, "defaultPrevented", { value: true });
    handler(event as unknown as React.MouseEvent<HTMLButtonElement>);

    expect(adapter).not.toHaveBeenCalled();
  });

  it("uses 'primary' as default variant", () => {
    document.cookie = "consent-status=accepted; path=/; SameSite=Lax";
    const adapter = vi.fn();
    configureTracking(adapter);

    const handler = renderHook(() => useButtonTracking(undefined, "no-variant"))
      .result.current;

    const event = new MouseEvent("click", { bubbles: true });
    handler(event as unknown as React.MouseEvent<HTMLButtonElement>);

    expect(adapter).toHaveBeenCalledTimes(1);
    expect(adapter.mock.calls[0][0].variant).toBe("primary");
  });
});
