"use client";

import type { ReactNode } from "react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dialog as SheetPrimitive } from "radix-ui";
import { ROUTES } from "@/shared/lib/routes";
import { LayoutSheetContent } from "@/shared/ui/kit/layout-sheet";
import { SheetFooterSlotTarget } from "@/shared/ui/kit/sheet-footer-slot";
import { ScrollArea } from "@/shared/ui/kit/scroll-area";

const SHEET_CLOSE_DURATION_MS = 300;
// mobile: 80px header, desktop: 88px header (+16px outer padding on lg)
const SHEET_TOP_OFFSET_NORMAL_CLASS =
  "top-20 sm:top-22 lg:top-[calc(16px+88px)]";
const SHEET_TOP_OFFSET_COMPACT_CLASS =
  "top-20 sm:top-22 lg:top-[calc(16px+88px)]";

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
  const sheetScrollRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedWithSheetRoute = useRef(isSheetRoute);

  // Синхронизация renderedRoute во время рендера (вместо setState в эффекте)
  if (isSheetRoute && renderedRoute !== pathname) {
    setRenderedRoute(pathname);
  }

  // Сбрасываем скролл при смене маршрута (синхронно до paint)
  useLayoutEffect(() => {
    if (sheetScrollRef.current) {
      sheetScrollRef.current.scrollTop = 0;
    }
  }, [pathname]);


  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (backTimerRef.current) clearTimeout(backTimerRef.current);
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!disableInitialOpenAnimation || mountedWithSheetRoute.current) {
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

      // Не мешаем закрытию, инициированному пользователем
      if (backTimerRef.current) {
        return;
      }

      if (!open) {
        // Открываем в следующей макрозадаче, чтобы шит успел отрисоваться закрытым —
        // иначе анимация не срабатывает после перезагрузки
        openTimerRef.current = setTimeout(() => {
          openTimerRef.current = null;
          setOpen(true);
        }, 0);

        return () => {
          if (openTimerRef.current) {
            clearTimeout(openTimerRef.current);
            openTimerRef.current = null;
          }
        };
      }

      return;
    }

    if (renderedRoute) {
      const frameId = requestAnimationFrame(() => {
        setOpen(false);
      });

      closeTimerRef.current = setTimeout(() => {
        setRenderedRoute(null);
        setDisableInitialOpenAnimation(false);
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
    const shouldLockBackgroundScroll = Boolean(renderedRoute && open);

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
  }, [renderedRoute, open]);

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
        className={`z-30 rounded-t-[24px] rounded-b-none border-0 ease-in-out
          sm:z-50 lg:rounded-[40px] ${
            disableInitialOpenAnimation
              ? "transition-none"
              : "transition-[top] duration-300"
          } ${sheetTopOffsetClass}`}
      >
        <div className="text-primary flex h-full flex-col overflow-hidden rounded-t-[24px] lg:rounded-[40px]">
          <ScrollArea
            className="flex-1"
            viewportRef={sheetScrollRef}
            viewportClassName="overscroll-y-contain px-3 pt-6
              pb-[calc(env(safe-area-inset-bottom)+76px+32px)] sm:pb-8"
          >
            {children}
          </ScrollArea>
          <SheetFooterSlotTarget />
        </div>
      </LayoutSheetContent>
    </SheetPrimitive.Root>
  );
}
