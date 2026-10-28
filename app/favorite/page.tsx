import type { Metadata } from 'next'
import { FavoritePage } from '@/pages/favorite'

export const metadata: Metadata = { title: 'Избранное — РБТ Сервис' }

export default function Page() {
  return <FavoritePage />
}
