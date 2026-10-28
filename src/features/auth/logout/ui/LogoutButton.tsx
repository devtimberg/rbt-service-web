import { Button } from '@/shared/ui/Button'
import { useLogout } from '../model/useLogout'
import styles from './LogoutButton.module.css'

export function LogoutButton() {
  const { mutate, isPending } = useLogout()
  return (
    <Button variant="secondary" size="full" className={styles.submit} loading={isPending} onClick={() => mutate()}>
      Выйти
    </Button>
  )
}
