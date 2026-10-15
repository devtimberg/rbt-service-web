// @vitest-environment node
import { describe, expect, it } from 'vite-plus/test'
import type { SessionData } from '../model/types'
import { sealSession, unsealSession } from './cookie-seal.server'

const SECRET = 'test-secret-test-secret-test-secret-0000'
const DAY = 24 * 60 * 60 * 1000

const data: SessionData = {
  user: { id: '1', email: 'a@b.ru', isEmailVerified: true, firstName: 'Иван', lastName: 'Петров' },
  accessToken: 'access',
  refreshToken: 'refresh',
  accessTokenExpiresAt: 123,
}

describe('cookie-seal', () => {
  it('запечатывает и распечатывает сессию', () => {
    const sealed = sealSession(data, SECRET, DAY, 0)
    expect(sealed).not.toContain('refresh')
    expect(unsealSession(sealed, SECRET, 1000)).toEqual(data)
  })

  it('чужой секрет, порча и мусор дают null', () => {
    const sealed = sealSession(data, SECRET, DAY, 0)
    expect(unsealSession(sealed, 'another-secret-another-secret-0000000', 1)).toBeNull()
    expect(unsealSession(`${sealed.slice(0, -2)}AA`, SECRET, 1)).toBeNull()
    expect(unsealSession('garbage', SECRET, 1)).toBeNull()
    expect(unsealSession(undefined, SECRET, 1)).toBeNull()
  })

  it('укороченный тег аутентификации отвергается', () => {
    const [version, iv, tag, encrypted] = sealSession(data, SECRET, DAY, 0).split('.')
    const shortTag = Buffer.from(tag!, 'base64url').subarray(0, 4).toString('base64url')
    expect(unsealSession([version, iv, shortTag, encrypted].join('.'), SECRET, 1)).toBeNull()
  })

  it('просроченная сессия не принимается', () => {
    const sealed = sealSession(data, SECRET, DAY, 0)
    expect(unsealSession(sealed, SECRET, DAY - 1)).toEqual(data)
    expect(unsealSession(sealed, SECRET, DAY)).toBeNull()
  })
})
