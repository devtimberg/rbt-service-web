import { createFileRoute, redirect } from '@tanstack/react-router'
import { ROUTES } from '@/shared/config'

// Страницы только для гостей (вход, регистрация, восстановление пароля): вошедшего уводим в профиль
export const Route = createFileRoute('/_guest')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: ROUTES.PROFILE })
  },
})
