import { useQuery } from '@tanstack/react-query'
import { sessionQuery } from '@/entities/session'
import { LogoutButton } from '@/features/auth/logout'
import { LogoutAllButton } from '@/features/auth/logout-all'
import { PasswordChangeForm } from '@/features/auth/password-change'
import { cn } from '@/shared/lib/cn'
import { Box, Stack } from '@/shared/ui/Box'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { Skeleton } from '@/shared/ui/Skeleton'
import { Text } from '@/shared/ui/Text'
import styles from './ProfilePage.module.css'

export function ProfilePage() {
  const { data: user, isPending } = useQuery(sessionQuery())

  if (isPending) {
    return (
      <Container className={cn(styles.root, styles.rootLoading)}>
        <Skeleton className={styles.titleSkeleton} />
        <Skeleton className={styles.cardSkeleton} />
      </Container>
    )
  }

  if (!user) {
    // До этого экрана без сессии не пускает guard роута `_authed`: состояние возможно
    // только в момент выхода, пока идёт переход.
    return null
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ')

  return (
    <Container className={styles.root}>
      <Heading level={2} size="lg">
        Профиль
      </Heading>

      <Box className={styles.card}>
        <Stack gap={1}>
          <Text className={styles.name}>{fullName || 'Без имени'}</Text>
          <Text className={styles.email}>{user.email}</Text>
          {!user.isEmailVerified ? <Text className={styles.unverified}>Email не подтверждён</Text> : null}
        </Stack>
      </Box>

      <Stack gap={3}>
        <Heading level={3} size="md">
          Смена пароля
        </Heading>
        <PasswordChangeForm />
      </Stack>

      <Stack gap={3}>
        <LogoutButton />
        <LogoutAllButton />
      </Stack>
    </Container>
  )
}
