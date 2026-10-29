import { ROUTES } from '@/shared/config'

/** Заголовки страниц для мобильной шапки (раньше брались из ROUTE_CONFIG). */
const ROUTE_TITLES: Record<string, string> = {
  [ROUTES.HOME]: 'Рембыттехника',
  [ROUTES.CATALOG]: 'Каталог',
  [ROUTES.FAVORITE]: 'Избранное',
  [ROUTES.COMPARE]: 'Сравнение',
  [ROUTES.CART]: 'Корзина',
  [ROUTES.ORDERS_STATUS]: 'Статус заказа',
  [ROUTES.PARTS_REQUEST]: 'Заказ запчастей',
  [ROUTES.SERVICES_REPAIR]: 'Услуги ремонта',
  [ROUTES.MASTER_CALL]: 'Вызвать мастера',
  [ROUTES.FEEDBACK]: 'Обратная связь',
  [ROUTES.SEARCH]: 'Поиск',
}

/** Заголовок по pathname; для неизвестных путей — последний сегмент или «Страница». */
export function getRouteTitle(pathname: string): string {
  const known = ROUTE_TITLES[pathname]
  if (known) return known

  const lastSegment = pathname.split('/').filter(Boolean).at(-1)
  if (!lastSegment) return 'Страница'
  try {
    return decodeURIComponent(lastSegment)
  } catch {
    return lastSegment
  }
}
