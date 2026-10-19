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
import { sessionFromApi } from '../model/session-data'
import type { SessionUser } from '../model/types'
import { currentUserAction, logoutAction, logoutAllAction, passwordChangeAction } from './auth-actions.server'
import * as authApi from './auth-api.server'
import { getClientMeta, writeSession } from './session.server'

// Серверные функции (RPC). Тела handler'ов выполняются только на сервере, `*.server.ts` импортируются
// из них, поэтому в клиентский бандл серверный код не попадает.
// Ошибки API не бросаются, а возвращаются как `{ ok: false, message }` с русским сообщением.

/** Текущий пользователь или null (гость). Токены наружу не отдаются. */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(async (): Promise<SessionUser | null> =>
  currentUserAction(),
)

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

export const logout = createServerFn({ method: 'POST' }).handler(async (): Promise<ActionResult> => logoutAction())

export const logoutAll = createServerFn({ method: 'POST' }).handler(async (): Promise<ActionResult> =>
  logoutAllAction(),
)

export const signupStart = createServerFn({ method: 'POST' })
  .validator(signupStartSchema)
  .handler(async ({ data }): Promise<ActionResult<{ resendIn: number }>> => {
    try {
      const info = await authApi.signupStart(data.email, getClientMeta())
      return { ok: true, resendIn: info.nextResendIn }
    } catch (error) {
      return failureFrom(error)
    }
  })

export const signupResendOtp = createServerFn({ method: 'POST' })
  .validator(signupStartSchema)
  .handler(async ({ data }): Promise<ActionResult<{ resendIn: number }>> => {
    try {
      const info = await authApi.signupResendOtp(data.email, getClientMeta())
      return { ok: true, resendIn: info.nextResendIn }
    } catch (error) {
      return failureFrom(error)
    }
  })

export const signupVerify = createServerFn({ method: 'POST' })
  .validator(signupVerifySchema)
  .handler(async ({ data }): Promise<ActionResult<{ ticket: string }>> => {
    try {
      const { ticket } = await authApi.signupVerify(data.email, data.code, getClientMeta())
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
      const info = await authApi.passwordResetRequest(data.email, getClientMeta())
      return { ok: true, resendIn: info.nextResendIn }
    } catch (error) {
      return failureFrom(error)
    }
  })

export const passwordResetConfirm = createServerFn({ method: 'POST' })
  .validator(passwordResetConfirmSchema)
  .handler(async ({ data }): Promise<ActionResult> => {
    try {
      await authApi.passwordResetConfirm(
        { email: data.email, code: data.code, newPassword: data.newPassword },
        getClientMeta(),
      )
      return { ok: true }
    } catch (error) {
      return failureFrom(error)
    }
  })

export const passwordChange = createServerFn({ method: 'POST' })
  .validator(passwordChangeSchema)
  .handler(async ({ data }): Promise<ActionResult<{ user: SessionUser }>> => passwordChangeAction(data))
