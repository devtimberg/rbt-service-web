import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
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
import { Button } from '@/shared/ui/Button'
import { OtpField } from '@/shared/ui/Field'
import { FormAlert } from '@/shared/ui/FormAlert'
import { VStack } from '@/shared/ui/VStack'

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
  const { values, bind } = useFormValues({ code: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

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
          <FormAlert message={resultMessage(verify.data, verify.error)} />
          <Button type="submit" size="full" className="h-12" loading={verify.isPending}>
            Подтвердить
          </Button>
        </VStack>
      </form>
    </AuthShell>
  )
}
