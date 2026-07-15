export interface TextBlockProps {
  /** Additional CSS class names. */
  className?: string;
  /** Optional heading displayed above the content. */
  heading?: string;
  /** Body content rendered as paragraphs (split on `\n\n`). */
  content: string;
}
