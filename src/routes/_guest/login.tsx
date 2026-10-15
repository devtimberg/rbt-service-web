import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginPage } from '@/pages/auth/login'

// Вход открывается шторкой. `redirect` — куда вернуть после входа (выставляет guard защищённых роутов)
export const Route = createFileRoute('/_guest/login')({
  staticData: { sheet: true },
  validateSearch: z.object({ redirect: z.string().optional().catch(undefined) }),
  head: () => ({ meta: [{ title: 'Вход — РБТ Сервис' }, { name: 'robots', content: 'noindex, nofollow' }] }),
  component: function LoginRoute() {
    const { redirect } = Route.useSearch()
    return <LoginPage redirectTo={redirect} />
  },
})
