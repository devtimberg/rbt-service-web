import { ROUTES } from './routes'

/**
 * Разделы, которые в MVP ещё не открыты: вместо перехода показываем окно «Этот раздел ещё в работе».
 */
export const LOCKED_SECTIONS: string[] = [
  ROUTES.CATALOG,
  ROUTES.SEARCH,
  ROUTES.ORDERS_STATUS,
  ROUTES.SERVICES_REPAIR,
  ROUTES.FEEDBACK,
  ROUTES.FAVORITE,
  ROUTES.COMPARE,
  ROUTES.CART,
]

/** Закрыт ли раздел по адресу ссылки: сам адрес или любой его подраздел (`/catalog/...`). */
export function isLockedSection(href: string): boolean {
  return LOCKED_SECTIONS.some((section) => href === section || href.startsWith(`${section}/`))
}

/** Признак окна-заглушки после серверного перенаправления с закрытого адреса. */
export const LOCKED_SECTION_NOTICE_PARAM = 'section-locked'
