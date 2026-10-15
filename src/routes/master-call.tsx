import { createFileRoute } from '@tanstack/react-router'
import { MasterCallPage } from '@/pages/master-call'

// Вызов мастера открывается шторкой
export const Route = createFileRoute('/master-call')({
  staticData: { sheet: true },
  head: () => ({ meta: [{ title: 'Вызвать мастера — РБТ Сервис' }] }),
  component: MasterCallPage,
})
