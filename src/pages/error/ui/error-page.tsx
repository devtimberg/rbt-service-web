import { Box, Heading, Text } from '@/shared/ui'
import styles from './error-page.module.css'

/** Страница ошибки маршрута: текст ошибки показываем только в dev. */
export function ErrorPage({ error }: { error: unknown }) {
  return (
    <Box className={styles.root}>
      <Heading level={1} className={styles.title}>
        Что-то пошло не так
      </Heading>
      <Text className={styles.hint}>
        {import.meta.env.DEV && error instanceof Error ? error.message : 'Попробуйте обновить страницу.'}
      </Text>
    </Box>
  )
}
