import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vite-plus/test'
import { useCartStore } from '@/entities/cart'
import { useStorageSync } from './useStorageSync'

describe('useStorageSync', () => {
  it('storage-событие корзины подтягивает данные из localStorage, после unmount не реагирует', () => {
    const { unmount } = renderHook(() => useStorageSync())
    localStorage.setItem('rbt-cart', JSON.stringify({ state: { items: [['a', 3]] }, version: 0 }))
    window.dispatchEvent(new StorageEvent('storage', { key: 'rbt-cart' }))
    expect(useCartStore.getState().getQuantity('a')).toBe(3)

    unmount()
    localStorage.setItem('rbt-cart', JSON.stringify({ state: { items: [['a', 5]] }, version: 0 }))
    window.dispatchEvent(new StorageEvent('storage', { key: 'rbt-cart' }))
    expect(useCartStore.getState().getQuantity('a')).toBe(3)
  })
})
