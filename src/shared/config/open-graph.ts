/**
 * Общая часть карточек Open Graph (по образцу прежнего rbt74.ru): соцсети и мессенджеры.
 * Next заменяет openGraph страницы на корневой целиком, а не мержит поля — поэтому страницы
 * раскладывают этот объект: `openGraph: { ...OPEN_GRAPH_BASE, url: ROUTES.X }`.
 */
export const OPEN_GRAPH_BASE = {
  type: 'website' as const,
  locale: 'ru_RU',
  siteName: 'Рембыттехника',
  // Отдельного баннера 1200x630 пока нет, используем существующую иконку
  images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'Рембыттехника' }],
}
