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
