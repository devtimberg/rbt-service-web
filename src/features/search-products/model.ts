'use client'

import { create } from 'zustand'

type SearchStore = {
  query: string
  setQuery: (query: string) => void
  reset: () => void
}

/** Строка поиска. Без persist: запрос живёт, пока открыта вкладка. */
export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  reset: () => set({ query: '' }),
}))
