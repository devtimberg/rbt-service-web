import { useMutation } from '@tanstack/react-query'
import type { FormEvent } from 'react'
import {
  AuthShell,
  fieldErrors,
  OTP_LENGTH,
  resultMessage,
  signupResendOtp,
  signupVerify,
  signupVerifySchema,
} from '@/entities/session'
import { useFormValues } from '@/shared/lib/useFormValues'
import { useResendCountdown } from '@/shared/lib/useResendCountdown'
import { Stack } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Form } from '@/shared/ui/Form'
import { FormAlert } from '@/shared/ui/FormAlert'
import { OtpField } from '@/shared/ui/TextField'
import styles from './SignupCodeStep.module.css'

export function SignupCodeStep({
  email,
  initialResendIn,
  onBack,
  onVerified,
}: {
  email: string
  initialResendIn: number
  onBack: () => void
  onVerified: (ticket: string) => void
}) {
  const verify = useMutation({
    mutationFn: (input: { email: string; code: string }) => signupVerify({ data: input }),
  })
  const resend = useMutation({ mutationFn: () => signupResendOtp({ data: { email } }) })
  const { canResend, label } = useResendCountdown(resend.data?.resendIn ?? initialResendIn)
  const { values, bind, errors, setErrors } = useFormValues({ code: '' })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = signupVerifySchema.safeParse({ email, code: values.code })
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }
    setErrors({})
    verify.mutate(parsed.data, {
      onSuccess: (result) => {
        if (result.ok) onVerified(result.ticket)
      },
    })
  }

  return (
    <AuthShell
      title="Подтверждение почты"
      description={`Код из ${OTP_LENGTH} цифр отправлен на ${email}. Он действует 5 минут.`}
      footer={
        <>
          <Stack gap={2}>
            <Button
              variant="link"
              className={styles.center}
              disabled={!canResend || resend.isPending}
              onClick={() => resend.mutate()}
            >
              {canResend ? 'Отправить код заново' : `Повторно через ${label}`}
            </Button>
            <FormAlert message={resultMessage(resend.data, resend.error)} />
          </Stack>
          <Button variant="link" className={styles.center} onClick={onBack}>
            Изменить email
          </Button>
        </>
      }
    >
      <Form onSubmit={handleSubmit} noValidate>
        <Stack gap={4}>
          {/* Фокус в поле кода после смены шага: пользователь сразу вводит код из письма */}
          {/* oxlint-disable-next-line jsx-a11y/no-autofocus */}
          <OtpField length={OTP_LENGTH} error={errors.code} autoFocus {...bind('code')} />
          <FormAlert message={resultMessage(verify.data, verify.error)} />
          <Button type="submit" size="full" className={styles.submit} loading={verify.isPending}>
            Подтвердить
          </Button>
        </Stack>
      </Form>
    </AuthShell>
  )
}
