import { getServerEnv } from '@/shared/config'
import { ApiError, ApiNetworkError, UNAUTHORIZED_CODE, UNAUTHORIZED_REVOKED_CODE } from './errors'
import type { ApiErrorBody } from './types'

/** Bearer-режим: refresh приходит в теле ответа, а не HttpOnly-кукой.
 * Куку Django ставит на свой домен с `path=/auth` — через серверный fetch она до браузера не доедет,
 * поэтому токены храним в зашифрованной cookie-сессии приложения. */
const CLIENT_TYPE_HEADER = { 'X-Client-Type': 'native' } as const

/** UA и IP браузера, который инициировал запрос. Запросы к API уходят с сервера приложения,
 * поэтому эти заголовки пробрасываем вручную — иначе в списке устройств пользователь увидит «node». */
export type ClientMeta = {
  userAgent?: string | null | undefined
  ip?: string | null | undefined
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Access-токен для защищённых эндпоинтов. */
  accessToken?: string | undefined
  /** Данные устройства конечного пользователя. Без них бэкенд запишет в сессию UA сервера приложения. */
  clientMeta?: ClientMeta | undefined
}

/** Единственная точка выхода во внешний API. Вызывать только из серверного кода.
 * Любой не-2xx превращается в `ApiError`, сетевой сбой — в `ApiNetworkError`. */
export async function apiFetch<T>(
  path: string,
  { method = 'POST', body, accessToken, clientMeta }: RequestOptions = {},
): Promise<T> {
  const baseUrl = getServerEnv().API_INTERNAL_URL.replace(/\/+$/, '')
  const headers: Record<string, string> = { ...CLIENT_TYPE_HEADER }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }
  if (clientMeta?.userAgent) {
    headers['User-Agent'] = clientMeta.userAgent
  }
  if (clientMeta?.ip) {
    headers['X-Real-IP'] = clientMeta.ip
  }

  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      cache: 'no-store',
      // Зависший API не должен держать SSR-запросы бесконечно; таймаут попадает в catch как сетевой сбой.
      signal: AbortSignal.timeout(10_000),
    })
  } catch (cause) {
    throw new ApiNetworkError(cause)
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorBody(response))
  }

  // 204 и пустое тело — у logout, password-reset/confirm, revoke-эндпоинтов.
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

async function readErrorBody(response: Response): Promise<ApiErrorBody> {
  type Body = (Partial<ApiErrorBody> & { detail?: unknown }) | null
  let parsed: Body = null
  try {
    parsed = (await response.json()) as Body
  } catch {
    // Не-JSON ответ (502 от прокси, HTML-страница ошибки) — падаем в fallback.
  }
  if (parsed && typeof parsed.code === 'string') {
    return parsed as ApiErrorBody
  }
  if (response.status === 401) {
    // Защищённые эндпоинты отвечают 401 в формате Bolt `{"detail": "token_revoked" | "Authentication required"}` без code.
    const revoked = parsed?.detail === 'token_revoked'
    return {
      code: revoked ? UNAUTHORIZED_REVOKED_CODE : UNAUTHORIZED_CODE,
      message: revoked ? 'Токен отозван' : 'Требуется авторизация',
    }
  }
  return { code: `http_${response.status}`, message: 'Ошибка сервера' }
}
