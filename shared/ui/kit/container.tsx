import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils";

type ContainerProps = ComponentProps<"div">;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full md:max-w-[1440px] md:px-10", className)}
      {...props}
    />
  );
}
