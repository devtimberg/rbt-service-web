import type { Metadata } from 'next'
import { MasterCallPage } from '@/pages/master-call'

export const metadata: Metadata = { title: 'Вызвать мастера — РБТ Сервис' }

export default function Page() {
  return <MasterCallPage />
}
