import { useState, type FormEvent } from 'react'
import { AuthShell, fieldErrors, resultMessage, signupCompleteSchema } from '@/entities/session'
import { useFormValues } from '@/shared/lib/useFormValues'
import { Button } from '@/shared/ui/Button'
import { Field } from '@/shared/ui/Field'
import { FormAlert } from '@/shared/ui/FormAlert'
import { VStack } from '@/shared/ui/VStack'
import { useSignupComplete } from '../model/useSignupComplete'

export function SignupProfileStep({ ticket, redirectTo }: { ticket: string; redirectTo?: string | undefined }) {
  const mutation = useSignupComplete(redirectTo)
  const { values, bind } = useFormValues({ firstName: '', lastName: '', password: '', passwordConfirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

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
      <form onSubmit={handleSubmit} noValidate>
        <VStack gap={4}>
          <Field
            label="Имя"
            name="firstName"
            autoComplete="given-name"
            error={errors.firstName}
            {...bind('firstName')}
          />
          <Field
            label="Фамилия"
            name="lastName"
            autoComplete="family-name"
            error={errors.lastName}
            {...bind('lastName')}
          />
          <Field
            label="Пароль"
            name="password"
            type="password"
            autoComplete="new-password"
            hint="Не короче 8 символов, не только цифры"
            error={errors.password}
            {...bind('password')}
          />
          <Field
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
        </VStack>
      </form>
    </AuthShell>
  )
}
