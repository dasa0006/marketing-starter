import { describe, it, expect, afterEach, vi } from "vitest";
import { getCspPolicy } from "./csp";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getCspPolicy", () => {
  it("allows unsafe-eval in development and omits upgrade-insecure-requests", () => {
    vi.stubEnv("NODE_ENV", "development");

    const policy = getCspPolicy();

    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    expect(policy).toContain("style-src 'self' 'unsafe-inline'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).not.toContain("upgrade-insecure-requests");
  });

  it("drops unsafe-eval and adds upgrade-insecure-requests in production", () => {
    vi.stubEnv("NODE_ENV", "production");

    const policy = getCspPolicy();

    expect(policy).toContain("script-src 'self' 'unsafe-inline'");
    expect(policy).not.toContain("'unsafe-eval'");
    expect(policy).toContain("upgrade-insecure-requests");
  });
});
