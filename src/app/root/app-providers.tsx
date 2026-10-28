'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'

/**
 * Клиентские провайдеры. QueryClient создаётся в useState: на сервере компонент рендерится заново на каждый запрос
 * (кэш одного посетителя не попадает в HTML другого), в браузере клиент живёт всю вкладку. Уйдёт в фазе 3 (RTK Query).
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } }))
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
