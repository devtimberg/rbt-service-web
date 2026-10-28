import { useState } from 'react'
import { cn } from '@/shared/lib/cn'
import { Box } from '@/shared/ui/Box'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { SheetFooterSlot } from '@/shared/ui/SheetFooterSlot'
import { Text } from '@/shared/ui/Text'
import type { TimeSlot, TimeSlotGroup } from '../model/types'
import styles from './step-time-slot.module.css'

type StepTimeSlotProps = {
  groups: TimeSlotGroup[]
  selected: { group: TimeSlotGroup; slot: TimeSlot } | null
  selectAction: (group: TimeSlotGroup, slot: TimeSlot) => void
  nextAction: () => void
  backAction: () => void
}

export function StepTimeSlot({ groups, selected, selectAction, nextAction, backAction }: StepTimeSlotProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleNext = () => {
    setSubmitted(true)
    if (selected) {
      nextAction()
    }
  }

  return (
    <Container className={styles.root}>
      <Breadcrumb items={[{ label: 'Сервис', href: '/' }, { label: 'Вызвать мастера' }]} />

      <Heading level={1} size="xl" className={styles.title}>
        Вызвать мастера
      </Heading>

      <Heading level={2} size="lg">
        Выберите удобное время для визита мастера
      </Heading>

      <Box className={styles.groups}>
        {groups.map((group) => (
          <Box key={group.key} className={styles.group}>
            <Heading level={4} size="sm">
              {group.label}
            </Heading>
            <Box className={cn(styles.slots, 'scrollbar-none')}>
              {group.slots.map((slot) => {
                const isSelected = selected?.group.key === group.key && selected?.slot.key === slot.key

                return (
                  <Chip
                    key={slot.key}
                    size="lg"
                    selected={isSelected}
                    disabled={!slot.available}
                    onClick={() => selectAction(group, slot)}
                    className={cn(styles.slot, !slot.available && styles.slotUnavailable)}
                  >
                    {slot.start} — {slot.end}
                  </Chip>
                )
              })}
            </Box>
          </Box>
        ))}
      </Box>

      <SheetFooterSlot contentClassName={styles.footerContent}>
        <Button variant="secondary" onClick={backAction}>
          Назад
        </Button>
        <Box className={styles.actions}>
          {submitted && !selected && <Text className={styles.error}>Выберите время</Text>}
          <Button onClick={handleNext}>Продолжить</Button>
        </Box>
      </SheetFooterSlot>
    </Container>
  )
}
