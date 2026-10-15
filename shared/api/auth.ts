import { apiFetch, type ClientMeta } from "./client";
import type {
  ApiResendInfo,
  ApiSession,
  ApiSessionListItem,
  ApiSignupTicket,
  ApiUser,
} from "./types";

// --- Вход ---

export function login(
  email: string,
  password: string,
  clientMeta?: ClientMeta,
) {
  return apiFetch<ApiSession>("/auth/login", {
    body: { email, password },
    clientMeta,
  });
}

export function refreshSession(refreshToken: string, clientMeta?: ClientMeta) {
  return apiFetch<ApiSession>("/auth/refresh", {
    body: { refreshToken },
    clientMeta,
  });
}

export function logout(accessToken: string, refreshToken?: string) {
  return apiFetch<void>("/auth/logout", {
    body: { refreshToken: refreshToken ?? null },
    accessToken,
  });
}

export function logoutAll(accessToken: string) {
  return apiFetch<void>("/auth/logout-all", { body: {}, accessToken });
}

// --- Регистрация ---

/** Шаг 1: отправить OTP на email. 409 — email занят, 429 — rate limit. */
export function signupStart(email: string) {
  return apiFetch<ApiResendInfo>("/auth/signup/start", { body: { email } });
}

/** Шаг 2: обменять OTP на одноразовый ticket. */
export function signupVerify(email: string, code: string) {
  return apiFetch<ApiSignupTicket>("/auth/signup/verify", {
    body: { email, code },
  });
}

/** Шаг 3: создать пользователя по ticket — сразу возвращает сессию. */
export function signupComplete(
  params: {
    ticket: string;
    password: string;
    firstName: string;
    lastName: string;
  },
  clientMeta?: ClientMeta,
) {
  return apiFetch<ApiSession>("/auth/signup/complete", {
    body: params,
    clientMeta,
  });
}

export function signupResendOtp(email: string) {
  return apiFetch<ApiResendInfo>("/auth/signup/resend-otp", { body: { email } });
}

// --- Пароль ---

/** Всегда 200 — бэкенд не раскрывает, существует ли email. */
export function passwordResetRequest(email: string) {
  return apiFetch<ApiResendInfo>("/auth/password-reset/request", {
    body: { email },
  });
}

export function passwordResetConfirm(params: {
  email: string;
  code: string;
  newPassword: string;
}) {
  return apiFetch<void>("/auth/password-reset/confirm", { body: params });
}

/** Отзывает все сессии и выдаёт текущему устройству новую пару токенов. */
export function passwordChange(
  accessToken: string,
  oldPassword: string,
  newPassword: string,
) {
  return apiFetch<ApiSession>("/auth/password-change", {
    body: { oldPassword, newPassword },
    accessToken,
  });
}

// --- Профиль и сессии ---

export function me(accessToken: string) {
  return apiFetch<ApiUser>("/auth/me", { method: "GET", accessToken });
}

export function listSessions(accessToken: string) {
  return apiFetch<{ sessions: ApiSessionListItem[] }>("/auth/sessions", {
    method: "GET",
    accessToken,
  });
}

export function revokeSession(accessToken: string, familyId: string) {
  return apiFetch<void>(`/auth/sessions/${familyId}`, {
    method: "DELETE",
    accessToken,
  });
}

export function renameSession(
  accessToken: string,
  familyId: string,
  deviceName: string,
) {
  return apiFetch<ApiSessionListItem>(`/auth/sessions/${familyId}`, {
    method: "PATCH",
    body: { deviceName },
    accessToken,
  });
}

export function logoutOtherSessions(accessToken: string) {
  return apiFetch<void>("/auth/sessions/logout-all-others", {
    body: {},
    accessToken,
  });
}
