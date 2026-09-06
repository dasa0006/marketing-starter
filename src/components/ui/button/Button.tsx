import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { buttonVariants } from "./buttonVariants";

export interface IButton
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  /** A ref bound to the rendered <button> element. */
  ref?: Ref<HTMLButtonElement>;
}

const Button = ({
  className,
  children,
  variant,
  size,
  disabled,
  ref,
  ...props
}: IButton) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || undefined}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
