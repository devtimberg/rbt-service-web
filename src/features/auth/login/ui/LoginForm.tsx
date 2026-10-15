import { useState, type FormEvent } from 'react'
import { AuthShell, fieldErrors, loginSchema, resultMessage } from '@/entities/session'
import { ROUTES } from '@/shared/config'
import { useFormValues } from '@/shared/lib/useFormValues'
import { Stack } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Form } from '@/shared/ui/Form'
import { FormAlert } from '@/shared/ui/FormAlert'
import { SmartLink } from '@/shared/ui/SmartLink'
import { Text } from '@/shared/ui/Text'
import { TextField } from '@/shared/ui/TextField'
import { useLogin } from '../model/useLogin'

/** Форма входа. `redirectTo` — адрес возврата из search-параметра `redirect` (проверяется на безопасность при переходе). */
export function LoginForm({ redirectTo }: { redirectTo?: string | undefined }) {
  const mutation = useLogin(redirectTo)
  const { values, bind } = useFormValues({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }
    setErrors({})
    mutation.mutate(parsed.data)
  }

  return (
    <AuthShell
      title="Вход"
      description="Войдите, чтобы видеть свои заказы, избранное и корзину"
      footer={
        <>
          <Text className="cursor-default font-normal text-secondary text-sm text-center">
            Нет аккаунта?{' '}
            <SmartLink href={ROUTES.SIGNUP} className="text-link font-medium">
              Зарегистрироваться
            </SmartLink>
          </Text>
          <SmartLink href={ROUTES.PASSWORD_RESET} className="text-link hover:text-link/90 mx-auto font-semibold">
            Забыли пароль?
          </SmartLink>
        </>
      }
    >
      {/* noValidate: нативные подсказки браузера не переводятся и перебивают сообщения zod */}
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
          <TextField
            label="Пароль"
            name="password"
            type="password"
            autoComplete="current-password"
            error={errors.password}
            {...bind('password')}
          />
          <FormAlert message={resultMessage(mutation.data, mutation.error)} />
          <Button type="submit" size="full" className="h-12" loading={mutation.isPending}>
            Войти
          </Button>
        </Stack>
      </Form>
    </AuthShell>
  )
}
