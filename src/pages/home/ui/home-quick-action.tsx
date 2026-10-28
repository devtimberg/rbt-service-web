import { cn } from '@/shared/lib/cn'
import { Box, Container, SmartLink, Text } from '@/shared/ui'
import { HOME_QUICK_ACTIONS } from '../model/quick-action'
import styles from './home-quick-action.module.css'

export function HomeQuickAction() {
  return (
    <Container>
      <Box className={styles.wrap}>
        <Box className={styles.grid}>
          {HOME_QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            const isAccent = action.colorVariant === 'accent' || action.isAccent

            return (
              <SmartLink key={action.key} href={action.href} className={cn(styles.action, isAccent && styles.accent)}>
                <Text as="span" className={styles.iconBox}>
                  <Icon className={styles.icon} aria-hidden />
                </Text>
                <Text as="span" className={styles.text}>
                  {action.text}
                </Text>
              </SmartLink>
            )
          })}
        </Box>
      </Box>
    </Container>
  )
}
