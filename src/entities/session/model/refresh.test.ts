import { describe, expect, it } from 'vite-plus/test'
import { accessTokenExpiresAt, isAccessTokenFresh, REFRESH_SKEW_MS } from './refresh'

describe('isAccessTokenFresh', () => {
  const now = 1_000_000
  it('REFRESH_SKEW_MS равен 60 секундам', () => {
    expect(REFRESH_SKEW_MS).toBe(60_000)
  })
  it('токен годен, пока до истечения больше 60 секунд', () => {
    expect(isAccessTokenFresh(now + 60_001, now)).toBe(true)
  })
  it('на границе в ровно 60 секунд токен уже нужно обновлять', () => {
    expect(isAccessTokenFresh(now + 60_000, now)).toBe(false)
  })
  it('истёкший и почти истёкший токены не годны', () => {
    expect(isAccessTokenFresh(now + 1, now)).toBe(false)
    expect(isAccessTokenFresh(now - 1, now)).toBe(false)
  })
})

describe('accessTokenExpiresAt', () => {
  it('переводит секунды из ответа API в миллисекунды от now', () => {
    expect(accessTokenExpiresAt(900, 1_000)).toBe(1_000 + 900_000)
  })
})
