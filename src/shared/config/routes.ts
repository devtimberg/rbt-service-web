/** Таблица путей приложения. Значения — литералы, поэтому подходят и для `Link to`, и для SmartLink href. */
export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  FAVORITE: '/favorite',
  COMPARE: '/compare',
  CART: '/cart',
  ORDERS_STATUS: '/orders-status',
  PARTS_REQUEST: '/parts/request',
  SERVICES_REPAIR: '/services-repair',
  MASTER_CALL: '/master-call',
  FEEDBACK: '/feedback',
  SEARCH: '/search',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

/** Пути, при которых в нижней панели активна вкладка «Главная». */
export const HOME_NAV_PATHS: string[] = [ROUTES.HOME, ROUTES.MASTER_CALL, ROUTES.SERVICES_REPAIR, ROUTES.FEEDBACK]

/**
 * Страница открывается шторкой поверх главной (ADR 0013): всё, кроме главной, 404 и витрины `/_dev/ui`.
 * Каталог со всеми подразделами (`/catalog/<любой путь>`), остальные адреса точно.
 */
export function isSheetPath(pathname: string): boolean {
  return (
    pathname === ROUTES.CATALOG ||
    pathname.startsWith(`${ROUTES.CATALOG}/`) ||
    [ROUTES.CART, ROUTES.COMPARE, ROUTES.FAVORITE, ROUTES.MASTER_CALL, ROUTES.SEARCH].some(
      (route) => route === pathname,
    )
  )
}
