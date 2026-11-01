'use client'

import { type ReactNode, useLayoutEffect, useRef } from 'react'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { Box, LayoutSheet, ScrollArea, SheetFooterSlotTarget, SheetDecorationSlotTarget } from '@/shared/ui'
import styles from './sheet-layout.module.css'

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
      className={styles.sheet}
    >
      <Box className={cn(styles.inner, pathname === ROUTES.MASTER_CALL && styles.masterCall)}>
        <SheetDecorationSlotTarget />
        <ScrollArea
          data-sheet-scroll="true"
          className={styles.scroll}
          viewportRef={viewportRef}
          viewportClassName={styles.viewport}
        >
          {children}
        </ScrollArea>
        <SheetFooterSlotTarget />
      </Box>
    </LayoutSheet>
  )
}
