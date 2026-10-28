'use client'

import { useSyncExternalStore } from 'react'

/** Совпадает ли media-запрос. На сервере и при гидрации false, чтобы SSR и первый рендер клиента совпали. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Ниже брейкпоинта md (768px). */
export function useIsMobile() {
  return !useMediaQuery('(min-width: 768px)')
}
