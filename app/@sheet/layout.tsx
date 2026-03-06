"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dialog as SheetPrimitive } from "radix-ui";
import { ROUTES, getRouteConfig } from "@/shared/lib/routes";
import { Heading } from "@/shared/ui/kit";
import { LayoutSheetContent } from "@/shared/ui/kit/layout-sheet";

const SHEET_CLOSE_DURATION_MS = 300;
const SHEET_TOP_OFFSET_NORMAL_CLASS =
  "top-[calc(40px+2*clamp(16px,4vh,40px))] sm:top-[calc(40px+2*clamp(16px,4vh,40px))] lg:top-[calc(16px+40px+2*clamp(16px,4vh,40px))]";
const SHEET_TOP_OFFSET_COMPACT_CLASS =
  "top-[calc(40px+2*(clamp(16px,4vh,40px)/1.5))] sm:top-[calc(40px+2*clamp(16px,4vh,40px))] lg:top-[calc(16px+40px+2*clamp(16px,4vh,40px))]";

export default function SheetLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isSheetRoute = pathname !== ROUTES.HOME;
  const [disableInitialOpenAnimation, setDisableInitialOpenAnimation] =
    useState(isSheetRoute);
  const [open, setOpen] = useState(isSheetRoute);
  const [renderedRoute, setRenderedRoute] = useState<string | null>(
    isSheetRoute ? pathname : null,
  );
  const sheetTopOffsetClass = isSheetRoute
    ? SHEET_TOP_OFFSET_COMPACT_CLASS
    : SHEET_TOP_OFFSET_NORMAL_CLASS;
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
    if (!disableInitialOpenAnimation) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      setDisableInitialOpenAnimation(false);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [disableInitialOpenAnimation]);

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

      const shouldSyncContent = renderedRoute !== pathname;
      const shouldOpenSheet = !open;

      if (!shouldSyncContent && !shouldOpenSheet) {
        return;
      }

      const frameId = requestAnimationFrame(() => {
        if (shouldSyncContent) {
          setRenderedRoute(pathname);
        }

        if (shouldOpenSheet) {
          setOpen(true);
        }
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
    }

    if (renderedRoute) {
      const frameId = requestAnimationFrame(() => {
        setOpen(false);
      });

      closeTimerRef.current = setTimeout(() => {
        setRenderedRoute(null);
        closeTimerRef.current = null;
      }, SHEET_CLOSE_DURATION_MS);

      return () => {
        cancelAnimationFrame(frameId);
      };
    }
  }, [isSheetRoute, open, pathname, renderedRoute]);

  useLayoutEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(
      '[data-layout-scroll-container="true"]',
    );
    const mainContent = document.querySelector<HTMLElement>(
      '[data-layout-main-content="true"]',
    );

    if (!scrollContainer || !mainContent) {
      return;
    }

    const previousOverflow = scrollContainer.style.overflowY;
    const previousVisibility = mainContent.style.visibility;
    const previousPointerEvents = mainContent.style.pointerEvents;
    const shouldLockBackgroundScroll = Boolean(renderedRoute);

    if (shouldLockBackgroundScroll) {
      scrollContainer.style.overflowY = "hidden";
      mainContent.style.visibility = "hidden";
      mainContent.style.pointerEvents = "none";
    } else {
      scrollContainer.style.overflowY = previousOverflow;
      mainContent.style.visibility = previousVisibility;
      mainContent.style.pointerEvents = previousPointerEvents;
    }

    return () => {
      scrollContainer.style.overflowY = previousOverflow;
      mainContent.style.visibility = previousVisibility;
      mainContent.style.pointerEvents = previousPointerEvents;
    };
  }, [renderedRoute]);

  if (!renderedRoute) return null;

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
        disableOpenAnimation={disableInitialOpenAnimation}
        disablePortal={disableInitialOpenAnimation}
        className={`z-30 rounded-t-[24px] rounded-b-none border-0 ease-in-out sm:z-50 lg:rounded-[40px] ${disableInitialOpenAnimation ? "transition-none" : "transition-[top] duration-300"} ${sheetTopOffsetClass}`}
      >
        <div className="text-primary h-full overflow-y-auto overscroll-y-contain px-4 py-6">
          <Heading>{getRouteConfig(renderedRoute).title}</Heading>
          {children}
        </div>
      </LayoutSheetContent>
    </SheetPrimitive.Root>
  );
}
