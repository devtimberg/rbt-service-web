import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  `font-semibold inline-flex items-center justify-center whitespace-nowrap text-body transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed`,
  {
    variants: {
      variant: {
        default:
          "bg-button-default text-button-default-foreground hover:bg-button-default/90",
        primary: "bg-[#011232] text-inverse hover:bg-button-primary/90",
        secondary:
          "bg-primary-100/10 text-button-secondary-foreground hover:bg-primary-100/15",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-link hover:text-link/90",
        inverse: "text-inverse bg-primary-900",
      },
      size: {
        md: "px-6 h-12 inline text-[16px] leading-[16px]",
        sm: "h-9 px-3 text-[14px] leading-[18px]",
        xs: "h-7 px-3",
        lg: "h-12  px-4",
        full: "w-full py-2",
        icon: "h-10 w-10",
        iconRight:
          "gap-2 h-10 pr-3 pl-4 bg-primary-700 text-primary-foreground hover:bg-primary-700/90",
      },
      rounded: {
        default: "rounded-[12px]",
        full: "rounded-full",
        md: "rounded-md",
        lg: "rounded-lg",
      },
    },
    compoundVariants: [
      {
        variant: "link",
        className: "p-0 m-0 h-auto rounded-none",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      loading = false,
      children,
      disabled,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild && disabled ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "relative flex cursor-pointer items-center justify-center",
        )}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-current" />
          </span>
        ) : null}
        <span className={loading ? "invisible" : ""}>
          <Slottable>{children}</Slottable>
        </span>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
