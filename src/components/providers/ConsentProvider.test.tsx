import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ConsentProvider, useConsent } from "./ConsentProvider";
import { createFakeStorage } from "@/lib/consent/storage";

// ── Consumer component ────────────────────────────────────────────

function Consumer() {
  const { status, accept, decline, reset } = useConsent();

  return (
    <div>
      <span data-testid="status">{status}</span>
      <button data-testid="btn-accept" onClick={accept}>
        Accept
      </button>
      <button data-testid="btn-decline" onClick={decline}>
        Decline
      </button>
      <button data-testid="btn-reset" onClick={reset}>
        Reset
      </button>
    </div>
  );
}

// ── Tests ─────────────────────────────────────────────────────────

describe("ConsentProvider", () => {
  it("reads initial status from storage", () => {
    const storage = createFakeStorage("accepted");
    render(
      <ConsentProvider storage={storage}>
        <Consumer />
      </ConsentProvider>
    );
    expect(screen.getByTestId("status")).toHaveTextContent("accepted");
  });

  it("defaults to undecided when no prior consent", () => {
    render(
      <ConsentProvider>
        <Consumer />
      </ConsentProvider>
    );
    expect(screen.getByTestId("status")).toHaveTextContent("undecided");
  });

  it("accept() persists consent and updates status", async () => {
    const storage = createFakeStorage();

    render(
      <ConsentProvider storage={storage}>
        <Consumer />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByTestId("btn-accept"));

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("accepted");
    });
    expect(storage.getConsent()).toBe("accepted");
  });

  it("decline() persists consent and updates status", async () => {
    const storage = createFakeStorage();

    render(
      <ConsentProvider storage={storage}>
        <Consumer />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByTestId("btn-decline"));

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("declined");
    });
    expect(storage.getConsent()).toBe("declined");
  });

  it("reset() clears consent and reverts to undecided", async () => {
    const storage = createFakeStorage("accepted");

    render(
      <ConsentProvider storage={storage}>
        <Consumer />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByTestId("btn-reset"));

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("undecided");
    });
    expect(storage.getConsent()).toBe("undecided");
  });
});

describe("useConsent", () => {
  it("throws when called outside ConsentProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    function BadConsumer() {
      useConsent();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      "useConsent() must be used within a <ConsentProvider>"
    );

    spy.mockRestore();
  });
});
