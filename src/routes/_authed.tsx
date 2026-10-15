import { createFileRoute, redirect } from '@tanstack/react-router'
import { REDIRECT_PARAM, ROUTES } from '@/shared/config'

// Защищённые страницы (профиль и вложенные): гостя отправляем на вход, исходный адрес сохраняем в ?redirect=
export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: ROUTES.LOGIN, search: { [REDIRECT_PARAM]: location.href } })
    }
  },
})
