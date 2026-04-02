import * as React from "react";
import { CheckIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

import { cn } from "@/shared/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `peer data-[state=checked]:border-primary-300
        data-[state=checked]:bg-primary-300 data-[state=checked]:text-inverse
        size-4.5 shrink-0 rounded-sm border-2 border-[#DEE9FE] bg-[#F7FAFF]
        transition-colors outline-none disabled:cursor-not-allowed
        disabled:opacity-50`,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3 stroke-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
