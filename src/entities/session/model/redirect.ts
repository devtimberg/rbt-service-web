import { ROUTES } from '@/shared/config'

/** Пускаем в редирект только внутренние пути — иначе `?redirect=` станет open redirect на чужой домен.
 * Обратные слеши браузеры трактуют как прямые (`/\evil.com`), поэтому тоже отбрасываем. */
export function safeRedirectPath(value: string | null | undefined, fallback: string = ROUTES.PROFILE): string {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback
  return value
}
