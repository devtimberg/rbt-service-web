import { useState } from 'react'
import { SignupCodeStep } from './SignupCodeStep'
import { SignupEmailStep } from './SignupEmailStep'
import { SignupProfileStep } from './SignupProfileStep'

type Step = 'email' | 'code' | 'profile'

/** Регистрация по шагам: email → код из письма → имя и пароль. */
export function SignupFlow({ redirectTo }: { redirectTo?: string | undefined }) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const [ticket, setTicket] = useState('')

  if (step === 'code') {
    return (
      <SignupCodeStep
        email={email}
        initialResendIn={resendIn}
        onBack={() => setStep('email')}
        onVerified={(value) => {
          setTicket(value)
          setStep('profile')
        }}
      />
    )
  }

  if (step === 'profile') {
    return <SignupProfileStep ticket={ticket} redirectTo={redirectTo} />
  }

  return (
    <SignupEmailStep
      onSubmitted={(value, nextResendIn) => {
        setEmail(value)
        setResendIn(nextResendIn)
        setStep('code')
      }}
    />
  )
}
