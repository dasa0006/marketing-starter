import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureTracking, track, _resetForTesting } from "@/lib/events";

beforeEach(() => {
  _resetForTesting();
});

describe("track.event", () => {
  it("throws if configureTracking is called more than once", () => {
    configureTracking(() => {});
    expect(() => configureTracking(() => {})).toThrow(
      "configureTracking() called more than once"
    );
  });

  it("does not throw when called without an adapter (dev fallback)", () => {
    expect(() => track.event("time_on_page_30s")).not.toThrow();
    expect(() =>
      track.event("button_click", { label: "Test", variant: "primary" })
    ).not.toThrow();
  });

  it("passes events to the adapter on accepted consent", () => {
    document.cookie = "consent-status=accepted; path=/; SameSite=Lax";

    const adapter = vi.fn();
    configureTracking(adapter);

    track.event("link_click", {
      url: "/test",
      label: "Test Link",
      newTab: false,
    });

    expect(adapter).toHaveBeenCalledTimes(1);
    const event = adapter.mock.calls[0][0];
    expect(event.name).toBe("link_click");
    expect(event.url).toBe("/test");
    expect(event.label).toBe("Test Link");
    expect(event.newTab).toBe(false);
    expect(event.timestamp).toEqual(expect.any(Number));
    expect(event.metadata).toEqual({
      path: expect.any(String),
      locale: expect.any(String),
    });
  });

  it("drops events when consent is not accepted", () => {
    document.cookie = "consent-status=declined; path=/; SameSite=Lax";

    const adapter = vi.fn();
    configureTracking(adapter);

    track.event("page_view", { path: "/" });

    expect(adapter).not.toHaveBeenCalled();
  });
});
