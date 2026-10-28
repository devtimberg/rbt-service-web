import { Text } from './Text'
import styles from './FormAlert.module.css'

/** Ошибка формы целиком (от бэкенда или сети). Без сообщения ничего не рисует. */
export function FormAlert({ message }: { message?: string | undefined }) {
  if (!message) return null
  return (
    <Text role="alert" className={styles.root}>
      {message}
    </Text>
  )
}
