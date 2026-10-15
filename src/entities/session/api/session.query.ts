import { queryOptions, type QueryClient } from '@tanstack/react-query'
import type { SessionUser } from '../model/types'
import { getCurrentUser } from './auth.functions'

export const sessionKeys = {
  all: ['session'] as const,
  user: () => [...sessionKeys.all, 'user'] as const,
}

/** Текущий пользователь (null — гость). Короткий staleTime: сессия может истечь или отозваться. */
export function sessionQuery() {
  return queryOptions({
    queryKey: sessionKeys.user(),
    queryFn: () => getCurrentUser(),
    staleTime: 30_000,
  })
}

/** Для beforeLoad корня: пользователь попадает в контекст роутера. Сбой чтения сессии = гость. */
export async function loadCurrentUser(queryClient: QueryClient): Promise<SessionUser | null> {
  try {
    return await queryClient.fetchQuery(sessionQuery())
  } catch {
    return null
  }
}

/** Записать пользователя в кэш сразу после входа или выхода (без лишнего запроса). */
export function setSessionUser(queryClient: QueryClient, user: SessionUser | null) {
  queryClient.setQueryData(sessionKeys.user(), user)
}
