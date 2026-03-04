import type { CSSProperties, HTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

type VStackProps = HTMLAttributes<HTMLDivElement> & {
  gap?: number | string;
};

export function VStack({ className, gap, style, ...props }: VStackProps) {
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
      data-slot="v-stack"
      className={cn("flex flex-col", className)}
      style={mergedStyle}
      {...props}
    />
  );
}
