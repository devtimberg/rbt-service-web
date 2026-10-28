import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import type { TimeSlotGroup } from '../model/types'
import { StepTimeSlot } from './step-time-slot'

vi.mock('@/shared/ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/ui')>()),
  // Портал шторки в тесте не нужен: рисуем содержимое на месте
  SheetFooterSlot: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const groups: TimeSlotGroup[] = [
  {
    key: 'day-0',
    label: 'Сегодня, 1 января',
    slots: [
      { key: '0-0', start: '09:00', end: '11:00', available: false },
      { key: '0-1', start: '11:00', end: '13:00', available: true },
    ],
  },
]

function setup(selected: { group: TimeSlotGroup; slot: TimeSlotGroup['slots'][number] } | null = null) {
  const props = { selectAction: vi.fn(), nextAction: vi.fn(), backAction: vi.fn() }
  render(<StepTimeSlot groups={groups} selected={selected} {...props} />)
  return props
}

describe('StepTimeSlot', () => {
  it('выбор доступного слота вызывает selectAction с группой и слотом', async () => {
    const { selectAction } = setup()
    await userEvent.click(screen.getByRole('button', { name: '11:00 — 13:00' }))
    expect(selectAction).toHaveBeenCalledWith(groups[0], groups[0]!.slots[1])
  })

  it('недоступный слот заблокирован', () => {
    setup()
    expect(screen.getByRole('button', { name: '09:00 — 11:00' })).toBeDisabled()
  })

  it('без выбора «Продолжить» показывает ошибку и не переходит дальше', async () => {
    const { nextAction } = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(screen.getByText('Выберите время')).toBeInTheDocument()
    expect(nextAction).not.toHaveBeenCalled()
  })

  it('с выбранным слотом «Продолжить» вызывает nextAction', async () => {
    const { nextAction } = setup({ group: groups[0]!, slot: groups[0]!.slots[1]! })
    await userEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(nextAction).toHaveBeenCalledOnce()
  })
})
