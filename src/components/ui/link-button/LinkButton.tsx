import { buttonVariants } from "@/components/ui/button/buttonVariants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { ComponentProps, ReactNode } from "react";

/**
 * A locale-aware link styled like a {@link Button}.
 *
 * Renders the app's next-intl `<Link>` (so `href` is typed against the routing
 * config and the active locale is handled automatically) while reusing the
 * exact same visual language as `Button` via the shared `buttonVariants`.
 *
 * This is deliberately a separate component from `Button` rather than a
 * polymorphic prop: a link *navigates* and a button *performs an action*, and
 * the two have different valid attributes. Notably, links have no native
 * `disabled` state, so `LinkButton` intentionally does not expose `disabled` —
 * pass `aria-disabled` plus a `className` (e.g. `pointer-events-none
 * opacity-50`) when a disabled-looking link is ever required.
 *
 * @param href - The route to navigate to. Required, as a link needs a
 *   destination. Accepts a path string or a URL object (see next-intl's
 *   `Link`), locale-aware via the routing configuration.
 * @param children - The text or nodes rendered inside the link.
 * @param variant - One of `"primary"`, `"secondary"`, `"accent"`, or
 *   `"ghost"`. Defaults to `"primary"`.
 * @param size - One of `"sm"`, `"md"`, or `"lg"`. Defaults to `"md"`.
 * @param className - Optional classes appended after the built-in styles.
 *   Merged last with `cn`, so later utilities win over the defaults.
 * @param props - Any additional attributes valid on an anchor, such as
 *   `target`, `rel`, `aria-label`, `prefetch`, or `locale`.
 *
 * @example
 * ```tsx
 * import LinkButton from "@/components/ui/link-button/LinkButton";
 *
 * export default function Hero() {
 *   return (
 *     <LinkButton href="/pricing" variant="accent" size="lg">
 *       See pricing
 *     </LinkButton>
 *   );
 * }
 * ```
 */
export interface ILinkButton
  extends ComponentProps<typeof Link>, VariantProps<typeof buttonVariants> {
  children?: ReactNode;
}

const LinkButton = ({
  className,
  children,
  variant,
  size,
  ...props
}: ILinkButton) => {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
