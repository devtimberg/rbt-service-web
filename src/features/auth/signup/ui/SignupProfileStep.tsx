import type { FormEvent } from 'react'
import { AuthShell, fieldErrors, resultMessage, signupCompleteSchema } from '@/entities/session'
import { useFormValues } from '@/shared/lib/useFormValues'
import { Stack } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Form } from '@/shared/ui/Form'
import { FormAlert } from '@/shared/ui/FormAlert'
import { TextField } from '@/shared/ui/TextField'
import { useSignupComplete } from '../model/useSignupComplete'

export function SignupProfileStep({ ticket, redirectTo }: { ticket: string; redirectTo?: string | undefined }) {
  const mutation = useSignupComplete(redirectTo)
  const { values, bind, errors, setErrors } = useFormValues({
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirm: '',
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = signupCompleteSchema.safeParse({ ticket, ...values })
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }
    setErrors({})
    mutation.mutate(parsed.data)
  }

  return (
    <AuthShell title="Немного о вас" description="Осталось указать имя и придумать пароль">
      <Form onSubmit={handleSubmit} noValidate>
        <Stack gap={4}>
          <TextField
            label="Имя"
            name="firstName"
            autoComplete="given-name"
            error={errors.firstName}
            {...bind('firstName')}
          />
          <TextField
            label="Фамилия"
            name="lastName"
            autoComplete="family-name"
            error={errors.lastName}
            {...bind('lastName')}
          />
          <TextField
            label="Пароль"
            name="password"
            type="password"
            autoComplete="new-password"
            hint="Не короче 8 символов, не только цифры"
            error={errors.password}
            {...bind('password')}
          />
          <TextField
            label="Повторите пароль"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            error={errors.passwordConfirm}
            {...bind('passwordConfirm')}
          />
          <FormAlert message={resultMessage(mutation.data, mutation.error)} />
          <Button type="submit" size="full" className="h-12" loading={mutation.isPending}>
            Создать аккаунт
          </Button>
        </Stack>
      </Form>
    </AuthShell>
  )
}
