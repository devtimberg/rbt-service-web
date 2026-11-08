'use client'

import { type ReactNode, useLayoutEffect, useRef } from 'react'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { Box, LayoutSheet, ScrollArea, SheetFooterSlotTarget, SheetDecorationSlotTarget } from '@/shared/ui'
import { SheetExitContent } from './sheet-exit-content'
import styles from './sheet-layout.module.css'

type SheetLayoutProps = {
  /** Путь текущей страницы: при его смене прокрутка шторки сбрасывается. */
  pathname: string
  active: boolean
  open: boolean
  disableOpenAnimation: boolean
  children: ReactNode
}

/**
 * Шторка поверх основной раскладки: в ней показываются все страницы, кроме главной.
 * Положение: ниже шапки (mobile 80px, sm 106px, lg 106px + внешний отступ 16px).
 */
export function SheetLayout({ pathname, active, open, disableOpenAnimation, children }: SheetLayoutProps) {
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
      inert={!active || !open}
      className={styles.sheet}
    >
      <SheetExitContent active={active}>
        <Box
          className={cn(
            styles.inner,
            pathname === ROUTES.PRIVACY_POLICY && styles.privacyPolicy,
            (pathname === ROUTES.MASTER_CALL || pathname === ROUTES.PARTS_REQUEST) && styles.masterCall,
          )}
        >
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
      </SheetExitContent>
    </LayoutSheet>
  )
}
