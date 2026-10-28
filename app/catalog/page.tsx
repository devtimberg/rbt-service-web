import type { Metadata } from 'next'
import { CatalogPage } from '@/pages/catalog'

export const metadata: Metadata = { title: 'Каталог — РБТ Сервис' }

export default function Page() {
  return <CatalogPage />
}
