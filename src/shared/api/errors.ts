import type { ApiErrorBody } from './types'

/** Ошибка, распознанная по телу ответа бэкенда. */
export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details: string[]
  /** Секунды до следующей разрешённой попытки — только для 429. */
  readonly retryIn: number | undefined

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.name = 'ApiError'
    this.status = status
    this.code = body.code
    this.details = body.details ?? []
    this.retryIn = body.nextResendIn
  }

  get isRateLimited() {
    return this.status === 429
  }

  /** 401: access-токен истёк, отозван или не передан. На `/auth/login` приходит `invalid_credentials` с тем же статусом,
   * но защищённые эндпоинты (password-change, logout-all) отвечают так только про сессию. */
  get isUnauthorized() {
    return this.status === 401
  }
}

/** Сеть недоступна / бэкенд не ответил. Отделяем от ApiError:
 * пользователю нужно другое сообщение, чем при бизнес-ошибке. */
export class ApiNetworkError extends Error {
  constructor(cause?: unknown) {
    super('Не удалось связаться с сервером')
    this.name = 'ApiNetworkError'
    this.cause = cause
  }
}

/** Коды для 401 в формате Bolt `{"detail": ...}` (без поля `code`), см. `readErrorBody` в client.ts. */
export const UNAUTHORIZED_CODE = 'unauthorized'
export const UNAUTHORIZED_REVOKED_CODE = 'token_revoked'

export const UNKNOWN_ERROR_MESSAGE = 'Что-то пошло не так, попробуйте ещё раз'

const MESSAGES: Record<string, string> = {
  invalid_credentials: 'Неверный email или пароль',
  email_already_registered: 'Этот email уже зарегистрирован',
  invalid_code: 'Неверный или устаревший код',
  invalid_ticket: 'Сессия регистрации недействительна, начните заново',
  ticket_expired: 'Время регистрации истекло, начните заново',
  invalid_password: 'Пароль не соответствует требованиям',
  invalid_refresh_token: 'Сессия недействительна, войдите заново',
  refresh_token_expired: 'Сессия истекла, войдите заново',
  refresh_token_revoked: 'Сессия отозвана, войдите заново',
  refresh_token_reused: 'Сессия завершена из соображений безопасности',
  [UNAUTHORIZED_CODE]: 'Сессия истекла, войдите заново',
  [UNAUTHORIZED_REVOKED_CODE]: 'Сессия отозвана, войдите заново',
  rate_limited: 'Слишком много попыток, попробуйте позже',
  session_not_found: 'Сессия не найдена',
  session_unknown: 'Обновите сессию и повторите',
}

/** Чистый маппинг машинного кода бэкенда в русское сообщение.
 * `invalid_password` с непустым `details` разворачивается в список требований от Django-валидаторов.
 * Неизвестный код: `fallback` (обычно `message` из тела ответа). */
export function messageForCode(code: string, details: readonly string[] = [], fallback?: string): string {
  if (code === 'invalid_password' && details.length > 0) {
    return details.join(' ')
  }
  return MESSAGES[code] ?? fallback ?? UNKNOWN_ERROR_MESSAGE
}

/** Русское сообщение для любой ошибки клиента API. */
export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return messageForCode(error.code, error.details, error.message)
  }
  if (error instanceof ApiNetworkError) {
    return error.message
  }
  return UNKNOWN_ERROR_MESSAGE
}
