'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getBrowserStorage } from '@/shared/lib/browser-storage'

type CartStore = {
  /** id товара → количество. */
  items: Map<string, number>
  toggle: (productId: string) => void
  has: (productId: string) => boolean
  increment: (productId: string) => void
  decrement: (productId: string) => void
  remove: (productId: string) => void
  getQuantity: (productId: string) => number
}

/** Из localStorage берём только валидные пары [id: string, qty: целое >= 1]; остальное отбрасываем. */
export function parseCartItems(raw: unknown[]): Map<string, number> {
  const items = new Map<string, number>()
  for (const entry of raw) {
    if (!Array.isArray(entry)) continue
    const [id, qty] = entry as [unknown, unknown]
    if (typeof id === 'string' && typeof qty === 'number' && Number.isInteger(qty) && qty >= 1) items.set(id, qty)
  }
  return items
}

/**
 * ВРЕМЕННОЕ решение: корзина живёт в zustand + localStorage.
 * Заменить на Query/API, когда появится бекенд корзины (ADR 0008: серверные данные хранит TanStack Query).
 *
 * SSR: `skipHydration: true`, поэтому на сервере и при первой отрисовке в браузере стор пустой
 * и разметка совпадает. Данные из localStorage подтягивает `rehydrateCartStore()` (вызывает корневой лайаут в useEffect).
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: new Map<string, number>(),
      toggle: (productId) =>
        set((state) => {
          const next = new Map(state.items)
          if (next.has(productId)) {
            next.delete(productId)
          } else {
            next.set(productId, 1)
          }
          return { items: next }
        }),
      has: (productId) => get().items.has(productId),
      increment: (productId) =>
        set((state) => {
          const next = new Map(state.items)
          next.set(productId, (next.get(productId) ?? 0) + 1)
          return { items: next }
        }),
      decrement: (productId) =>
        set((state) => {
          const current = state.items.get(productId) ?? 0
          // Количество не опускается ниже 1: для удаления есть remove
          if (current <= 1) return state
          const next = new Map(state.items)
          next.set(productId, current - 1)
          return { items: next }
        }),
      remove: (productId) =>
        set((state) => {
          const next = new Map(state.items)
          next.delete(productId)
          return { items: next }
        }),
      getQuantity: (productId) => get().items.get(productId) ?? 0,
    }),
    {
      name: 'rbt-cart',
      skipHydration: true,
      // Map сериализуется массивом пар (формат прежней версии, сохранённые корзины совместимы)
      storage: createJSONStorage(getBrowserStorage, {
        replacer: (_key, value) => (value instanceof Map ? [...value] : value),
        reviver: (key, value) => (key === 'items' && Array.isArray(value) ? parseCartItems(value) : value),
      }),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

/** Подтягивает корзину из localStorage. Вызывать на клиенте после гидрации; на сервере — no-op. */
export function rehydrateCartStore(): void {
  if (typeof window === 'undefined') return
  void useCartStore.persist.rehydrate()
}
