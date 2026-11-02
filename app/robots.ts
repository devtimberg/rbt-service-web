import type { MetadataRoute } from 'next'
import { getServerEnv, LOCKED_SECTIONS } from '@/shared/config'

// Строим в рантайме: SITE_URL подставляется при старте сервера, а не при сборке
export const dynamic = 'force-dynamic'

/** Не для поисковиков помимо закрытых разделов: витрина UI-кита (в проде она и так 404). */
const EXTRA_DISALLOW = ['/_dev']

// User-agent * и Disallow по образцу прежнего rbt74.ru: закрытые разделы серверно редиректит,
// обходить их незачем; noindex-страницы (privacy-policy) в Disallow не кладём — робот должен
// увидеть мета-тег. Когда раздел откроют (уберут из LOCKED_SECTIONS), он уйдёт из Disallow сам.
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getServerEnv().SITE_URL
  return {
    rules: [{ userAgent: '*', disallow: [...LOCKED_SECTIONS, ...EXTRA_DISALLOW] }],
    sitemap: new URL('/sitemap.xml', siteUrl).href,
    host: siteUrl,
  }
}
