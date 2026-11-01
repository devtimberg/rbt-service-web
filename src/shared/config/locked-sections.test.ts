import { describe, expect, it } from 'vite-plus/test'
import { ROUTES } from '@/shared/config'
import { isLockedSection } from './locked-sections'

describe('isLockedSection', () => {
  it('закрыты каталог с подразделами, поиск, корзина и избранное', () => {
    expect(isLockedSection(ROUTES.CATALOG)).toBe(true)
    expect(isLockedSection(ROUTES.SEARCH)).toBe(true)
    expect(isLockedSection(`${ROUTES.CATALOG}/fridge`)).toBe(true)
    expect(isLockedSection(ROUTES.CART)).toBe(true)
    expect(isLockedSection(ROUTES.FAVORITE)).toBe(true)
  })

  it('главная и вызов мастера открыты, похожий префикс не считается подразделом', () => {
    expect(isLockedSection(ROUTES.HOME)).toBe(false)
    expect(isLockedSection(ROUTES.MASTER_CALL)).toBe(false)
    expect(isLockedSection('/catalogue')).toBe(false)
  })
})
