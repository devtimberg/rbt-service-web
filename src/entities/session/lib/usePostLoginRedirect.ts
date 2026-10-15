import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useCallback } from 'react'
import { setSessionUser } from '../api/session.query'
import { safeRedirectPath } from '../model/redirect'
import type { SessionUser } from '../model/types'

/** Завершение входа: кладёт пользователя в кэш сессии (контекст роутера увидит его при навигации)
 * и переходит на безопасный адрес возврата, по умолчанию в профиль.
 * `router.invalidate()` до перехода не вызываем: он перезапустил бы guest-guard на /login и увёл бы в профиль мимо redirect. */
export function usePostLoginRedirect(redirectTo?: string | null) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useCallback(
    (user: SessionUser) => {
      setSessionUser(queryClient, user)
      // history.replace принимает путь вместе с query/hash, а `navigate({ to })` ждёт только известные маршруты
      router.history.replace(safeRedirectPath(redirectTo))
    },
    [queryClient, router, redirectTo],
  )
}
