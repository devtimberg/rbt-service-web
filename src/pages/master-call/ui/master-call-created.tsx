'use client'

import { useRouter } from 'next/navigation'
import type { MasterCall } from '@/entities/master-call'
import { ROUTES } from '@/shared/config'
import { Box, Breadcrumb, Button, CheckIcon, Container, Heading, SheetFooterSlot, Text } from '@/shared/ui'
import type { MasterCallFormValues } from '../model/schema'
import { formatReceiptDate } from '../model/use-receipt-clock'
import { CallReceipt } from './call-receipt'
import styles from './master-call-created.module.css'

type MasterCallCreatedProps = { call: MasterCall; values: MasterCallFormValues }

export function MasterCallCreated({ call, values }: MasterCallCreatedProps) {
  const router = useRouter()

  return (
    <Container className={styles.root}>
      <Box className={styles.main}>
        <Breadcrumb items={[{ label: 'Вызвать мастера' }]} />
        <Heading level={1} size="xl" className={styles.title}>
          Вызвать мастера
        </Heading>

        <Box className={styles.status}>
          <Box className={styles.badge}>
            <CheckIcon className={styles.check} />
          </Box>
          <Heading level={2} size="lg">
            Заявка создана
          </Heading>
        </Box>

        <Heading level={3} size="md">
          # {call.number}
        </Heading>

        <Text className={styles.text}>
          Спасибо что обратились в наш сервис, в ближайшее время с вами свяжется наш менеджер и уточнит детали
        </Text>
      </Box>

      <CallReceipt
        torn="both"
        category={values.category}
        phone={values.phone}
        comment={values.comment}
        number={call.number}
        date={formatReceiptDate(call.createdAt)}
        className={styles.receipt}
      />

      <SheetFooterSlot contentClassName={styles.footerContent}>
        <Button className={styles.button} onClick={() => router.push(ROUTES.HOME)}>
          Хорошо
        </Button>
      </SheetFooterSlot>
    </Container>
  )
}
