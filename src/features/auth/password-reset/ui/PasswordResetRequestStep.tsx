import { useMutation } from '@tanstack/react-query'
import type { FormEvent } from 'react'
import {
  AuthShell,
  fieldErrors,
  passwordResetRequest,
  passwordResetRequestSchema,
  resultMessage,
} from '@/entities/session'
import { ROUTES } from '@/shared/config'
import { useFormValues } from '@/shared/lib/useFormValues'
import { Stack } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Form } from '@/shared/ui/Form'
import { FormAlert } from '@/shared/ui/FormAlert'
import { SmartLink } from '@/shared/ui/SmartLink'
import { Text } from '@/shared/ui/Text'
import { TextField } from '@/shared/ui/TextField'

export function PasswordResetRequestStep({ onSubmitted }: { onSubmitted: (email: string, resendIn: number) => void }) {
  const mutation = useMutation({ mutationFn: (email: string) => passwordResetRequest({ data: { email } }) })
  const { values, bind, errors, setErrors } = useFormValues({ email: '' })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = passwordResetRequestSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }
    setErrors({})
    mutation.mutate(parsed.data.email, {
      onSuccess: (result) => {
        if (result.ok) onSubmitted(parsed.data.email, result.resendIn)
      },
    })
  }

  return (
    <AuthShell
      title="Восстановление пароля"
      description="Отправим код для смены пароля на указанный email"
      footer={
        <Text className="cursor-default font-normal text-secondary text-sm text-center">
          Вспомнили пароль?{' '}
          <SmartLink href={ROUTES.LOGIN} className="text-link font-medium">
            Войти
          </SmartLink>
        </Text>
      }
    >
      <Form onSubmit={handleSubmit} noValidate>
        <Stack gap={4}>
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email}
            {...bind('email')}
          />
          <FormAlert message={resultMessage(mutation.data, mutation.error)} />
          <Button type="submit" size="full" className="h-12" loading={mutation.isPending}>
            Отправить код
          </Button>
        </Stack>
      </Form>
    </AuthShell>
  )
}
