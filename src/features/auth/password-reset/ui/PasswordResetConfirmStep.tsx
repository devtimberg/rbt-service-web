import { useMutation } from '@tanstack/react-query'
import type { FormEvent } from 'react'
import {
  AuthShell,
  fieldErrors,
  OTP_LENGTH,
  passwordResetConfirm,
  passwordResetConfirmSchema,
  passwordResetRequest,
  resultMessage,
} from '@/entities/session'
import { useFormValues } from '@/shared/lib/useFormValues'
import { useResendCountdown } from '@/shared/lib/useResendCountdown'
import { Button } from '@/shared/ui/Button'
import { Field, OtpField } from '@/shared/ui/Field'
import { FormAlert } from '@/shared/ui/FormAlert'
import { VStack } from '@/shared/ui/VStack'

export function PasswordResetConfirmStep({
  email,
  initialResendIn,
  onBack,
  onDone,
}: {
  email: string
  initialResendIn: number
  onBack: () => void
  onDone: () => void
}) {
  const confirm = useMutation({
    mutationFn: (input: { email: string; code: string; newPassword: string; passwordConfirm: string }) =>
      passwordResetConfirm({ data: input }),
  })
  const resend = useMutation({ mutationFn: () => passwordResetRequest({ data: { email } }) })
  const { canResend, label } = useResendCountdown(resend.data?.resendIn ?? initialResendIn)
  const { values, bind, errors, setErrors } = useFormValues({ code: '', newPassword: '', passwordConfirm: '' })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = passwordResetConfirmSchema.safeParse({ email, ...values })
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }
    setErrors({})
    confirm.mutate(parsed.data, {
      onSuccess: (result) => {
        if (result.ok) onDone()
      },
    })
  }

  return (
    <AuthShell
      title="Новый пароль"
      // Бэкенд не раскрывает, зарегистрирован ли email, — формулировка нейтральная.
      description={`Если аккаунт с ${email} существует, на него отправлен код из ${OTP_LENGTH} цифр. Он действует 5 минут.`}
      footer={
        <>
          <VStack gap={2}>
            <Button
              variant="link"
              className="mx-auto"
              disabled={!canResend || resend.isPending}
              onClick={() => resend.mutate()}
            >
              {canResend ? 'Отправить код заново' : `Повторно через ${label}`}
            </Button>
            <FormAlert message={resultMessage(resend.data, resend.error)} />
          </VStack>
          <Button variant="link" className="mx-auto" onClick={onBack}>
            Изменить email
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <VStack gap={4}>
          {/* Фокус в поле кода после смены шага: пользователь сразу вводит код из письма */}
          {/* oxlint-disable-next-line jsx-a11y/no-autofocus */}
          <OtpField length={OTP_LENGTH} error={errors.code} autoFocus {...bind('code')} />
          <Field
            label="Новый пароль"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            hint="Не короче 8 символов, не только цифры"
            error={errors.newPassword}
            {...bind('newPassword')}
          />
          <Field
            label="Повторите пароль"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            error={errors.passwordConfirm}
            {...bind('passwordConfirm')}
          />
          <FormAlert message={resultMessage(confirm.data, confirm.error)} />
          <Button type="submit" size="full" className="h-12" loading={confirm.isPending}>
            Сменить пароль
          </Button>
        </VStack>
      </form>
    </AuthShell>
  )
}
