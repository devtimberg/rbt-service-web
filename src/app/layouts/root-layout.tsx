'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { type ReactNode, useEffect, useState } from 'react'
import { rehydrateCartStore } from '@/entities/cart'
import { rehydrateFavoritesStore } from '@/entities/favorite'
import { LockedSectionDialog, MvpNotice } from '@/features/locked-section'
import { HomePage } from '@/pages/home'
import { isSheetPath, LOCKED_SECTION_NOTICE_PARAM } from '@/shared/config'
import { NavigationGuardProvider, useNavigationGuard } from '@/shared/lib/navigation-guard'
import { usePathname } from '@/shared/lib/use-pathname'
import { Box, ScrollArea, ConfirmDialog } from '@/shared/ui'
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
 * а главная под открытой шторкой недоступна для взаимодействия и не прокручивается (ADR 0015).
 */
export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <NavigationGuardProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
    </NavigationGuardProvider>
  )
}

function RootLayoutContent({ children }: { children: ReactNode }) {
  const guard = useNavigationGuard()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lockedRouteNotice = searchParams?.get(LOCKED_SECTION_NOTICE_PARAM) === '1'
  function dismissLockedRouteNotice() {
    const url = new URL(window.location.href)
    url.searchParams.delete(LOCKED_SECTION_NOTICE_PARAM)
    router.replace(`${url.pathname}${url.search}${url.hash}`, { scroll: false })
  }
  const pathname = usePathname()
  const isSheet = isSheetPath(pathname)
  const { rendered, open, disableOpenAnimation, homeSearch } = useSheetState(isSheet)
  const lockBackground = rendered
  const [sheetPath, setSheetPath] = useState(pathname)
  if (isSheet && sheetPath !== pathname) setSheetPath(pathname)

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
        <Header search={<CatalogSearch />} homeNotice={<MvpNotice />} homeSearch={homeSearch} />
        <Box data-layout-main-content="true" className={styles.main} inert={isSheet} aria-hidden={isSheet || undefined}>
          {isSheet ? <HomePage /> : children}
        </Box>
      </ScrollArea>
      <MobileBottomNav />
      {rendered ? (
        <SheetLayout pathname={sheetPath} active={isSheet} open={open} disableOpenAnimation={disableOpenAnimation}>
          {isSheet ? children : null}
        </SheetLayout>
      ) : null}
      <LockedSectionDialog open={lockedRouteNotice && !isSheet} onClose={dismissLockedRouteNotice} />
      <ConfirmDialog
        stacked
        open={guard?.pending ?? false}
        onOpenChange={(next) => {
          if (!next) guard?.cancel()
        }}
        title="Закрыть без сохранения?"
        description="Введённые данные будут удалены. Вы можете продолжить заполнение заявки."
        confirmLabel="Закрыть без сохранения"
        cancelLabel="Продолжить заполнение"
        onConfirm={() => guard?.confirm()}
      />
      <Box id="portal-root" data-portal-root="true" />
    </>
  )
}
