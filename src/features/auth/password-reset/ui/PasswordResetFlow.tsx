import { useState } from 'react'
import { AuthShell } from '@/entities/session'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui/Button'
import { PasswordResetConfirmStep } from './PasswordResetConfirmStep'
import { PasswordResetRequestStep } from './PasswordResetRequestStep'

type Step = 'request' | 'confirm' | 'done'

/** Восстановление пароля по шагам: email → код и новый пароль → готово. */
export function PasswordResetFlow() {
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [resendIn, setResendIn] = useState(0)

  if (step === 'confirm') {
    return (
      <PasswordResetConfirmStep
        email={email}
        initialResendIn={resendIn}
        onBack={() => setStep('request')}
        onDone={() => setStep('done')}
      />
    )
  }

  if (step === 'done') {
    return (
      <AuthShell title="Пароль обновлён" description="Все прежние сессии завершены — войдите с новым паролем.">
        <Button href={ROUTES.LOGIN}>Перейти ко входу</Button>
      </AuthShell>
    )
  }

  return (
    <PasswordResetRequestStep
      onSubmitted={(value, nextResendIn) => {
        setEmail(value)
        setResendIn(nextResendIn)
        setStep('confirm')
      }}
    />
  )
}
