import { useQuery } from '@tanstack/react-query'
import { sessionQuery } from '@/entities/session'
import { LogoutButton } from '@/features/auth/logout'
import { LogoutAllButton } from '@/features/auth/logout-all'
import { PasswordChangeForm } from '@/features/auth/password-change'
import { Box } from '@/shared/ui/Box'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { Skeleton } from '@/shared/ui/Skeleton'
import { Text } from '@/shared/ui/Text'
import { VStack } from '@/shared/ui/VStack'

export function ProfilePage() {
  const { data: user, isPending } = useQuery(sessionQuery())

  if (isPending) {
    return (
      <Container className="flex max-w-md flex-col gap-4 px-3 sm:px-0">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full rounded-2xl" />
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
    <Container className="flex max-w-md flex-col gap-6 px-3 sm:px-0">
      <Heading size="lg">Профиль</Heading>

      <Box className="bg-primary-100/10 rounded-2xl px-4 py-4">
        <VStack gap={1}>
          <Text className="font-medium">{fullName || 'Без имени'}</Text>
          <Text variant="secondary" size="sm">
            {user.email}
          </Text>
          {!user.isEmailVerified ? (
            <Text variant="error" size="xs">
              Email не подтверждён
            </Text>
          ) : null}
        </VStack>
      </Box>

      <VStack gap={3}>
        <Heading size="md">Смена пароля</Heading>
        <PasswordChangeForm />
      </VStack>

      <VStack gap={3}>
        <LogoutButton />
        <LogoutAllButton />
      </VStack>
    </Container>
  )
}
