"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dialog as SheetPrimitive } from "radix-ui";
import { ROUTES } from "@/shared/lib/routes";
import { LayoutSheetContent } from "@/shared/ui/kit/layout-sheet";

const SHEET_CLOSE_DURATION_MS = 300;
const SHEET_TOP_OFFSET_CLASS =
  "top-[calc(40px+2*clamp(16px,4vh,40px))] lg:top-[calc(16px+40px+2*clamp(16px,4vh,40px))]";
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
  const [open, setOpen] = useState(isSheetRoute);
  const [renderedChildren, setRenderedChildren] = useState<ReactNode>(
    isSheetRoute ? children : null,
  );
  const [sheetTopOffset, setSheetTopOffset] = useState<number | null>(null);
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

  useEffect(() => {
    if (!renderedChildren) {
      return;
    }

    const updateSheetTopOffset = () => {
      const header = document.querySelector<HTMLElement>(
        '[data-layout-header="true"]',
      );

      if (!header) {
        return;
      }

      const nextTopOffset = Math.round(header.getBoundingClientRect().bottom);
      setSheetTopOffset((current) =>
        current === nextTopOffset ? current : nextTopOffset,
      );
    };

    updateSheetTopOffset();
    window.addEventListener("resize", updateSheetTopOffset);

    const header = document.querySelector<HTMLElement>('[data-layout-header="true"]');
    let resizeObserver: ResizeObserver | null = null;

    if (header && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateSheetTopOffset);
      resizeObserver.observe(header);
    }

    return () => {
      window.removeEventListener("resize", updateSheetTopOffset);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [renderedChildren]);

  if (!renderedChildren) return null;
  if (!isHydrated && isSheetRoute) {
    return (
      <div
        className={`bg-background text-primary fixed inset-x-0 bottom-0 z-30 flex flex-col gap-4 rounded-t-[40px] rounded-b-none border-0 shadow-lg sm:z-50 lg:rounded-[40px] ${SHEET_TOP_OFFSET_CLASS}`}
      >
        <div className="text-primary h-full overflow-y-auto overscroll-y-contain px-4 py-6">
          {renderedChildren}
        </div>
      </div>
    );
  }

  return (
    <SheetPrimitive.Root
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
        className={`z-30 rounded-t-[40px] rounded-b-none border-0 sm:z-50 lg:rounded-[40px] ${SHEET_TOP_OFFSET_CLASS}`}
        style={sheetTopOffset === null ? undefined : { top: `${sheetTopOffset}px` }}
      >
        <div className="text-primary h-full overflow-y-auto overscroll-y-contain px-4 py-6">
          {renderedChildren}
        </div>
      </LayoutSheetContent>
    </SheetPrimitive.Root>
  );
}
