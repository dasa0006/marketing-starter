import { cva } from "class-variance-authority";

/**
 * The shared visual language for button-like controls.
 *
 * Kept in its own module so both `Button` and `LinkButton` import the exact
 * same styling config from a neutral location, rather than one component
 * importing from the other.
 *
 * Variants change the surface (fill) colour, sizes change padding and type
 * scale, and the base string carries the interaction affordances shared by
 * every combination (`cursor-pointer`, rounded corners, opacity hover, and the
 * disabled treatment).
 */
export const buttonVariants = cva(
  "cursor-pointer rounded-3xl transition-opacity hover:opacity-85 font-semibold text-white disabled:bg-gray-200 disabled:opacity-85 disabled:cursor-auto",
  {
    variants: {
      variant: {
        primary: "bg-[#091057]",
        secondary: "bg-[#024CAA]",
        accent: "bg-[#EC8305]",
        ghost:
          "text-black rounded-sm transition hover:bg-gray-100 disabled:text-white",
      },
      size: {
        sm: "py-2 px-4 text-sm",
        md: "py-3 px-6 text-base",
        lg: "py-4 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
