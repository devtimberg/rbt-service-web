import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

type LayoutSheetProps = ComponentProps<"section"> & {
  animated?: boolean;
};

export function LayoutSheet({
  className,
  children,
  animated = true,
  ...props
}: LayoutSheetProps) {
  return (
    <section
      data-slot="layout-sheet"
      className={cn(
        "bg-background flex h-full min-h-0 flex-col overflow-hidden rounded-t-[28px] shadow-2xl",
        animated &&
          "animate-in fade-in-0 transition-opacity ease-in-out duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
