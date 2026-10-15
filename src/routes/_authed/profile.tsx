import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/pages/profile'

// Профиль открывается шторкой; вложенные страницы (/profile/...) позже лягут в _authed/profile/
export const Route = createFileRoute('/_authed/profile')({
  staticData: { sheet: true },
  head: () => ({ meta: [{ title: 'Профиль — РБТ Сервис' }, { name: 'robots', content: 'noindex, nofollow' }] }),
  component: ProfilePage,
})
