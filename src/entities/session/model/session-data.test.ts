import { describe, expect, it } from 'vite-plus/test'
import type { ApiSession } from '@/shared/api'
import { sessionFromApi, sessionFromRefresh } from './session-data'
import type { SessionData } from './types'

const user = { id: '1', email: 'a@b.ru', emailVerified: true, firstName: 'Иван', lastName: 'Петров' }
const apiSession = (refreshToken?: string | null): ApiSession => ({
  accessToken: 'access-new',
  tokenType: 'Bearer',
  expiresIn: 900,
  user,
  ...(refreshToken === undefined ? {} : { refreshToken }),
})

const current: SessionData = {
  user: { id: '1', email: 'a@b.ru', isEmailVerified: true, firstName: 'Иван', lastName: 'Петров' },
  accessToken: 'access-old',
  refreshToken: 'refresh-old',
  accessTokenExpiresAt: 0,
}

describe('sessionFromApi', () => {
  it('собирает данные сессии из ответа API', () => {
    expect(sessionFromApi(apiSession('refresh-new'), 1_000)).toEqual({
      user: current.user,
      accessToken: 'access-new',
      refreshToken: 'refresh-new',
      accessTokenExpiresAt: 1_000 + 900_000,
    })
  })

  it('без refreshToken бросает ошибку: login, signup и password-change всегда ждут его в bearer-режиме', () => {
    expect(() => sessionFromApi(apiSession(), 0)).toThrow('refreshToken')
    expect(() => sessionFromApi(apiSession(null), 0)).toThrow('refreshToken')
  })
})

describe('sessionFromRefresh', () => {
  it('обычная ротация: новый refreshToken попадает в сессию и её нужно сохранить', () => {
    const result = sessionFromRefresh(apiSession('refresh-new'), current, 1_000)
    expect(result.rotated).toBe(true)
    expect(result.data.refreshToken).toBe('refresh-new')
    expect(result.data.accessToken).toBe('access-new')
  })

  it('grace-ответ без refreshToken: прежний refresh сохраняется, но писать его в cookie нельзя', () => {
    const result = sessionFromRefresh(apiSession(), current, 1_000)
    expect(result.rotated).toBe(false)
    expect(result.data.accessToken).toBe('access-new')
    expect(result.data.refreshToken).toBe('refresh-old')
    expect(result.data.accessTokenExpiresAt).toBe(1_000 + 900_000)
  })
})
