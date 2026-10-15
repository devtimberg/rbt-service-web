/** Контракты бэкенда rbt-service-api (`apps/authentications/schemas.py`).
 * На проводе — camelCase (`rename="camel"` в msgspec-схемах). */

export type ApiUser = {
  id: string
  email: string
  emailVerified: boolean
  firstName: string
  lastName: string
}

/** RFC 6749 §5.1. `refreshToken` приходит только в bearer-режиме
 * (заголовок `X-Client-Type: native`), в cookie-режиме его в теле нет. */
export type ApiSession = {
  accessToken: string
  tokenType: string
  /** Секунды до истечения access-токена. */
  expiresIn: number
  user: ApiUser
  refreshToken?: string | null
}

export type ApiResendInfo = {
  /** Unix-время (сек), когда можно повторить отправку кода. */
  nextResendAt: number
  nextResendIn: number
}

export type ApiSignupTicket = {
  ticket: string
}

export type ApiSessionListItem = {
  familyId: string
  created: number
  expiresAt: number
  lastUsedAt: number | null
  createdIp: string | null
  userAgent: string
  deviceBrowser: string
  deviceOs: string
  deviceType: string
  deviceName: string
  current: boolean
}

export type ApiErrorBody = {
  code: string
  message: string
  details?: string[] | null
  /** Присутствует только у 429 (`RateLimitedResponse`). */
  nextResendAt?: number
  nextResendIn?: number
}
