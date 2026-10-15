import { ApiError, ApiNetworkError } from "./errors";
import type { ApiErrorBody } from "./types";

export const API_BASE_URL = (
  process.env.API_URL ?? "http://localhost:8001"
).replace(/\/$/, "");

/** Bearer-режим: refresh приходит в теле ответа, а не HttpOnly-кукой.
 * Куку Django ставит на свой домен с `path=/auth` — через серверный fetch
 * Next.js она до браузера не доедет, поэтому токены храним в JWT-сессии. */
const CLIENT_TYPE_HEADER = { "X-Client-Type": "native" } as const;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Access-токен для защищённых эндпоинтов. */
  accessToken?: string;
  /** Данные устройства конечного пользователя (`ClientMeta`). Без них бэкенд
   * запишет в сессию UA сервера Next.js вместо браузера. */
  clientMeta?: ClientMeta;
};

/** UA и IP браузера, который инициировал запрос. Запросы к API уходят с
 * сервера Next.js, поэтому эти заголовки нужно пробрасывать вручную —
 * иначе в списке устройств пользователь увидит «node». */
export type ClientMeta = {
  userAgent?: string | null;
  ip?: string | null;
};

/** Единственная точка выхода во внешний API.
 * Любой не-2xx превращается в `ApiError`, сетевой сбой — в `ApiNetworkError`. */
export async function apiFetch<T>(
  path: string,
  { method = "POST", body, accessToken, clientMeta }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { ...CLIENT_TYPE_HEADER };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  if (clientMeta?.userAgent) {
    headers["User-Agent"] = clientMeta.userAgent;
  }
  if (clientMeta?.ip) {
    headers["X-Real-IP"] = clientMeta.ip;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch (cause) {
    throw new ApiNetworkError(cause);
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorBody(response));
  }

  // 204 и пустое тело — у logout, password-reset/confirm, revoke-эндпоинтов.
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

async function readErrorBody(response: Response): Promise<ApiErrorBody> {
  try {
    const parsed = (await response.json()) as Partial<ApiErrorBody>;
    if (parsed && typeof parsed.code === "string") {
      return parsed as ApiErrorBody;
    }
  } catch {
    // Не-JSON ответ (502 от прокси, HTML-страница ошибки) — падаем в fallback.
  }
  return { code: `http_${response.status}`, message: "Ошибка сервера" };
}
