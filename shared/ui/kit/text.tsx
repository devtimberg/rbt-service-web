import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const textVariants = cva("cursor-default font-normal", {
  variants: {
    variant: {
      default: "text-primary",
      secondary: "text-secondary",
      disabled: "text-disabled",
      error: "text-input-error-message !leading-5",
    },
    size: {
      default: "text-base",
      xs: "text-xs",
      sm: "text-sm",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  asChild?: boolean;
  element?: React.ElementType; // Добавлен новый пропс для определения элемента
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      children,
      asChild = false,
      element = "p",
      variant,
      size,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : element; // Использование нового пропса element
    return (
      <Comp
        className={cn(textVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);

Text.displayName = "Text";

export { Text, textVariants };
