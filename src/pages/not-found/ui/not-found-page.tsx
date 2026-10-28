import { ROUTES } from '@/shared/config'
import { Box } from '@/shared/ui/Box'
import { Heading } from '@/shared/ui/Heading'
import { SmartLink } from '@/shared/ui/SmartLink'
import { Text } from '@/shared/ui/Text'
import styles from './not-found-page.module.css'

/** Страница 404 внутри оболочки корневого лайаута. */
export function NotFoundPage() {
  return (
    <Box className={styles.root}>
      <Heading level={1} className={styles.title}>
        Страница не найдена
      </Heading>
      <Text className={styles.hint}>Проверьте адрес или вернитесь на главную.</Text>
      <SmartLink href={ROUTES.HOME} className={styles.link}>
        На главную
      </SmartLink>
    </Box>
  )
}
