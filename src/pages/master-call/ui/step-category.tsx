import { useState } from 'react'
import { Box } from '@/shared/ui/Box'
import { Breadcrumb } from '@/shared/ui/Breadcrumb'
import { Button } from '@/shared/ui/Button'
import { Chip } from '@/shared/ui/Chip'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { SheetFooterSlot } from '@/shared/ui/SheetFooterSlot'
import { Text } from '@/shared/ui/Text'
import { APPLIANCE_CATEGORIES } from '../model/categories'
import type { ApplianceCategory, ServiceType } from '../model/types'
import styles from './step-category.module.css'

const SERVICE_TYPE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: 'repair', label: 'Ремонт' },
  { value: 'installation', label: 'Установка' },
]

const QUESTION_BY_SERVICE_TYPE: Record<ServiceType, string> = {
  repair: 'Что нужно отремонтировать?',
  installation: 'Что нужно установить?',
}

type StepCategoryProps = {
  serviceType: ServiceType
  serviceTypeChangeAction: (type: ServiceType) => void
  selectedCategory: ApplianceCategory | null
  selectCategoryAction: (category: ApplianceCategory) => void
  nextAction: () => void
}

export function StepCategory({
  serviceType,
  serviceTypeChangeAction,
  selectedCategory,
  selectCategoryAction,
  nextAction,
}: StepCategoryProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleNext = () => {
    setSubmitted(true)
    if (selectedCategory) {
      nextAction()
    }
  }

  return (
    <Container className={styles.root}>
      <Breadcrumb items={[{ label: 'Сервис', href: '/' }, { label: 'Вызвать мастера' }]} />

      <Heading level={1} size="xl" className={styles.title}>
        Вызвать мастера
      </Heading>

      <Box className={styles.section}>
        <Heading level={2} size="lg">
          Вид услуги
        </Heading>
        <Box className={styles.serviceTypes}>
          {SERVICE_TYPE_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              size="lg"
              selected={serviceType === option.value}
              onClick={() => serviceTypeChangeAction(option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </Box>
      </Box>

      <Box className={styles.section}>
        <Heading level={2} size="lg">
          {QUESTION_BY_SERVICE_TYPE[serviceType]}
        </Heading>
        <Box className={styles.categories}>
          {APPLIANCE_CATEGORIES.map((category) => (
            <Chip
              key={category.key}
              size="lg"
              selected={selectedCategory?.key === category.key}
              onClick={() => selectCategoryAction(category)}
            >
              {category.label}
            </Chip>
          ))}
        </Box>
      </Box>

      <SheetFooterSlot contentClassName={styles.footerContent}>
        {submitted && !selectedCategory && <Text className={styles.error}>Выберите категорию поломки</Text>}
        <Button onClick={handleNext}>Продолжить</Button>
      </SheetFooterSlot>
    </Container>
  )
}
