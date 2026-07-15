import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollLock } from "./useScrollLock";

describe("useScrollLock", () => {
  it("sets overflow hidden on body when locked", () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores original overflow when unlocked", () => {
    document.body.style.overflow = "auto";

    const { rerender } = renderHook(
      (locked: boolean) => useScrollLock(locked),
      { initialProps: true }
    );
    expect(document.body.style.overflow).toBe("hidden");

    rerender(false);
    expect(document.body.style.overflow).toBe("auto");
  });

  it("restores original overflow on unmount", () => {
    document.body.style.overflow = "scroll";

    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("does not change overflow when not locked", () => {
    document.body.style.overflow = "auto";
    renderHook(() => useScrollLock(false));
    expect(document.body.style.overflow).toBe("auto");
  });
});
