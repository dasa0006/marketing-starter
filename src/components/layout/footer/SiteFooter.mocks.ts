import type { SiteFooterProps } from "./SiteFooter.types";

/**
 * Returns default props for SiteFooter stories and tests.
 *
 * Social links with icons are defined inline in the component as defaults,
 * so mocks only need to provide overrides.
 */
export function mockFooterProps(
  overrides: Partial<SiteFooterProps> = {}
): SiteFooterProps {
  return {
    ...overrides,
  };
}
