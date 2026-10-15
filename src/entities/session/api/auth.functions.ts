import { createServerFn } from '@tanstack/react-start'
import { failureFrom, type ActionResult } from '../model/result'
import {
  loginSchema,
  passwordChangeSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  signupCompleteSchema,
  signupStartSchema,
  signupVerifySchema,
} from '../model/schemas'
import type { SessionUser } from '../model/types'
import * as authApi from './auth-api.server'
import {
  clearSession,
  getClientMeta,
  getValidSession,
  readSession,
  sessionFromApi,
  writeSession,
} from './session.server'

// Серверные функции (RPC). Тела handler'ов выполняются только на сервере, `*.server.ts` импортируются
// из них, поэтому в клиентский бандл серверный код не попадает.
// Ошибки API не бросаются, а возвращаются как `{ ok: false, message }` с русским сообщением.

/** Текущий пользователь или null (гость). Токены наружу не отдаются. */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(async (): Promise<SessionUser | null> => {
  const session = await getValidSession()
  return session?.user ?? null
})

export const login = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(async ({ data }): Promise<ActionResult<{ user: SessionUser }>> => {
    try {
      const session = sessionFromApi(await authApi.login(data.email, data.password, getClientMeta()))
      writeSession(session)
      return { ok: true, user: session.user }
    } catch (error) {
      return failureFrom(error)
    }
  })

/** Выход: ошибки API глотаем (эндпоинт идемпотентен, токены могли уже протухнуть), cookie чистим всегда. */
export const logout = createServerFn({ method: 'POST' }).handler(async (): Promise<ActionResult> => {
  try {
    const session = (await getValidSession()) ?? readSession()
    if (session) await authApi.logout(session.accessToken, session.refreshToken)
  } catch {
    // см. комментарий выше
  }
  clearSession()
  return { ok: true }
})

/** Выход со всех устройств. */
export const logoutAll = createServerFn({ method: 'POST' }).handler(async (): Promise<ActionResult> => {
  try {
    const session = await getValidSession()
    if (session) await authApi.logoutAll(session.accessToken)
  } catch {
    // см. logout
  }
  clearSession()
  return { ok: true }
})

export const signupStart = createServerFn({ method: 'POST' })
  .validator(signupStartSchema)
  .handler(async ({ data }): Promise<ActionResult<{ resendIn: number }>> => {
    try {
      const info = await authApi.signupStart(data.email)
      return { ok: true, resendIn: info.nextResendIn }
    } catch (error) {
      return failureFrom(error)
    }
  })

export const signupResendOtp = createServerFn({ method: 'POST' })
  .validator(signupStartSchema)
  .handler(async ({ data }): Promise<ActionResult<{ resendIn: number }>> => {
    try {
      const info = await authApi.signupResendOtp(data.email)
      return { ok: true, resendIn: info.nextResendIn }
    } catch (error) {
      return failureFrom(error)
    }
  })

export const signupVerify = createServerFn({ method: 'POST' })
  .validator(signupVerifySchema)
  .handler(async ({ data }): Promise<ActionResult<{ ticket: string }>> => {
    try {
      const { ticket } = await authApi.signupVerify(data.email, data.code)
      return { ok: true, ticket }
    } catch (error) {
      return failureFrom(error)
    }
  })

/** Завершение регистрации: бэкенд создаёт пользователя и сразу отдаёт сессию, повторный вход не нужен. */
export const signupComplete = createServerFn({ method: 'POST' })
  .validator(signupCompleteSchema)
  .handler(async ({ data }): Promise<ActionResult<{ user: SessionUser }>> => {
    try {
      const session = sessionFromApi(
        await authApi.signupComplete(
          { ticket: data.ticket, password: data.password, firstName: data.firstName, lastName: data.lastName },
          getClientMeta(),
        ),
      )
      writeSession(session)
      return { ok: true, user: session.user }
    } catch (error) {
      return failureFrom(error)
    }
  })

export const passwordResetRequest = createServerFn({ method: 'POST' })
  .validator(passwordResetRequestSchema)
  .handler(async ({ data }): Promise<ActionResult<{ resendIn: number }>> => {
    try {
      const info = await authApi.passwordResetRequest(data.email)
      return { ok: true, resendIn: info.nextResendIn }
    } catch (error) {
      return failureFrom(error)
    }
  })

export const passwordResetConfirm = createServerFn({ method: 'POST' })
  .validator(passwordResetConfirmSchema)
  .handler(async ({ data }): Promise<ActionResult> => {
    try {
      await authApi.passwordResetConfirm({ email: data.email, code: data.code, newPassword: data.newPassword })
      return { ok: true }
    } catch (error) {
      return failureFrom(error)
    }
  })

/** Смена пароля: бэкенд отзывает все сессии и выдаёт текущему устройству новую пару токенов, её кладём в cookie. */
export const passwordChange = createServerFn({ method: 'POST' })
  .validator(passwordChangeSchema)
  .handler(async ({ data }): Promise<ActionResult<{ user: SessionUser }>> => {
    try {
      const current = await getValidSession()
      if (!current) {
        return { ok: false, message: 'Сессия недействительна, войдите заново' }
      }
      const session = sessionFromApi(
        await authApi.passwordChange(current.accessToken, data.oldPassword, data.newPassword),
        current.refreshToken,
      )
      writeSession(session)
      return { ok: true, user: session.user }
    } catch (error) {
      return failureFrom(error)
    }
  })
