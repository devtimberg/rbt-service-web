import { createFileRoute } from '@tanstack/react-router'
import { SignupPage } from '@/pages/auth/signup'

export const Route = createFileRoute('/_guest/signup')({
  staticData: { sheet: true },
  head: () => ({ meta: [{ title: 'Регистрация — РБТ Сервис' }, { name: 'robots', content: 'noindex, nofollow' }] }),
  component: () => <SignupPage />,
})
