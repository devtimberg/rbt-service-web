"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const SHEET_FOOTER_SLOT_ID = "sheet-footer-slot";

export function SheetFooterSlotTarget() {
  return <div id={SHEET_FOOTER_SLOT_ID} />;
}

export function SheetFooterSlot({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(() => {
      setTarget(document.getElementById(SHEET_FOOTER_SLOT_ID));
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (!target) return null;
  return createPortal(children, target);
}
