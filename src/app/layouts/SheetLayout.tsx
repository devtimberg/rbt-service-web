import { type ReactNode, useLayoutEffect, useRef } from 'react'
import { LayoutSheet } from '@/shared/ui/LayoutSheet'
import { ScrollArea } from '@/shared/ui/ScrollArea'
import { SheetFooterSlotTarget } from '@/shared/ui/SheetFooterSlot'

type SheetLayoutProps = {
  /** Путь текущей страницы: при его смене прокрутка шторки сбрасывается. */
  pathname: string
  open: boolean
  disableOpenAnimation: boolean
  children: ReactNode
}

/**
 * Шторка поверх основной раскладки: в ней показываются все страницы, кроме главной.
 * Положение: ниже шапки (mobile 80px, sm 88px, lg 88px + внешний отступ 16px).
 */
export function SheetLayout({ pathname, open, disableOpenAnimation, children }: SheetLayoutProps) {
  const viewportRef = useRef<HTMLDivElement>(null)

  // Сбрасываем прокрутку при смене маршрута (синхронно до paint)
  useLayoutEffect(() => {
    if (pathname && viewportRef.current) viewportRef.current.scrollTop = 0
  }, [pathname])

  return (
    <LayoutSheet
      open={open}
      side="bottom"
      disableOpenAnimation={disableOpenAnimation}
      // Закрытая шторка не получает фокус и не читается скринридером
      inert={!open}
      className="top-20 z-30 rounded-t-[24px] rounded-b-none border-0 sm:top-22 sm:z-50 lg:top-[calc(16px+88px)] lg:rounded-[40px]"
    >
      <div className="text-primary flex h-full flex-col overflow-hidden rounded-t-[24px] lg:rounded-[40px]">
        <ScrollArea
          data-sheet-scroll="true"
          className="flex-1"
          viewportRef={viewportRef}
          viewportClassName="flex flex-col overscroll-y-contain px-3 pt-6 pb-[calc(env(safe-area-inset-bottom)+100px)] sm:pb-8"
        >
          {children}
        </ScrollArea>
        <SheetFooterSlotTarget />
      </div>
    </LayoutSheet>
  )
}
