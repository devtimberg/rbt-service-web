'use client'

import type { PartsRequest } from '@/entities/parts-request'
import { ROUTES } from '@/shared/config'
import { Box, Breadcrumb, Button, Image, Heading, SheetFooterSlot, Text } from '@/shared/ui'
import styles from './parts-request-created.module.css'

export function PartsRequestCreated({ call }: { call: PartsRequest }) {
  return (
    <Box className={styles.main}>
      <Breadcrumb items={[{ label: 'Заказать запчасть' }]} />
      <Box className={styles.result} aria-live="polite">
        <Box className={styles.status}>
          <Box className={styles.badge}>
            <Image src="/images/receipt-printer/success.svg" width={72} height={72} alt="" className={styles.check} />
          </Box>
          <Heading level={1} className={styles.title}>
            Заказ создан
          </Heading>
        </Box>
        <Text className={styles.number}># {call.number}</Text>
        <Text className={styles.text}>
          Спасибо за заказ! Менеджер свяжется с вами, уточнит запчасть, стоимость и срок поставки
        </Text>
      </Box>
      <Button href={ROUTES.HOME} className={styles.desktopButton}>
        Хорошо
      </Button>
      <SheetFooterSlot className={styles.mobileFooter}>
        <Button href={ROUTES.HOME} className={styles.button}>
          Хорошо
        </Button>
      </SheetFooterSlot>
    </Box>
  )
}
