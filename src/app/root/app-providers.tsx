'use client'

import type { ReactNode } from 'react'
import { StoreProvider } from './store-provider'

/** Клиентские провайдеры приложения. */
export function AppProviders({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>
}
