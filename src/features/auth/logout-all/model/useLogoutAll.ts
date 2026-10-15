import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { logoutAll, setSessionUser, useSessionExpired } from '@/entities/session'
import { ROUTES } from '@/shared/config'

/** Выход со всех устройств. Успех: как у обычного выхода (сброс кэша, главная). 401: общий редирект на вход.
 * Прочие ошибки остаются в `data` для показа пользователю (cookie сохранена, можно повторить). */
export function useLogoutAll() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const handleExpired = useSessionExpired()
  return useMutation({
    mutationFn: () => logoutAll(),
    onSuccess: async (result) => {
      if (handleExpired(result)) return
      if (!result.ok) return
      setSessionUser(queryClient, null)
      await router.navigate({ to: ROUTES.HOME })
      await router.invalidate()
    },
  })
}
