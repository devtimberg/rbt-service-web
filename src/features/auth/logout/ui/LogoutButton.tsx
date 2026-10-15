import { Button } from '@/shared/ui/Button'
import { useLogout } from '../model/useLogout'

export function LogoutButton() {
  const { mutate, isPending } = useLogout()
  return (
    <Button variant="secondary" size="full" className="h-12" loading={isPending} onClick={() => mutate()}>
      Выйти
    </Button>
  )
}
