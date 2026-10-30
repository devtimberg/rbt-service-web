import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { renderWithStore } from '@/shared/api/testing'
import { MasterCallPage } from './master-call-page'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))
vi.mock('@/shared/ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/ui')>()),
  // Портал шторки в тесте не нужен: рисуем содержимое на месте
  SheetFooterSlot: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Создать заявку' }))

describe('MasterCallPage', () => {
  beforeEach(() => push.mockClear())

  it('пустая отправка показывает ошибку обязательного поля, правка поля её убирает', async () => {
    renderWithStore(<MasterCallPage />)
    await submit()
    expect(await screen.findByText('Обязательное поле')).toBeInTheDocument()
    expect(screen.queryByText('Выберите технику')).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Номер телефона'))
    await userEvent.paste('9')
    await waitFor(() => expect(screen.queryByText('Обязательное поле')).not.toBeInTheDocument())
  })

  it('отправка наводит фокус на первое поле с ошибкой', async () => {
    renderWithStore(<MasterCallPage />)
    await submit()
    await waitFor(() => expect(screen.getByLabelText('Номер телефона')).toHaveFocus())
  })

  it('ввод отражается в чеке', async () => {
    renderWithStore(<MasterCallPage />)
    const receipt = screen.getByLabelText('Чек заявки')
    expect(receipt.textContent).toContain('____-____')

    await userEvent.selectOptions(screen.getByLabelText('Вид техники'), 'Холодильник')
    await userEvent.click(screen.getByLabelText('Номер телефона'))
    await userEvent.paste('9001234567')
    await userEvent.type(screen.getByLabelText('Комментарий к заявке'), 'Не морозит')
    expect(receipt.textContent).toContain('Холодильник')
    expect(receipt.textContent).toContain('+7 900 123 45 67')
    expect(receipt.textContent).toContain('Не морозит')
  })

  it('успешная отправка показывает «Заявка создана», «Хорошо» ведёт на главную', async () => {
    renderWithStore(<MasterCallPage />)
    await userEvent.selectOptions(screen.getByLabelText('Вид техники'), 'Холодильник')
    await userEvent.click(screen.getByLabelText('Номер телефона'))
    await userEvent.paste('9001234567')
    await submit()

    expect(await screen.findByText('Заявка создана', undefined, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByText(/^# \d{4}-\d{4}$/)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Хорошо' }))
    expect(push).toHaveBeenCalledWith('/')
  })
})
