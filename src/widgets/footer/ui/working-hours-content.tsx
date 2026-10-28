import { Stack, Text } from '@/shared/ui'
import styles from './working-hours-content.module.css'

const SCHEDULES = [
  {
    title: 'СЕРВИС',
    lines: ['ПН-СБ: с 8-30 до 17-30 без перерыва', 'ВС: выходной'],
  },
  {
    title: 'МАГАЗИН ЗАПЧАСТЕЙ',
    lines: ['ПН-ПТ: с 8-30 до 17-30; обед с 12.30 до 13.00', 'СБ-ВС: выходной'],
  },
] as const

export function WorkingHoursContent() {
  return (
    <Stack gap={10}>
      {SCHEDULES.map((schedule) => (
        <Stack key={schedule.title} gap={2}>
          <Text className={styles.title}>{schedule.title}</Text>
          {schedule.lines.map((line) => (
            <Text key={line} className={styles.line}>
              {line}
            </Text>
          ))}
        </Stack>
      ))}
    </Stack>
  )
}
