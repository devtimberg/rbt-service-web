import { REDIRECT_PARAM, ROUTES } from '@/shared/config'

/** Пускаем в редирект только внутренние пути — иначе `?redirect=` станет open redirect на чужой домен.
 * Обратные слеши браузеры трактуют как прямые (`/\evil.com`), а табы/переводы строк браузер вырезает (`/\t/evil.com` → `//evil.com`), поэтому отбрасываем и их. */
export function safeRedirectPath(value: string | null | undefined, fallback: string = ROUTES.PROFILE): string {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\') || /\p{Cc}/u.test(value)) return fallback
  return value
}

/** search-параметры /login с адресом возврата: общий для guard защищённых роутов и обработки истёкшей сессии. */
export function loginRedirectSearch(href: string) {
  return { [REDIRECT_PARAM]: href }
}
