"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Box } from "./box";

const SHEET_FOOTER_SLOT_ID = "sheet-footer-slot";

export function SheetFooterSlotTarget() {
  return <div id={SHEET_FOOTER_SLOT_ID} />;
}

export function SheetFooterSlot({
  children,
  className,
  contentClassName,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(() => {
      setTarget(document.getElementById(SHEET_FOOTER_SLOT_ID));
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (!target) return null;
  return createPortal(
    <Box
      className={cn(
        "shadow-primary-900/15 flex items-center justify-center rounded-t-[24px] bg-[#F7FAFF] px-4 py-4 shadow-[0_-0px_60px_-0px]",
        className,
      )}
    >
      <Box
        className={cn(
          "flex w-full max-w-360 items-center",
          contentClassName,
        )}
      >
        {children}
      </Box>
    </Box>,
    target,
  );
}
