import { useState } from 'react'
import { getTimeSlotGroups } from '../model/time-slots'
import type { ApplianceCategory, MasterCallStep, ServiceType, TimeSlot, TimeSlotGroup } from '../model/types'
import { StepCategory } from './step-category'
import { StepConfirmation } from './step-confirmation'
import { StepSuccess } from './step-success'
import { StepTimeSlot } from './step-time-slot'

export function MasterCallPage() {
  const [step, setStep] = useState<MasterCallStep>(0)
  const [serviceType, setServiceType] = useState<ServiceType>('repair')
  const [category, setCategory] = useState<ApplianceCategory | null>(null)
  const [selected, setSelected] = useState<{
    group: TimeSlotGroup
    slot: TimeSlot
  } | null>(null)

  // Считаем на клиенте при переходе к выбору времени: на сервере дата/часовой пояс другие (рассинхрон SSR).
  const [timeSlotGroups, setTimeSlotGroups] = useState<TimeSlotGroup[]>([])

  const handleSelectCategory = (cat: ApplianceCategory) => {
    setCategory((prev) => (prev?.key === cat.key ? null : cat))
  }

  const handleNext = () => {
    if (category) {
      setTimeSlotGroups(getTimeSlotGroups())
      setStep(1)
    }
  }

  const handleSelectSlot = (group: TimeSlotGroup, slot: TimeSlot) => {
    setSelected({ group, slot })
  }

  const handleBack = () => {
    setStep((prev) => (prev > 0 ? ((prev - 1) as MasterCallStep) : prev))
  }

  switch (step) {
    case 0:
      return (
        <StepCategory
          serviceType={serviceType}
          serviceTypeChangeAction={setServiceType}
          selectedCategory={category}
          selectCategoryAction={handleSelectCategory}
          nextAction={handleNext}
        />
      )
    case 1:
      return (
        <StepTimeSlot
          groups={timeSlotGroups}
          selected={selected}
          selectAction={handleSelectSlot}
          nextAction={() => setStep(2)}
          backAction={handleBack}
        />
      )
    case 2:
      return (
        <StepConfirmation
          serviceType={serviceType}
          category={category!}
          selectedGroup={selected!.group}
          selectedSlot={selected!.slot}
          cancelAction={handleBack}
        />
      )
    case 3:
      return <StepSuccess />
  }
}
