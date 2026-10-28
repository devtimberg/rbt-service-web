import { useEffect } from 'react'
import { useCartStore } from '@/entities/cart'
import { useFavoritesStore } from '@/entities/favorite'

const stores = [useCartStore, useFavoritesStore]

/** Изменение корзины/избранного в другой вкладке: подтягиваем свежие данные, иначе эта вкладка перезапишет их своими. */
export function useStorageSync() {
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      for (const { persist } of stores) {
        // key === null: localStorage.clear()
        if (event.key === null || event.key === persist.getOptions().name) void persist.rehydrate()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
}
