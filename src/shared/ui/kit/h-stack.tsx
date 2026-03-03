import type { CSSProperties, HTMLAttributes } from "react";

import { cn } from "@/src/shared/lib/utils";

type HStackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: number | string;
};

export function HStack({ className, gap, style, ...props }: HStackProps) {
  const resolvedGap = typeof gap === "number" ? `${gap * 0.25}rem` : gap;

  const mergedStyle =
    gap === undefined
      ? style
      : ({
          ...(style ?? {}),
          gap: resolvedGap,
        } satisfies CSSProperties);

  return (
    <div
      data-slot="h-stack"
      className={cn("flex flex-row", className)}
      style={mergedStyle}
      {...props}
    />
  );
}
