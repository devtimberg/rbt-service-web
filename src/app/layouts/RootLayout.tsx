import { Outlet, useMatches, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { rehydrateCartStore } from '@/entities/cart'
import { rehydrateFavoritesStore } from '@/entities/favorite'
import { Box } from '@/shared/ui/Box'
import { ScrollArea } from '@/shared/ui/ScrollArea'
import { CatalogSearch } from '@/widgets/catalog-search'
import { Header } from '@/widgets/header'
import { MobileBottomNav } from '@/widgets/mobile-bottom-nav'
import { SheetLayout } from './SheetLayout'
import { useSheetState } from './useSheetState'

/**
 * Корневая раскладка: шапка, основной контент, нижняя навигация и шторка.
 * Главная и 404 рисуются в основном контенте; страницы с `staticData.sheet` (всё остальное) — в шторке,
 * а основной контент под открытой шторкой прячется и не прокручивается.
 */
export function RootLayout() {
  const isSheet = useMatches({ select: (matches) => matches.some((match) => match.staticData?.sheet === true) })
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const { rendered, open, disableOpenAnimation } = useSheetState(isSheet)
  const lockBackground = rendered && open

  // Persist-сторы создаются с skipHydration: читаем localStorage только на клиенте, чтобы SSR и гидрация совпали
  useEffect(() => {
    rehydrateCartStore()
    rehydrateFavoritesStore()
  }, [])

  return (
    <>
      <ScrollArea
        data-layout-scroll-container="true"
        className="bg-primary-500 relative min-h-0 flex-1 rounded-none lg:rounded-[40px]"
        viewportClassName="flex flex-col"
        style={lockBackground ? { overflowY: 'hidden' } : undefined}
      >
        <Header search={<CatalogSearch />} />
        <Box
          data-layout-main-content="true"
          className="flex min-h-0 flex-1 flex-col"
          style={lockBackground ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}
        >
          {isSheet ? null : <Outlet />}
        </Box>
      </ScrollArea>
      <MobileBottomNav />
      {rendered ? (
        <SheetLayout pathname={pathname} open={open} disableOpenAnimation={disableOpenAnimation}>
          {isSheet ? <Outlet /> : null}
        </SheetLayout>
      ) : null}
      <Box id="portal-root" data-portal-root="true" />
    </>
  )
}
