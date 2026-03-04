import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils";

type BoxProps = ComponentProps<"div">;

export function Box({ className, ...props }: BoxProps) {
  return (
    <div
      data-slot="box"
      className={cn(className)}
      {...props}
    />
  );
}
