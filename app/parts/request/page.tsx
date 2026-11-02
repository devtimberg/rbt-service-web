import type { Metadata } from 'next'
import { PartsRequestPage } from '@/pages/parts-request'

export const metadata: Metadata = { title: 'Заказать запчасть — РБТ Сервис' }

export default function Page() {
  return <PartsRequestPage />
}
