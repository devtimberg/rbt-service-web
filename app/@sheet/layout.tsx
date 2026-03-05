"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/shared/lib/routes";
import {
  LayoutSheet,
  LayoutSheetContent,
  LayoutSheetTitle,
} from "@/shared/ui/kit/layout-sheet";

const SHEET_CLOSE_DURATION_MS = 300;

export default function SheetLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isSheetRoute = pathname !== ROUTES.HOME;
  const [open, setOpen] = useState(isSheetRoute);
  const [renderedChildren, setRenderedChildren] = useState<ReactNode>(
    isSheetRoute ? children : null,
  );
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      if (backTimerRef.current) {
        clearTimeout(backTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isSheetRoute) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      if (backTimerRef.current) {
        clearTimeout(backTimerRef.current);
        backTimerRef.current = null;
      }

      const frameId = requestAnimationFrame(() => {
        setRenderedChildren(children);
        setOpen(true);
      });
      return () => {
        cancelAnimationFrame(frameId);
      };
    }

    if (renderedChildren) {
      const frameId = requestAnimationFrame(() => {
        setOpen(false);
      });

      closeTimerRef.current = setTimeout(() => {
        setRenderedChildren(null);
        closeTimerRef.current = null;
      }, SHEET_CLOSE_DURATION_MS);

      return () => {
        cancelAnimationFrame(frameId);
      };
    }
  }, [children, isSheetRoute, renderedChildren]);

  if (!renderedChildren) return null;

  return (
    <LayoutSheet
      modal={false}
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen || !isSheetRoute || backTimerRef.current) {
          return;
        }

        setOpen(false);
        backTimerRef.current = setTimeout(() => {
          backTimerRef.current = null;
          router.back();
        }, SHEET_CLOSE_DURATION_MS);
      }}
    >
      <LayoutSheetContent
        side="bottom"
        showCloseButton={false}
        className="h-[calc(100%-140px)] max-h-[calc(100%-140px)] rounded-[40px] border-0"
      >
        <LayoutSheetTitle className="sr-only">Страница</LayoutSheetTitle>
        <div className="text-primary h-full overflow-y-auto overscroll-y-contain px-4 py-6">
          {renderedChildren}
        </div>
      </LayoutSheetContent>
    </LayoutSheet>
  );
}
