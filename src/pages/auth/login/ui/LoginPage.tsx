import { LoginForm } from '@/features/auth/login'

export function LoginPage({ redirectTo }: { redirectTo?: string | undefined }) {
  return <LoginForm redirectTo={redirectTo} />
}
