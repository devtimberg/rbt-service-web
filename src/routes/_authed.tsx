import { createFileRoute, redirect } from '@tanstack/react-router'
import { loginRedirectSearch } from '@/entities/session'
import { ROUTES } from '@/shared/config'

// Защищённые страницы (профиль и вложенные): гостя отправляем на вход, исходный адрес сохраняем в ?redirect=
export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: ROUTES.LOGIN, search: loginRedirectSearch(location.href) })
    }
  },
})
