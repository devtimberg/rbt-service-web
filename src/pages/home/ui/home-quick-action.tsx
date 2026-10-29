'use client'

import { useState } from 'react'
import { isLockedSection, LockedSectionDialog } from '@/features/locked-section'
import { cn } from '@/shared/lib/cn'
import { Box, Button, Container, LockIcon, SmartLink, Text } from '@/shared/ui'
import { HOME_QUICK_ACTIONS, type QuickActionItem } from '../model/quick-action'
import styles from './home-quick-action.module.css'

function ActionContent({ action, locked }: { action: QuickActionItem; locked: boolean }) {
  const Icon = action.icon
  return (
    <>
      <Text as="span" className={styles.iconBox}>
        <Icon className={styles.icon} aria-hidden />
      </Text>
      <Text as="span" className={styles.text}>
        {action.text}
      </Text>
      {locked ? <LockIcon aria-hidden className={styles.lock} /> : null}
    </>
  )
}

export function HomeQuickAction() {
  const [lockedOpen, setLockedOpen] = useState(false)

  return (
    <Container>
      <Box className={styles.wrap}>
        <Box className={styles.grid}>
          {HOME_QUICK_ACTIONS.map((action) => {
            const isAccent = action.colorVariant === 'accent' || action.isAccent
            const locked = isLockedSection(action.href)

            // Закрытый раздел: кнопка вместо ссылки, по нажатию окно «Этот раздел ещё в работе»
            return locked ? (
              <Button
                key={action.key}
                variant="unstyled"
                aria-haspopup="dialog"
                className={cn(styles.action, styles.locked)}
                onClick={() => setLockedOpen(true)}
              >
                <ActionContent action={action} locked />
              </Button>
            ) : (
              <SmartLink key={action.key} href={action.href} className={cn(styles.action, isAccent && styles.accent)}>
                <ActionContent action={action} locked={false} />
              </SmartLink>
            )
          })}
        </Box>
      </Box>
      <LockedSectionDialog open={lockedOpen} onClose={() => setLockedOpen(false)} />
    </Container>
  )
}
