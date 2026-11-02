import type { Metadata } from 'next'
import { FavoritePage } from '@/pages/favorite'

// Служебная страница с личными данными сессии: в выдачу не отдаём
export const metadata: Metadata = {
  title: 'Избранное',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <FavoritePage />
}
