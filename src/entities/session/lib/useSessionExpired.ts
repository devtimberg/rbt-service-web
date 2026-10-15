import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'
import { ROUTES } from '@/shared/config'
import { setSessionUser } from '../api/session.query'
import type { ActionResult } from '../model/result'

/** Общая обработка 401 от защищённых серверных функций (password-change, logout-all): сервер уже очистил cookie,
 * клиент сбрасывает пользователя в кэше и уводит на вход. Возвращает true, если результат был 401 и обработан. */
export function useSessionExpired() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useCallback(
    (result: ActionResult<object>): boolean => {
      if (result.ok || !result.unauthorized) return false
      setSessionUser(queryClient, null)
      void router.navigate({ to: ROUTES.LOGIN }).then(() => router.invalidate())
      return true
    },
    [queryClient, router],
  )
}
