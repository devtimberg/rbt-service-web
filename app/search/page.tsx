import type { Metadata } from 'next'
import { SearchPage } from '@/pages/search'

export const metadata: Metadata = { title: 'Поиск — РБТ Сервис' }

export default function Page() {
  return <SearchPage />
}
