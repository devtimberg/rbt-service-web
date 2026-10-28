'use client'

import type { StateStorage } from 'zustand/middleware'

/** Заглушка для сервера: localStorage там недоступен, чтение даёт null, запись ничего не делает. */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

/** Хранилище в памяти на случай, когда localStorage заблокирован (данные живут до перезагрузки страницы). */
function createMemoryStorage(): StateStorage {
  const map = new Map<string, string>()
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
    removeItem: (key) => void map.delete(key),
  }
}

/** Доступ к localStorage бросает SecurityError (Safari с блокировкой cookies, часть webview), запись — QuotaExceeded. */
function probeLocalStorage(): StateStorage | null {
  try {
    const probe = '__rbt_storage_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return null
  }
}

/** localStorage в браузере (или память, если он недоступен) и заглушка на сервере (SSR) — для persist-сторов zustand. */
export function getBrowserStorage(): StateStorage {
  return typeof window === 'undefined' ? noopStorage : (probeLocalStorage() ?? createMemoryStorage())
}
