import type { MetadataRoute } from 'next'
import { getServerEnv, LOCKED_SECTIONS, ROUTES } from '@/shared/config'

// Строим в рантайме: SITE_URL подставляется при старте сервера, а не при сборке
export const dynamic = 'force-dynamic'

/** Страницы с noindex в metadata: не кладём в sitemap даже после открытия разделов. */
const NOINDEX_ROUTES: string[] = [ROUTES.PRIVACY_POLICY]

/**
 * Публичные индексируемые маршруты: из всех ROUTES вычитаем закрытые разделы (сейчас это и
 * каталог, и служебные страницы) и noindex. Когда раздел откроют, он появится в sitemap сам.
 */
const INDEXED_ROUTES = Object.values(ROUTES).filter(
  (route) => !LOCKED_SECTIONS.includes(route) && !NOINDEX_ROUTES.includes(route),
)

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getServerEnv().SITE_URL
  const lastModified = new Date()
  return INDEXED_ROUTES.map((route) => ({
    url: new URL(route, siteUrl).href,
    lastModified,
    // Главная — чуть важнее остальных по стандартной шкале sitemap (0..1)
    priority: route === ROUTES.HOME ? 1 : 0.8,
  }))
}
