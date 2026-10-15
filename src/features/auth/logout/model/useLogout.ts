import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { logout, setSessionUser } from '@/entities/session'
import { ROUTES } from '@/shared/config'

/** Выход: сервер чистит сессию, затем сбрасываем кэш пользователя и уходим на главную (как в старом `signOut`). */
export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      setSessionUser(queryClient, null)
      await router.navigate({ to: ROUTES.HOME })
      await router.invalidate()
    },
  })
}
