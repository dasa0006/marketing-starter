import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode, Ref } from "react";

/**
 * The heading tags this component can render. Keeping them to the six
 * semantic levels prevents misusing a heading slot — every h1–h6 maps to a
 * real document outline node.
 */
export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * A semantic, polymorphic heading with marketing-oriented type defaults.
 *
 * Renders the heading level you ask for via the `as` prop (defaults to
 * `h1`). Because each heading maps to a real semantic tag, you can build a
 * correct document outline — exactly one `h1` per page, sub-sections as
 * `h2`/`h3` with no skipped levels — while the component provides a single,
 * consistent visual language out of the box (responsive sizing,
 * `text-pretty` wrapping, and tight tracking). Every level keeps the same
 * base type scale, so pass `className` when a lower-level heading should
 * render smaller.
 *
 * @param as - The semantic heading tag to render: one of `"h1"`–`"h6"`.
 *   Defaults to `"h1"`. Pick the level implied by the surrounding document
 *   structure, not the visual weight you want — style those via `className`.
 * @param children - The text or nodes rendered inside the heading. Pass a
 *   plain string for simple copy, or richer content such as a `<span>` run
 *   to accent a word.
 * @param className - Optional classes appended after the built-in styles.
 *   Use it to override sizing, colour, alignment, or margin. Because it is
 *   merged last with `cn`, later utilities (e.g. `text-center`,
 *   `text-lg`) win over the defaults.
 * @param ref - A ref bound to the rendered heading element
 *   (`HTMLHeadingElement`).
 * @param props - Any additional attributes valid on a heading element, such
 *   as `id`, `aria-label`, `data-*` hooks, or event handlers.
 *
 * @example
 * ```tsx
 * import Heading from "@/components/layout/heading/Heading";
 *
 * export default function Hero() {
 *   return (
 *     <section>
 *       <Heading>Grow your audience with content that converts</Heading>
 *       <Heading as="h2" className="text-xl">
 *         The playbook behind fast-growing blogs
 *       </Heading>
 *     </section>
 *   );
 * }
 * ```
 */
export interface IHeading extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag;
  children?: ReactNode;
  ref?: Ref<HTMLHeadingElement>;
}

const Heading = ({
  as: Tag = "h1",
  children,
  className,
  ref,
  ...props
}: IHeading) => {
  return (
    <Tag
      ref={ref}
      className={cn(
        "text-4xl sm:text-5xl text-pretty font-semibold tracking-tight text-zinc-800",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Heading;
