import { getServerEnv } from '@/shared/config'
import { ApiError, ApiNetworkError } from './errors'
import type { ApiErrorBody } from './types'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

/** В браузере запрос идёт через Route Handler Next.js, на сервере — во внутренний API.
 * Любой не-2xx превращается в `ApiError`, сетевой сбой — в `ApiNetworkError`. */
export async function apiFetch<T>(
  path: string,
  { method = 'POST', body, headers: extraHeaders, signal }: RequestOptions = {},
): Promise<T> {
  const baseUrl = typeof window === 'undefined' ? getServerEnv().API_INTERNAL_URL.replace(/\/+$/, '') : '/api'
  const headers: Record<string, string> = { ...extraHeaders }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const controller = new AbortController()
  const abort = () => controller.abort()
  const timeout = setTimeout(abort, 10_000)
  signal?.addEventListener('abort', abort, { once: true })
  if (signal?.aborted) abort()

  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      cache: 'no-store',
      // Зависший API не должен держать SSR-запросы бесконечно; таймаут попадает в catch как сетевой сбой.
      signal: controller.signal,
    })
  } catch (cause) {
    throw new ApiNetworkError(cause)
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
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
    return {
      code: parsed.code,
      message: typeof parsed.message === 'string' ? parsed.message : 'Ошибка сервера',
      ...(Array.isArray(parsed.attrErrors) ? { attrErrors: parsed.attrErrors } : {}),
      ...(Array.isArray(parsed.details) ? { details: parsed.details } : {}),
      ...(typeof parsed.nextResendIn === 'number' ? { nextResendIn: parsed.nextResendIn } : {}),
    }
  }
  return { code: `http_${response.status}`, message: 'Ошибка сервера' }
}
