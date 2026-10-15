import { useMutation } from '@tanstack/react-query'
import type { z } from 'zod'
import { signupComplete, signupCompleteSchema, usePostLoginRedirect } from '@/entities/session'

export type SignupCompleteInput = z.input<typeof signupCompleteSchema>

/** Завершение регистрации: сессия создаётся сразу, затем переход (в профиль или на `redirectTo`). */
export function useSignupComplete(redirectTo?: string | null) {
  const finish = usePostLoginRedirect(redirectTo)
  return useMutation({
    mutationFn: (input: SignupCompleteInput) => signupComplete({ data: input }),
    onSuccess: (result) => {
      if (result.ok) finish(result.user)
    },
  })
}
