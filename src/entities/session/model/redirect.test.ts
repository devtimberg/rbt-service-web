import { describe, expect, it } from 'vite-plus/test'
import { loginRedirectSearch, safeRedirectPath } from './redirect'

describe('safeRedirectPath', () => {
  it('пропускает внутренние пути с query и hash', () => {
    expect(safeRedirectPath('/profile/orders?page=2#top')).toBe('/profile/orders?page=2#top')
  })
  it('по умолчанию ведёт в профиль', () => {
    expect(safeRedirectPath(undefined)).toBe('/profile')
    expect(safeRedirectPath(null)).toBe('/profile')
    expect(safeRedirectPath('')).toBe('/profile')
  })
  it('отбрасывает чужие адреса (open redirect)', () => {
    expect(safeRedirectPath('https://evil.com')).toBe('/profile')
    expect(safeRedirectPath('//evil.com')).toBe('/profile')
    expect(safeRedirectPath('/\\evil.com')).toBe('/profile')
    expect(safeRedirectPath('javascript:alert(1)')).toBe('/profile')
    expect(safeRedirectPath('profile')).toBe('/profile')
  })
  it('использует переданный fallback', () => {
    expect(safeRedirectPath('//evil.com', '/')).toBe('/')
  })
})

describe('loginRedirectSearch', () => {
  it('кладёт адрес возврата в параметр redirect', () => {
    expect(loginRedirectSearch('/profile?tab=1')).toEqual({ redirect: '/profile?tab=1' })
  })
})
