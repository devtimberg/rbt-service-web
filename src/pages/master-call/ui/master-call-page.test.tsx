import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import { MasterCallPage } from './master-call-page'

vi.mock('@/shared/ui/SheetFooterSlot', () => ({
  // Портал шторки в тесте не нужен: рисуем содержимое на месте
  SheetFooterSlot: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('../model/time-slots', () => ({
  getTimeSlotGroups: () => [
    {
      key: 'day-0',
      label: 'Сегодня, 1 января',
      slots: [{ key: '0-1', start: '11:00', end: '13:00', available: true }],
    },
  ],
}))

const click = (name: string) => userEvent.click(screen.getByRole('button', { name }))

describe('MasterCallPage', () => {
  it('категория → время → подтверждение; «Отменить заявку» и «Назад» возвращают на шаг', async () => {
    render(<MasterCallPage />)
    await click('Продолжить')
    expect(screen.getByText('Выберите категорию поломки')).toBeInTheDocument()

    await click('Холодильник')
    await click('Продолжить')
    await click('11:00 — 13:00')
    await click('Продолжить')
    expect(screen.getByText('Подтвердите заявку')).toBeInTheDocument()
    expect(screen.getByText('Ремонт холодильник')).toBeInTheDocument()

    await click('Отменить заявку')
    expect(screen.getByRole('button', { name: '11:00 — 13:00' })).toBeInTheDocument()

    await click('Назад')
    expect(screen.getByRole('button', { name: 'Холодильник' })).toBeInTheDocument()
  })
})
