import type { ApiSession } from '@/shared/api'
import { accessTokenExpiresAt } from './refresh'
import type { SessionData } from './types'

function userFromApi(user: ApiSession['user']): SessionData['user'] {
  return {
    id: user.id,
    email: user.email,
    isEmailVerified: user.emailVerified,
    firstName: user.firstName,
    lastName: user.lastName,
  }
}

/** Данные сессии из ответа login, signup/complete и password-change: refreshToken в них обязателен.
 * Клиент всегда ходит с `X-Client-Type: native`, поэтому его отсутствие — нарушение контракта. */
export function sessionFromApi(session: ApiSession, now: number = Date.now()): SessionData {
  if (!session.refreshToken) {
    throw new Error('API не вернул refreshToken в bearer-режиме')
  }
  return {
    user: userFromApi(session.user),
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    accessTokenExpiresAt: accessTokenExpiresAt(session.expiresIn, now),
  }
}

/** Результат refresh. `rotated: false` — grace-ответ бэкенда при гонке: refreshToken в нём нет, потому что
 * его уже выдали параллельному запросу и тот записал в cookie. Такой access годится только для текущего запроса,
 * а прежний (уже ротированный) refresh в cookie возвращать нельзя: следующий refresh был бы принят за reuse
 * и отозвал бы всю семью токенов. */
export type RefreshedSession = { data: SessionData; rotated: boolean }

export function sessionFromRefresh(
  session: ApiSession,
  current: SessionData,
  now: number = Date.now(),
): RefreshedSession {
  const rotated = Boolean(session.refreshToken)
  return {
    data: {
      user: userFromApi(session.user),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken || current.refreshToken,
      accessTokenExpiresAt: accessTokenExpiresAt(session.expiresIn, now),
    },
    rotated,
  }
}
