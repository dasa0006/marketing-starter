import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes (falsy values omitted)", () => {
    const result = cn(
      "base",
      false && "hidden",
      null,
      undefined,
      0 as unknown as string
    );
    expect(result).toBe("base");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    // tailwind-merge should keep only the last padding class
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("handles object syntax", () => {
    expect(cn({ "font-bold": true, hidden: false })).toBe("font-bold");
  });

  it("handles array syntax", () => {
    expect(cn(["a", "b"], ["c"])).toBe("a b c");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });

  it("handles mixed string, object, and array inputs", () => {
    expect(cn("base", { active: true, disabled: false }, ["extra"])).toBe(
      "base active extra"
    );
  });
});
