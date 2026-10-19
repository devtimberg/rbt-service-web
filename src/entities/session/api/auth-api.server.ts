import { apiFetch, type ApiResendInfo, type ApiSession, type ApiSignupTicket, type ClientMeta } from '@/shared/api'

// Тонкие обёртки над эндпоинтами /auth/* бэкенда rbt-service-api. Только для серверного кода.

export function login(email: string, password: string, clientMeta?: ClientMeta) {
  return apiFetch<ApiSession>('/auth/login', { body: { email, password }, clientMeta })
}

export function refreshSession(refreshToken: string, clientMeta?: ClientMeta) {
  return apiFetch<ApiSession>('/auth/refresh', { body: { refreshToken }, clientMeta })
}

export function logout(accessToken: string, refreshToken?: string) {
  return apiFetch<void>('/auth/logout', { body: { refreshToken: refreshToken ?? null }, accessToken })
}

export function logoutAll(accessToken: string) {
  return apiFetch<void>('/auth/logout-all', { body: {}, accessToken })
}

/** Шаг 1 регистрации: отправить OTP на email. 409 — email занят, 429 — rate limit. */
export function signupStart(email: string, clientMeta?: ClientMeta) {
  return apiFetch<ApiResendInfo>('/auth/signup/start', { body: { email }, clientMeta })
}

/** Шаг 2: обменять OTP на одноразовый ticket. */
export function signupVerify(email: string, code: string, clientMeta?: ClientMeta) {
  return apiFetch<ApiSignupTicket>('/auth/signup/verify', { body: { email, code }, clientMeta })
}

/** Шаг 3: создать пользователя по ticket — сразу возвращает сессию (повторный login создал бы лишнее «устройство»). */
export function signupComplete(
  params: { ticket: string; password: string; firstName: string; lastName: string },
  clientMeta?: ClientMeta,
) {
  return apiFetch<ApiSession>('/auth/signup/complete', { body: params, clientMeta })
}

export function signupResendOtp(email: string, clientMeta?: ClientMeta) {
  return apiFetch<ApiResendInfo>('/auth/signup/resend-otp', { body: { email }, clientMeta })
}

/** Всегда 200: бэкенд не раскрывает, существует ли email. */
export function passwordResetRequest(email: string, clientMeta?: ClientMeta) {
  return apiFetch<ApiResendInfo>('/auth/password-reset/request', { body: { email }, clientMeta })
}

export function passwordResetConfirm(
  params: { email: string; code: string; newPassword: string },
  clientMeta?: ClientMeta,
) {
  return apiFetch<void>('/auth/password-reset/confirm', { body: params, clientMeta })
}

/** Отзывает все сессии и выдаёт текущему устройству новую пару токенов. */
export function passwordChange(accessToken: string, oldPassword: string, newPassword: string, clientMeta?: ClientMeta) {
  return apiFetch<ApiSession>('/auth/password-change', { body: { oldPassword, newPassword }, accessToken, clientMeta })
}
