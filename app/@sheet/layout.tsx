"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/shared/lib/routes";
import {
  LayoutSheet,
  LayoutSheetContent,
  LayoutSheetTitle,
} from "@/shared/ui/kit/layout-sheet";

const SHEET_CLOSE_DURATION_MS = 300;
const SHEET_ROUTES = new Set<string>([
  ROUTES.CATALOG,
  ROUTES.FAVORITE,
  ROUTES.COMPARE,
  ROUTES.CART,
  ROUTES.PROFILE,
]);

export default function SheetLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isSheetRoute = SHEET_ROUTES.has(pathname);
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const hasSheetHistoryState =
    typeof window !== "undefined" && Boolean(window.history.state?.sheet);
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

      const shouldSyncContent = renderedChildren !== children;
      const shouldOpenSheet = !open;

      if (!shouldSyncContent && !shouldOpenSheet) {
        return;
      }

      const frameId = requestAnimationFrame(() => {
        if (shouldSyncContent) {
          setRenderedChildren(children);
        }

        if (shouldOpenSheet) {
          setOpen(true);
        }
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
  }, [children, isSheetRoute, open, renderedChildren]);

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(
      '[data-layout-scroll-container="true"]',
    );

    if (!scrollContainer) {
      return;
    }

    const previousOverflow = scrollContainer.style.overflowY;
    const shouldLockBackgroundScroll = Boolean(renderedChildren);

    if (shouldLockBackgroundScroll) {
      scrollContainer.style.overflowY = "hidden";
    } else {
      scrollContainer.style.overflowY = previousOverflow;
    }

    return () => {
      scrollContainer.style.overflowY = previousOverflow;
    };
  }, [renderedChildren]);

  if (!renderedChildren) return null;
  if (!isHydrated && isSheetRoute) {
    return (
      <div className="bg-background text-primary fixed inset-x-0 bottom-0 z-30 flex h-[calc(100%-140px)] max-h-[calc(100%-140px)] flex-col gap-4 rounded-[40px] border-0 shadow-lg sm:z-50">
        <div className="text-primary h-full overflow-y-auto overscroll-y-contain px-4 py-6">
          {renderedChildren}
        </div>
      </div>
    );
  }

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
          if (window.history.state?.sheet) {
            router.back();
            return;
          }

          router.replace(ROUTES.HOME);
        }, SHEET_CLOSE_DURATION_MS);
      }}
    >
      <LayoutSheetContent
        side="bottom"
        showCloseButton={false}
        className={`z-30 h-[calc(100%-140px)] max-h-[calc(100%-140px)] rounded-[40px] border-0 sm:z-50 ${!hasSheetHistoryState ? "data-[state=open]:animate-none data-[state=open]:duration-0" : ""}`}
      >
        <LayoutSheetTitle className="text-primary sr-only">
          Страница
        </LayoutSheetTitle>
        <div className="text-primary h-full overflow-y-auto overscroll-y-contain px-4 py-6">
          {renderedChildren}
        </div>
      </LayoutSheetContent>
    </LayoutSheet>
  );
}
