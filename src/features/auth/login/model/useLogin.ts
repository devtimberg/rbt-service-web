import { useMutation } from '@tanstack/react-query'
import type { z } from 'zod'
import { login, loginSchema, usePostLoginRedirect } from '@/entities/session'

export type LoginInput = z.input<typeof loginSchema>

/** Вход по email и паролю. При успехе сохраняет пользователя в кэш сессии и уводит на `redirectTo` (по умолчанию профиль). */
export function useLogin(redirectTo?: string | null) {
  const finish = usePostLoginRedirect(redirectTo)
  return useMutation({
    mutationFn: (input: LoginInput) => login({ data: input }),
    onSuccess: (result) => {
      if (result.ok) finish(result.user)
    },
  })
}
