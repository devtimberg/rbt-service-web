import type { ApiErrorBody } from "./types";

/** Ошибка, распознанная по телу ответа бэкенда. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: string[];
  /** Секунды до следующей разрешённой попытки — только для 429. */
  readonly retryIn?: number;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.details = body.details ?? [];
    this.retryIn = body.nextResendIn;
  }

  get isRateLimited() {
    return this.status === 429;
  }
}

/** Сеть недоступна / бэкенд не ответил. Отделяем от ApiError:
 * пользователю нужно другое сообщение, чем при бизнес-ошибке. */
export class ApiNetworkError extends Error {
  constructor(cause?: unknown) {
    super("Не удалось связаться с сервером");
    this.name = "ApiNetworkError";
    this.cause = cause;
  }
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Неверный email или пароль",
  email_already_registered: "Этот email уже зарегистрирован",
  invalid_code: "Неверный или устаревший код",
  invalid_ticket: "Сессия регистрации недействительна, начните заново",
  ticket_expired: "Время регистрации истекло, начните заново",
  invalid_password: "Пароль не соответствует требованиям",
  invalid_refresh_token: "Сессия недействительна, войдите заново",
  refresh_token_expired: "Сессия истекла, войдите заново",
  refresh_token_revoked: "Сессия отозвана, войдите заново",
  refresh_token_reused: "Сессия завершена из соображений безопасности",
  rate_limited: "Слишком много попыток, попробуйте позже",
  session_not_found: "Сессия не найдена",
  session_unknown: "Обновите сессию и повторите",
};

/** Русское сообщение для любой ошибки клиента API.
 * `invalid_password` разворачиваем в список требований от Django-валидаторов. */
export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === "invalid_password" && error.details.length > 0) {
      return error.details.join(" ");
    }
    return MESSAGES[error.code] ?? error.message;
  }
  if (error instanceof ApiNetworkError) {
    return error.message;
  }
  return "Что-то пошло не так, попробуйте ещё раз";
}
