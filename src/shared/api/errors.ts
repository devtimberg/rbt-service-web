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

export const UNKNOWN_ERROR_MESSAGE = 'Что-то пошло не так, попробуйте ещё раз'

const MESSAGES: Record<string, string> = {
  rate_limited: 'Слишком много попыток, попробуйте позже',
}

/** Чистый маппинг машинного кода бэкенда в русское сообщение.
 * Неизвестный код: `fallback` (обычно `message` из тела ответа). */
export function messageForCode(code: string, fallback?: string): string {
  return MESSAGES[code] ?? fallback ?? UNKNOWN_ERROR_MESSAGE
}

/** Русское сообщение для любой ошибки клиента API. */
export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return messageForCode(error.code, error.message)
  }
  if (error instanceof ApiNetworkError) {
    return error.message
  }
  return UNKNOWN_ERROR_MESSAGE
}
