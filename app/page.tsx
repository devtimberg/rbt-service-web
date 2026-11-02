import type { Metadata } from 'next'
import { HomePage } from '@/pages/home'
import { OPEN_GRAPH_BASE, ROUTES } from '@/shared/config'

// Заголовок и описание наследуются из корневого metadata (app/layout.tsx)
export const metadata: Metadata = {
  alternates: { canonical: ROUTES.HOME },
  openGraph: { ...OPEN_GRAPH_BASE, url: ROUTES.HOME },
}

export default function Page() {
  return <HomePage />
}
