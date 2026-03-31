import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const chipVariants = cva(
  "inline-flex cursor-pointer items-center justify-center rounded-full border text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white text-primary-500 hover:bg-gray-50",
        selected: "border-transparent bg-primary-500 text-white",
      },
      size: {
        sm: "px-4 py-1.5",
        md: "px-5 py-2",
        lg: "px-8 py-4 font-semibold text-lg leading-[22px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
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
  ({ className, selected, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          chipVariants({
            variant: selected ? "selected" : (variant ?? "default"),
            size,
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
