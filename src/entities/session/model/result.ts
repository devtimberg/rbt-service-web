import { ApiError, toUserMessage, UNKNOWN_ERROR_MESSAGE } from '@/shared/api'

/** Неуспешный результат серверной функции. Ошибки API не бросаются, а возвращаются, чтобы форма просто показала `message`. */
export type ActionFailure = {
  ok: false
  message: string
  /** Секунды до следующей разрешённой отправки кода (при 429). */
  resendIn?: number
  /** Ошибки по конкретным полям. */
  fieldErrors?: Record<string, string>
  /** Защищённый эндпоинт ответил 401: сессия мертва (cookie уже очищена), клиент должен сбросить кэш и отправить на вход. */
  unauthorized?: true
}

export type ActionSuccess<T extends object = object> = { ok: true } & T

export type ActionResult<T extends object = object> = ActionSuccess<T> | ActionFailure

/** Превращает ошибку API в результат для формы. При 429 сохраняет время до следующей попытки. */
export function failureFrom(error: unknown): ActionFailure {
  const message = toUserMessage(error)
  if (error instanceof ApiError && error.isRateLimited && error.retryIn !== undefined) {
    return { ok: false, message, resendIn: error.retryIn }
  }
  return { ok: false, message }
}

/** Сообщение для формы по состоянию мутации: ошибка из результата либо сбой самого вызова (сеть до сервера приложения). */
export function resultMessage(result: { ok: true } | ActionFailure | undefined, error: unknown): string | undefined {
  if (result && !result.ok) return result.message
  return error ? UNKNOWN_ERROR_MESSAGE : undefined
}
