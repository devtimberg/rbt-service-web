import { useSyncExternalStore } from 'react'

type PersistApi = { hasHydrated: () => boolean; onFinishHydration: (fn: () => void) => () => void }

/** Данные persist-стора (skipHydration) подтянуты из localStorage. На сервере и при первой отрисовке false. */
export function usePersistHydrated(persist: PersistApi): boolean {
  return useSyncExternalStore(persist.onFinishHydration, persist.hasHydrated, () => false)
}
