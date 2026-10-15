import { useMutation } from '@tanstack/react-query'
import type { z } from 'zod'
import { passwordChange, passwordChangeSchema, useSessionExpired } from '@/entities/session'

export type PasswordChangeInput = z.input<typeof passwordChangeSchema>

/** Смена пароля. При 401 сбрасывает сессию в кэше и уводит на вход; успех и прочие ошибки обрабатывает форма. */
export function usePasswordChange() {
  const handleExpired = useSessionExpired()
  return useMutation({
    mutationFn: (input: PasswordChangeInput) => passwordChange({ data: input }),
    onSuccess: (result) => {
      handleExpired(result)
    },
  })
}
