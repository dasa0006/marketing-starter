import type { TextBlockProps } from "./TextBlock.types";

export const mockTextBlockProps: TextBlockProps = {
  heading: "About This Template",
  content:
    "This marketing starter is built on Next.js with TypeScript, Tailwind CSS, and a composable block architecture.\n\nIt includes i18n support via next-intl, dark mode with next-themes, cookie consent management, and an event tracking system.\n\nEvery component follows consistent patterns with co-located types, mocks, stories, and CSS layers.",
};

export const mockTextBlockNoHeading: TextBlockProps = {
  content:
    "This is a simple text block without a heading. Use it for prose content, mission statements, or any body copy that needs more space than a typical paragraph.\n\nEach paragraph is separated by a blank line in the source string.",
};

export const mockTextBlockSingleParagraph: TextBlockProps = {
  heading: "Mission Statement",
  content:
    "We believe in building web experiences that are fast, accessible, and delightful. Our starter template gives teams a production-grade foundation so they can focus on what makes their brand unique.",
};
