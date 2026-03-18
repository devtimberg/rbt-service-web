import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cn } from "@/shared/lib/utils";

function LayoutSheetContent({
  className,
  children,
  side = "right",
  disableOpenAnimation = false,
  disablePortal = false,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  disableOpenAnimation?: boolean;
  disablePortal?: boolean;
}) {
  const content = (
    <SheetPrimitive.Content
      data-slot="layout-sheet-content"
      className={cn(
        "bg-background text-primary fixed z-50 flex flex-col gap-4 shadow-lg transition-[top,transform,opacity] ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300",
        disableOpenAnimation
          ? "data-[state=open]:animate-none data-[state=open]:duration-0"
          : "data-[state=open]:animate-in data-[state=open]:duration-300",
        side === "right" &&
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
        side === "left" &&
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        side === "top" &&
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
        side === "bottom" &&
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto lg:bottom-4 lg:mx-4",
        className,
      )}
      onInteractOutside={(event) => event.preventDefault()}
      onEscapeKeyDown={(event) => event.preventDefault()}
      {...props}
    >
      <SheetPrimitive.Title className="sr-only">
        Страница
      </SheetPrimitive.Title>
      {children}
    </SheetPrimitive.Content>
  );

  if (disablePortal) {
    return content;
  }

  return <SheetPrimitive.Portal data-slot="layout-sheet-portal">{content}</SheetPrimitive.Portal>;
}
export { LayoutSheetContent };
