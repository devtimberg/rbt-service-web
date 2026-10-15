import { createFileRoute } from '@tanstack/react-router'
import { PasswordResetPage } from '@/pages/auth/password-reset'

export const Route = createFileRoute('/_guest/password-reset')({
  staticData: { sheet: true },
  head: () => ({
    meta: [{ title: 'Восстановление пароля — РБТ Сервис' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: PasswordResetPage,
})
