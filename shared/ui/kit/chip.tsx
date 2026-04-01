import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const chipVariants = cva(
  "inline-flex cursor-pointer items-center justify-center border font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white text-primary-500 hover:bg-gray-50",
        selected: "border-transparent bg-primary-500 text-white",
        "outline-default": "border-border-default bg-transparent text-tertiary",
        "outline-selected": "border-transparent bg-primary-500 text-white",
      },
      size: {
        sm: "px-4 py-1.5 text-sm",
        md: "px-5 py-2 text-sm",
        lg: "px-5 py-2 sm:text-sm sm:px-6 sm:py-3 sm:text-base sm:font-semibold",
      },
      rounded: {
        full: "rounded-full",
        md: "rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "full",
    },
  },
);

export interface ChipProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  selected?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, variant, size, rounded, ...props }, ref) => {
    const isOutline = variant === "outline-default" || variant === "outline-selected";
    const resolvedVariant = selected
      ? (isOutline ? "outline-selected" : "selected")
      : (variant ?? "default");

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          chipVariants({
            variant: resolvedVariant,
            size,
            rounded,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
