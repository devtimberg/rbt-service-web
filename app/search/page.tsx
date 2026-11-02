import type { Metadata } from 'next'
import { SearchPage } from '@/pages/search'

// Служебная страница личного поискового сценария: в выдачу не отдаём
export const metadata: Metadata = {
  title: 'Поиск',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <SearchPage />
}
