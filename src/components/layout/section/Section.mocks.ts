import type {
  SectionProps,
  SectionSize,
  SectionSurface,
} from "./Section.types";

export const sectionSizes: SectionSize[] = ["sm", "md", "lg", "xl"];
export const sectionSurfaces: SectionSurface[] = [
  "white",
  "subtle",
  "dark",
  "accent",
];

export function mockSectionProps(
  overrides: Partial<SectionProps> = {}
): SectionProps {
  return {
    children: "Section content",
    ...overrides,
  };
}
