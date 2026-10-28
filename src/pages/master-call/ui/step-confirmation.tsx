import { useEffect, useState } from 'react'
import { Box } from '@/shared/ui/Box'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { SheetFooterSlot } from '@/shared/ui/SheetFooterSlot'
import { SmartLink } from '@/shared/ui/SmartLink'
import { LineBreak, Text } from '@/shared/ui/Text'
import type { ApplianceCategory, ServiceType, TimeSlot, TimeSlotGroup } from '../model/types'
import styles from './step-confirmation.module.css'

const TIMER_SECONDS = 5 * 60
const PHONE_NUMBER = '8-800-333-555-6'
const PHONE_HREF = 'tel:88003335556'

const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  repair: 'Ремонт',
  installation: 'Установка',
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

type StepConfirmationProps = {
  serviceType: ServiceType
  category: ApplianceCategory
  selectedGroup: TimeSlotGroup
  selectedSlot: TimeSlot
  cancelAction: () => void
}

export function StepConfirmation({
  serviceType,
  category,
  selectedGroup,
  selectedSlot,
  cancelAction,
}: StepConfirmationProps) {
  const [remaining, setRemaining] = useState(TIMER_SECONDS)

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => setRemaining((r) => r - 1), 1000)
    return () => clearInterval(id)
  }, [remaining])

  const expired = remaining <= 0

  return (
    <Container className={styles.root}>
      <Breadcrumb items={[{ label: 'Сервис', href: '/' }, { label: 'Вызвать мастера' }]} />

      <Heading level={1} size="xl" className={styles.title}>
        Вызвать мастера
      </Heading>

      <Box className={styles.summary}>
        <Text as="span">
          {SERVICE_TYPE_LABEL[serviceType]} {category.label.toLowerCase()}
        </Text>
        <Text as="span">{selectedGroup.label},</Text>
        <Text as="span">
          {selectedSlot.start} — {selectedSlot.end}
        </Text>
      </Box>

      <Box>
        {expired ? (
          <Heading level={2} size="lg">
            Время истекло
          </Heading>
        ) : (
          <Text className={styles.prompt}>
            <Text as="span" className={styles.promptStrong}>
              Подтвердите заявку
            </Text>
            <LineBreak />
            <Text as="span" className={styles.promptTimer}>
              в течение {formatTimer(remaining)}
            </Text>
          </Text>
        )}
      </Box>

      <Box className={styles.call}>
        <Text className={styles.callTitle}>Позвоните на бесплатный номер</Text>
        <SmartLink href={PHONE_HREF} className={styles.phone}>
          {PHONE_NUMBER}
        </SmartLink>
        {!expired && (
          <Box className={styles.waiting}>
            <Text as="span" className={styles.spinner} />
            <Text className={styles.waitingText}>Ожидаем вашего звонка</Text>
          </Box>
        )}
      </Box>

      <Button variant="secondary" className={styles.cancel} onClick={cancelAction}>
        Отменить заявку
      </Button>

      <Text className={styles.agreement}>
        Позвонив по номеру, вы даете согласие на обработку персональных данных, в соответствии с Федеральным законом от
        27.07.2006 года №152-ФЗ «О персональных данных» для целей и на условиях, представленных в политике
        конфиденциальности
      </Text>

      <SheetFooterSlot className={styles.footer}>
        <Button className={styles.callButton} onClick={() => window.location.assign(PHONE_HREF)}>
          Позвонить
        </Button>
      </SheetFooterSlot>
    </Container>
  )
}
