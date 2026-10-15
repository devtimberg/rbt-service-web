import { createFileRoute } from '@tanstack/react-router'
import { FavoritePage } from '@/pages/favorite'

// Избранное открывается шторкой
export const Route = createFileRoute('/favorite')({
  staticData: { sheet: true },
  head: () => ({ meta: [{ title: 'Избранное — РБТ Сервис' }] }),
  component: FavoritePage,
})
