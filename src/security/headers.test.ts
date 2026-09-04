import { describe, it, expect, afterEach, vi } from "vitest";
import { createSecurityHeaders, type SecurityHeader } from "./headers";

afterEach(() => {
  vi.unstubAllEnvs();
});

function header(
  headers: SecurityHeader[],
  key: string
): SecurityHeader | undefined {
  return headers.find((h) => h.key === key);
}

describe("createSecurityHeaders", () => {
  it("returns the base security headers in non-production", () => {
    vi.stubEnv("NODE_ENV", "development");

    const headers = createSecurityHeaders();

    expect(header(headers, "Content-Security-Policy")).toBeDefined();
    expect(header(headers, "X-Content-Type-Options")).toEqual({
      key: "X-Content-Type-Options",
      value: "nosniff",
    });
    expect(header(headers, "X-Frame-Options")).toEqual({
      key: "X-Frame-Options",
      value: "DENY",
    });
    expect(header(headers, "Referrer-Policy")).toEqual({
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    });
    expect(header(headers, "Permissions-Policy")).toEqual({
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    });
    expect(header(headers, "Strict-Transport-Security")).toBeUndefined();
  });

  it("adds Strict-Transport-Security in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    const headers = createSecurityHeaders();

    expect(header(headers, "Strict-Transport-Security")).toEqual({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });
  });
});
