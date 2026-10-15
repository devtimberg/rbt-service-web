import type { ReactNode } from 'react'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { Text } from '@/shared/ui/Text'
import { VStack } from '@/shared/ui/VStack'

/** Общая обёртка экранов авторизации: заголовок, подпись, тело формы. */
export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <Container className="flex max-w-md flex-col gap-6 px-3 sm:px-0">
      <VStack gap={2}>
        <Heading size="lg">{title}</Heading>
        {description ? (
          <Text variant="secondary" size="sm">
            {description}
          </Text>
        ) : null}
      </VStack>

      {children}

      {footer ? <VStack gap={3}>{footer}</VStack> : null}
    </Container>
  )
}
