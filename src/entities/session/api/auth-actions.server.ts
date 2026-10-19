import { ApiError, messageForCode } from '@/shared/api'
import { failureFrom, type ActionFailure, type ActionResult } from '../model/result'
import { sessionFromApi } from '../model/session-data'
import type { SessionUser } from '../model/types'
import * as authApi from './auth-api.server'
import { clearSession, getClientMeta, getValidSession, readSession, writeSession } from './session.server'

// Логика серверных функций, требующих сессии. Вынесена из `auth.functions.ts`, чтобы покрыть её unit-тестами
// без рантайма createServerFn. Импортировать только из тел handler'ов.

type SessionCheck = { ok: true; accessToken: string } | { ok: false; failure: ActionFailure }

/** Годная сессия для защищённого вызова. Отсутствие сессии различаем по cookie:
 * очищена (refresh отклонён) — «сессия истекла», сохранена (сеть, 5xx при refresh) — временный сбой. */
async function requireSession(): Promise<SessionCheck> {
  const session = await getValidSession()
  if (session) return { ok: true, accessToken: session.accessToken }
  if (readSession()) return { ok: false, failure: { ok: false, message: 'Не удалось связаться с сервером' } }
  return { ok: false, failure: { ok: false, message: messageForCode('unauthorized'), unauthorized: true } }
}

/** Текущий пользователь или null (гость). Cookie сохранена, а сессии нет — временный сбой refresh:
 * бросаем, чтобы гость не закэшировался на staleTime. */
export async function currentUserAction(): Promise<SessionUser | null> {
  const session = await getValidSession()
  if (!session && readSession()) throw new Error('session_refresh_unavailable')
  return session?.user ?? null
}

/** 401 от защищённого эндпоинта: access отозван или истёк (например, logout-all на другом устройстве).
 * Сессия мертва, cookie чистим и просим войти заново. Прочие ошибки возвращаем как есть. */
function failureFromProtected(error: unknown): ActionFailure {
  if (error instanceof ApiError && error.isUnauthorized) {
    clearSession()
    return { ...failureFrom(error), unauthorized: true }
  }
  return failureFrom(error)
}

/** Выход: ошибки API глотаем (эндпоинт идемпотентен, токены могли уже протухнуть), cookie чистим всегда.
 * Локальный выход важнее: при недоступном бэкенде пользователь всё равно выходит из этого браузера,
 * а refresh-токен в БД доживёт до своего срока (см. ADR 0004). */
export async function logoutAction(): Promise<ActionResult> {
  try {
    const session = (await getValidSession()) ?? readSession()
    if (session) await authApi.logout(session.accessToken, session.refreshToken)
  } catch {
    // см. комментарий выше
  }
  clearSession()
  return { ok: true }
}

/** Выход со всех устройств. В отличие от logout, успех сообщаем только если бэкенд подтвердил отзыв:
 * иначе пользователь решит, что вышел везде. При ошибке (кроме 401) cookie не трогаем, можно повторить. */
export async function logoutAllAction(): Promise<ActionResult> {
  if (!readSession()) return { ok: true }
  try {
    const check = await requireSession()
    if (!check.ok) return check.failure
    await authApi.logoutAll(check.accessToken)
  } catch (error) {
    return failureFromProtected(error)
  }
  clearSession()
  return { ok: true }
}

/** Смена пароля: бэкенд отзывает все сессии и выдаёт текущему устройству новую пару токенов, её кладём в cookie. */
export async function passwordChangeAction(data: {
  oldPassword: string
  newPassword: string
}): Promise<ActionResult<{ user: SessionUser }>> {
  try {
    const check = await requireSession()
    if (!check.ok) return check.failure
    const session = sessionFromApi(
      await authApi.passwordChange(check.accessToken, data.oldPassword, data.newPassword, getClientMeta()),
    )
    writeSession(session)
    return { ok: true, user: session.user }
  } catch (error) {
    // Здесь invalid_credentials — неверный текущий пароль, а не пара email/пароль из формы входа.
    if (error instanceof ApiError && error.code === 'invalid_credentials') {
      const message = 'Неверный текущий пароль'
      return { ok: false, message, fieldErrors: { oldPassword: message } }
    }
    // Требования валидатора пароля бэкенда (details) уже собраны в message, привязываем их к полю нового пароля.
    if (error instanceof ApiError && error.code === 'invalid_password') {
      const failure = failureFrom(error)
      return { ...failure, fieldErrors: { newPassword: failure.message } }
    }
    return failureFromProtected(error)
  }
}
