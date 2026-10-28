'use client'

import { useRouter } from 'next/navigation'
import { ROUTES } from '@/shared/config'
import { Box, Breadcrumb, Button, Container, Heading, CheckIcon, SheetFooterSlot, Text } from '@/shared/ui'
import styles from './step-success.module.css'

export function StepSuccess() {
  const router = useRouter()

  const handleClose = () => {
    // Флаг history.state.sheet в старом коде нигде не выставлялся, поэтому всегда переходим на главную
    router.push(ROUTES.HOME)
  }

  return (
    <Container className={styles.root}>
      <Breadcrumb items={[{ label: 'Сервис', href: '/' }, { label: 'Вызвать мастера' }]} />

      <Heading level={1} size="xl" className={styles.title}>
        Вызвать мастера
      </Heading>

      <Box className={styles.status}>
        <Box className={styles.badge}>
          <CheckIcon className={styles.check} />
        </Box>
        <Heading level={2} size="lg">
          Заявка подтверждена
        </Heading>
      </Box>

      <Heading level={3} size="md">
        # 321-587-15
      </Heading>

      <Text className={styles.text}>
        Спасибо что обратились в наш сервис, в ближайшее время с вами свяжется наш менеджер и уточнит детали
      </Text>

      <SheetFooterSlot contentClassName={styles.footerContent}>
        <Button className={styles.button} onClick={handleClose}>
          Хорошо
        </Button>
      </SheetFooterSlot>
    </Container>
  )
}
