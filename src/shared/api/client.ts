import { getServerEnv } from '@/shared/config'
import { ApiError, ApiNetworkError } from './errors'
import type { ApiErrorBody } from './types'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

/** Единственная точка выхода во внешний API. Вызывать только из серверного кода.
 * Любой не-2xx превращается в `ApiError`, сетевой сбой — в `ApiNetworkError`. */
export async function apiFetch<T>(path: string, { method = 'POST', body }: RequestOptions = {}): Promise<T> {
  const baseUrl = getServerEnv().API_INTERNAL_URL.replace(/\/+$/, '')
  const headers: Record<string, string> = {}
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
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

  // 204 — пустое тело.
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
  return { code: `http_${response.status}`, message: 'Ошибка сервера' }
}
