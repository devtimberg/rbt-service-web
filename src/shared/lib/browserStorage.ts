import type { StateStorage } from 'zustand/middleware'

/** Заглушка для сервера: localStorage там недоступен, чтение даёт null, запись ничего не делает. */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

/** localStorage в браузере и безопасная заглушка на сервере (SSR) — для persist-сторов zustand. */
export function getBrowserStorage(): StateStorage {
  return typeof window === 'undefined' ? noopStorage : window.localStorage
}
