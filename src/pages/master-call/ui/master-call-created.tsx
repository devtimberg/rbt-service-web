'use client'

import type { MasterCall } from '@/entities/master-call'
import { ROUTES } from '@/shared/config'
import { Box, Breadcrumb, Button, Image, Heading, LineBreak, SheetFooterSlot, Text } from '@/shared/ui'
import styles from './master-call-created.module.css'

export function MasterCallCreated({ call }: { call: MasterCall }) {
  return (
    <Box className={styles.main}>
      <Breadcrumb items={[{ label: 'Вызвать мастера' }]} />
      <Box className={styles.result} aria-live="polite">
        <Box className={styles.status}>
          <Box className={styles.badge}>
            <Image src="/master-call/success.svg" width={72} height={72} alt="" className={styles.check} />
          </Box>
          <Heading level={1} className={styles.title}>
            Заявка создана
          </Heading>
        </Box>
        <Text className={styles.number}># {call.number}</Text>
        <Text className={styles.text}>
          Спасибо что обратились в наш сервис,
          <LineBreak />в ближайшее время с вами свяжется наш менеджер и уточнит детали
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
