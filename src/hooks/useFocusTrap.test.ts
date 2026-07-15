import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFocusTrap } from "./useFocusTrap";

function createContainer(): HTMLDivElement {
  const container = document.createElement("div");
  container.innerHTML = `
    <button data-testid="btn-1">First</button>
    <a href="#" data-testid="link-2">Second</a>
    <input data-testid="input-3" />
    <button disabled data-testid="btn-disabled">Disabled</button>
    <span data-testid="span-4">Not focusable</span>
    <button data-testid="btn-5">Last</button>
  `;
  document.body.appendChild(container);
  return container;
}

beforeEach(() => {
  // Ensure no element has initial focus
  if (document.activeElement && "blur" in document.activeElement) {
    (document.activeElement as HTMLElement).blur();
  }
});

describe("useFocusTrap", () => {
  it("focuses the first focusable element when activated", () => {
    const container = createContainer();
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    expect(document.activeElement).toBe(
      container.querySelector('[data-testid="btn-1"]')
    );

    document.body.removeChild(container);
  });

  it("does not trap when active is false", () => {
    const container = createContainer();
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, false));

    // First focusable should NOT be auto-focused
    expect(document.activeElement).not.toBe(
      container.querySelector('[ data-testid="btn-1"]')
    );

    document.body.removeChild(container);
  });

  it("calls onEscape when Escape key is pressed", () => {
    const container = createContainer();
    const ref = { current: container };
    const onEscape = vi.fn();

    renderHook(() => useFocusTrap(ref, true, onEscape));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onEscape).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
  });

  it("traps Tab within the container", () => {
    const container = createContainer();
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    const firstBtn = container.querySelector(
      '[data-testid="btn-1"]'
    ) as HTMLElement;
    const lastBtn = container.querySelector(
      '[data-testid="btn-5"]'
    ) as HTMLElement;

    // Focus the last element, then Tab forward should wrap to first
    lastBtn.focus();
    expect(document.activeElement).toBe(lastBtn);

    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    lastBtn.dispatchEvent(tabEvent);

    // After Tab from last, focus should move to first
    expect(document.activeElement).toBe(firstBtn);

    document.body.removeChild(container);
  });

  it("traps Shift+Tab within the container", () => {
    const container = createContainer();
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    const firstBtn = container.querySelector(
      '[data-testid="btn-1"]'
    ) as HTMLElement;
    const lastBtn = container.querySelector(
      '[data-testid="btn-5"]'
    ) as HTMLElement;

    // Focus the first element, then Shift+Tab should wrap to last
    firstBtn.focus();
    expect(document.activeElement).toBe(firstBtn);

    const shiftTabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    firstBtn.dispatchEvent(shiftTabEvent);

    expect(document.activeElement).toBe(lastBtn);

    document.body.removeChild(container);
  });

  it("restores focus to previously focused element on deactivation", () => {
    const container = createContainer();
    const ref = { current: container };

    // Set up a previously focused element
    const outsideBtn = document.createElement("button");
    outsideBtn.textContent = "Outside";
    document.body.appendChild(outsideBtn);
    outsideBtn.focus();

    const { unmount } = renderHook(() => useFocusTrap(ref, true));

    // Focus is now on the first focusable in the trap
    unmount();

    // Focus should be restored to the outside button
    expect(document.activeElement).toBe(outsideBtn);

    document.body.removeChild(container);
    document.body.removeChild(outsideBtn);
  });
});
