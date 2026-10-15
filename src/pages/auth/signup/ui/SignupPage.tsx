import { SignupFlow } from '@/features/auth/signup'

export function SignupPage({ redirectTo }: { redirectTo?: string | undefined }) {
  return <SignupFlow redirectTo={redirectTo} />
}
