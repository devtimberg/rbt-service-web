import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

afterEach(() => vi.restoreAllMocks())

describe('localStorage заблокирован (SecurityError)', () => {
  it('стор гидратируется, корзина работает в памяти', async () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError')
    })
    vi.resetModules()
    const { useCartStore, rehydrateCartStore } = await import('./model')

    rehydrateCartStore()
    expect(useCartStore.persist.hasHydrated()).toBe(true)

    useCartStore.getState().toggle('a')
    expect(useCartStore.getState().has('a')).toBe(true)
  })
})
