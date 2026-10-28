import type { ReactNode } from 'react'
import { Stack } from '@/shared/ui/Box'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { Text } from '@/shared/ui/Text'

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
    <Container className="flex max-md:max-w-md flex-col gap-6 max-sm:px-3">
      <Stack gap={2}>
        <Heading level={2} size="lg">
          {title}
        </Heading>
        {description ? <Text className="cursor-default font-normal text-secondary text-sm">{description}</Text> : null}
      </Stack>

      {children}

      {footer ? <Stack gap={3}>{footer}</Stack> : null}
    </Container>
  )
}
