import { cn } from '@/shared/lib/cn'
import { Box } from '../box'
import { InformationIcon } from '../icons'
import { Text } from '../text'
import styles from './form-alert.module.css'

type FormAlertProps = {
  message?: string | undefined
  title?: string | undefined
  variant?: 'error' | 'info'
}

/** Сообщение формы: ошибка или спокойное уведомление. Без сообщения ничего не рисует. */
export function FormAlert({ message, title, variant = 'error' }: FormAlertProps) {
  if (!message) return null
  return (
    <Box role={variant === 'info' ? 'status' : 'alert'} className={cn(styles.root, variant === 'info' && styles.info)}>
      {variant === 'info' && <InformationIcon className={styles.icon} aria-hidden="true" />}
      <Box className={styles.content}>
        {title && (
          <Text as="strong" className={styles.title}>
            {title}
          </Text>
        )}
        <Text>{message}</Text>
      </Box>
    </Box>
  )
}
