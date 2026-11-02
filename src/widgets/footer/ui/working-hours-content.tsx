import { COMPANY_ADDRESS } from '@/shared/config'
import {
  Box,
  CloseIcon,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Divider,
  Heading,
  IconButton,
  Image,
  SheetTitle,
  Text,
} from '@/shared/ui'
import styles from './working-hours-content.module.css'

const SCHEDULES = [
  {
    title: 'Сервис',
    rows: [
      { days: ['Пн', 'Сб'], label: 'Понедельник — суббота', hours: '8:30–17:30', note: 'Без перерыва' },
      { days: ['Вс'], label: 'Воскресенье', hours: 'Выходной' },
    ],
  },
  {
    title: 'Магазин запчастей',
    rows: [
      { days: ['Пн', 'Пт'], label: 'Понедельник — пятница', hours: '8:30–17:30', note: 'Перерыв 12:30–13:00' },
      { days: ['Сб', 'Вс'], label: 'Суббота — воскресенье', hours: 'Выходной' },
    ],
  },
] as const

type WorkingHoursContentProps = {
  mobile: boolean
  titleId: string
  onClose: () => void
}

export function WorkingHoursContent({ mobile, titleId, onClose }: WorkingHoursContentProps) {
  const title = 'Адрес и время работы'

  return (
    <Box className={styles.root}>
      <Box className={styles.intro}>
        <Box className={styles.header}>
          {mobile ? (
            <SheetTitle className={styles.title}>{title}</SheetTitle>
          ) : (
            <Heading level={2} id={titleId} className={styles.title}>
              {title}
            </Heading>
          )}
          <IconButton
            icon={CloseIcon}
            aria-label="Закрыть адрес и время работы"
            onClick={onClose}
            className={styles.close}
          />
        </Box>
        <Text variant="body-lg" weight="medium" className={styles.address}>
          {COMPANY_ADDRESS}
        </Text>
      </Box>
      <Image
        src="/contacts/map-mobile.png"
        sources={[{ media: '(min-width: 768px)', srcSet: '/contacts/map-desktop.png' }]}
        alt="Схема расположения сервиса: Челябинск, улица Производственная, 8Б"
        width={450}
        height={220}
        pictureClassName={styles.map}
        className={styles.mapImage}
      />
      <Divider className={styles.divider} />
      <Box className={styles.schedules}>
        {SCHEDULES.map((schedule) => (
          <Box as="section" key={schedule.title} className={styles.schedule}>
            <Heading level={3} className={styles.scheduleTitle}>
              {schedule.title}
            </Heading>
            <DescriptionList className={styles.rows}>
              {schedule.rows.map((row) => (
                <Box key={row.label} className={styles.entry}>
                  <DescriptionTerm className={styles.days} aria-label={row.label}>
                    <Text as="span" aria-hidden="true">
                      {row.days[0]}
                      {row.days.length > 1 ? (
                        <>
                          <Text as="span" className={styles.separator}>
                            {' • '}
                          </Text>
                          {row.days[1]}
                        </>
                      ) : null}
                    </Text>
                  </DescriptionTerm>
                  <DescriptionDetails className={styles.details}>
                    <Text as="span" weight="medium" className={styles.hours}>
                      {row.hours}
                    </Text>
                    {'note' in row ? (
                      <Text as="span" variant="body-sm" className={styles.note}>
                        {row.note}
                      </Text>
                    ) : null}
                  </DescriptionDetails>
                </Box>
              ))}
            </DescriptionList>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
