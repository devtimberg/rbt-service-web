'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getBrowserStorage } from '@/shared/lib/browser-storage'

type FavoritesStore = {
  items: Set<string>
  toggle: (productId: string) => void
  has: (productId: string) => boolean
}

/**
 * Избранное: zustand + localStorage (ВРЕМЕННО, до появления бекенда избранного; ADR 0008).
 *
 * SSR: `skipHydration: true`, на сервере и при первой отрисовке стор пустой, разметка совпадает.
 * Данные из localStorage подтягивает `rehydrateFavoritesStore()` (вызывает корневой лайаут в useEffect).
 */
export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: new Set<string>(),
      toggle: (productId) =>
        set((state) => {
          const next = new Set(state.items)
          if (next.has(productId)) {
            next.delete(productId)
          } else {
            next.add(productId)
          }
          return { items: next }
        }),
      has: (productId) => get().items.has(productId),
    }),
    {
      name: 'rbt-favorites',
      skipHydration: true,
      // Set сериализуется массивом (формат прежней версии)
      storage: createJSONStorage(getBrowserStorage, {
        replacer: (_key, value) => (value instanceof Set ? [...value] : value),
        reviver: (key, value) =>
          key === 'items' && Array.isArray(value)
            ? new Set((value as unknown[]).filter((v): v is string => typeof v === 'string'))
            : value,
      }),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

/** Подтягивает избранное из localStorage. Вызывать на клиенте после гидрации; на сервере — no-op. */
export function rehydrateFavoritesStore(): void {
  if (typeof window === 'undefined') return
  void useFavoritesStore.persist.rehydrate()
}
