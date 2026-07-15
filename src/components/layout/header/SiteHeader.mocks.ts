import type { HeaderProps } from "./SiteHeader.types";

export function mockHeaderProps(
  overrides: Partial<HeaderProps> = {}
): HeaderProps {
  return {
    ...overrides,
  };
}
