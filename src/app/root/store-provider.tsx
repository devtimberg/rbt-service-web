'use client'

import { type ReactNode, useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '@/shared/api'

/**
 * Стор создаётся в useState: на сервере компонент рендерится заново на каждый запрос (кэш одного посетителя
 * не попадает в HTML другого), в браузере стор живёт всю вкладку.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore)
  return <Provider store={store}>{children}</Provider>
}
