import {
  deleteCookie,
  getCookie,
  getRequest,
  getRequestHeader,
  getRequestIP,
  setCookie,
} from '@tanstack/react-start/server'
import { ApiError, type ClientMeta } from '@/shared/api'
import { getServerEnv } from '@/shared/config'
import { isAccessTokenFresh } from '../model/refresh'
import { type RefreshedSession, sessionFromRefresh } from '../model/session-data'
import type { SessionData } from '../model/types'
import { refreshSession } from './auth-api.server'
import { sealSession, unsealSession } from './cookie-seal.server'

// Серверная cookie-сессия. В `@tanstack/react-start/server` этой версии нет `useSession`,
// поэтому cookie шифруем сами (AES-256-GCM, ключ из SESSION_SECRET), см. cookie-seal.server.ts.
// Импортировать только из тел handler'ов (`*.functions.ts`): модуль работает с process.env и cookie запроса.

export const SESSION_COOKIE = 'rbt_session'
/** Срок жизни сессии = AUTH_REFRESH_TOKEN_TTL бэкенда (30 дней). */
const SESSION_MAX_AGE_SEC = 30 * 24 * 60 * 60

// Чтение cookie после setCookie в том же запросе вернуло бы старое значение (читаются заголовки запроса),
// поэтому актуальное состояние держим на запрос в WeakMap.
const requestSessions = new WeakMap<Request, SessionData | null>()

export function readSession(): SessionData | null {
  const request = getRequest()
  if (requestSessions.has(request)) return requestSessions.get(request) ?? null
  const data = unsealSession(getCookie(SESSION_COOKIE), getServerEnv().SESSION_SECRET)
  requestSessions.set(request, data)
  return data
}

export function writeSession(data: SessionData): void {
  const value = sealSession(data, getServerEnv().SESSION_SECRET, SESSION_MAX_AGE_SEC * 1000)
  setCookie(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SEC,
  })
  requestSessions.set(getRequest(), data)
}

export function clearSession(): void {
  deleteCookie(SESSION_COOKIE, { path: '/' })
  requestSessions.set(getRequest(), null)
}

/** UA и IP браузера из входящего запроса: бэкенд пишет их в сессию, иначе в списке устройств окажется сервер приложения.
 * X-Forwarded-For и X-Real-IP клиента подделываются, поэтому учитываем их только при `TRUST_PROXY=true`
 * (приложение стоит за собственным прокси, который перезаписывает эти заголовки). Иначе IP берём из сокета. */
export function getClientMeta(): ClientMeta {
  try {
    const trustProxy = getServerEnv().TRUST_PROXY
    return {
      userAgent: getRequestHeader('user-agent'),
      ip: trustProxy
        ? getRequestIP({ xForwardedFor: true }) || getRequestHeader('x-real-ip')
        : getRequestIP({ xForwardedFor: false }),
    }
  } catch {
    // Вне контекста запроса заголовков нет.
    return {}
  }
}

// Один refresh на refreshToken одновременно: параллельные запросы одного посетителя (SSR + RPC) ждут общий результат.
// Ротация refresh на бэкенде одноразовая, второй параллельный вызов с тем же токеном отозвал бы всю семью.
// Результат — null, если refresh не удался окончательно (токен отозван/истёк); временный сбой (сеть, 5xx) — исключение.
const inflightRefresh = new Map<string, Promise<RefreshedSession | null>>()

function refreshOnce(current: SessionData, clientMeta: ClientMeta): Promise<RefreshedSession | null> {
  let promise = inflightRefresh.get(current.refreshToken)
  if (!promise) {
    promise = refreshSession(current.refreshToken, clientMeta)
      .then((session) => sessionFromRefresh(session, current))
      .catch((error: unknown) => {
        // Бэкенд отвечает на невалидный refresh только 401. Прочее (429 от прокси, 5xx, сеть) — временно, пробрасываем.
        if (error instanceof ApiError && error.status === 401) return null
        throw error
      })
      .finally(() => {
        inflightRefresh.delete(current.refreshToken)
      })
    inflightRefresh.set(current.refreshToken, promise)
  }
  return promise
}

/** Сессия с годным access-токеном. null — гость (нет сессии либо refresh отклонён: cookie при этом очищается).
 * При временном сбое refresh (сеть, 5xx) cookie сохраняется, запрос обрабатывается как гостевой. */
export async function getValidSession(): Promise<SessionData | null> {
  const current = readSession()
  if (!current) return null
  if (isAccessTokenFresh(current.accessTokenExpiresAt, Date.now())) return current

  let refreshed: RefreshedSession | null
  try {
    refreshed = await refreshOnce(current, getClientMeta())
  } catch {
    return null
  }
  if (!refreshed) {
    clearSession()
    return null
  }
  if (refreshed.rotated) {
    writeSession(refreshed.data)
  } else {
    // Grace-ответ бэкенда (гонка refresh): новый refreshToken получил параллельный запрос и записал его в cookie.
    // Наш access пригоден только для этого запроса, cookie не трогаем, иначе вернём в неё уже ротированный refresh.
    requestSessions.set(getRequest(), refreshed.data)
  }
  return refreshed.data
}
