'use client'

import { type ReactNode, useEffect } from 'react'
import { rehydrateCartStore } from '@/entities/cart'
import { rehydrateFavoritesStore } from '@/entities/favorite'
import { MvpNotice } from '@/features/locked-section'
import { isSheetPath } from '@/shared/config'
import { usePathname } from '@/shared/lib/use-pathname'
import { Box, ScrollArea } from '@/shared/ui'
import { CatalogSearch } from '@/widgets/catalog-search'
import { Header } from '@/widgets/header'
import { MobileBottomNav } from '@/widgets/mobile-bottom-nav'
import { SheetLayout } from './sheet-layout'
import { useSheetState } from './use-sheet-state'
import { useStorageSync } from './use-storage-sync'
import styles from './root-layout.module.css'

/**
 * Корневая раскладка: шапка, основной контент, нижняя навигация и шторка.
 * Главная и 404 рисуются в основном контенте; страницы-шторки (`isSheetPath`, ADR 0013) — в шторке,
 * а основной контент под открытой шторкой прячется и не прокручивается.
 */
export function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isSheet = isSheetPath(pathname)
  const { rendered, open, disableOpenAnimation } = useSheetState(isSheet)
  const lockBackground = rendered && open

  // Persist-сторы создаются с skipHydration: читаем localStorage только на клиенте, чтобы SSR и гидрация совпали
  useEffect(() => {
    rehydrateCartStore()
    rehydrateFavoritesStore()
  }, [])
  useStorageSync()

  return (
    <>
      <ScrollArea
        data-layout-scroll-container="true"
        className={styles.scroll}
        viewportClassName={styles.viewport}
        style={lockBackground ? { overflowY: 'hidden' } : undefined}
      >
        <Header search={<CatalogSearch />} homeNotice={<MvpNotice />} />
        <Box
          data-layout-main-content="true"
          className={styles.main}
          style={lockBackground ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}
        >
          {isSheet ? null : children}
        </Box>
      </ScrollArea>
      <MobileBottomNav />
      {rendered ? (
        <SheetLayout pathname={pathname} open={open} disableOpenAnimation={disableOpenAnimation}>
          {isSheet ? children : null}
        </SheetLayout>
      ) : null}
      <Box id="portal-root" data-portal-root="true" />
    </>
  )
}
