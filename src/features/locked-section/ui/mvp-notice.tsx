import { cn } from '@/shared/lib/cn'
import { Box, InformationIcon, Text } from '@/shared/ui'
import styles from './mvp-notice.module.css'

/** Плашка под поиском на главной (Figma «Плашка MVP»): какие разделы уже работают. */
export function MvpNotice({ className }: { className?: string }) {
  return (
    <Box className={cn(styles.root, className)}>
      <InformationIcon aria-hidden className={styles.icon} />
      <Text className={styles.text}>
        Запускаем сервис по частям: уже можно вызвать мастера и заказать запчасть. Остальное — совсем скоро!
      </Text>
    </Box>
  )
}
