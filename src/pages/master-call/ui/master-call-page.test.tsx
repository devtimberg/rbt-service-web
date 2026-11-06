import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { ApiError, makeStore, type ApiClients } from '@/shared/api'
import { renderWithStore } from '@/shared/api/testing'
import { MasterCallPage } from './master-call-page'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))
vi.mock('@/shared/lib/use-media-query', () => ({ useIsMobile: () => true }))
vi.mock('@/shared/ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/ui')>()),
  // Портал шторки в тесте не нужен: рисуем содержимое на месте
  SheetFooterSlot: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const submit = async () => {
  const button = screen.getAllByRole('button', { name: 'Создать заявку' })[0]!
  await waitFor(() => expect(button).toBeEnabled())
  await userEvent.click(button)
}
const chooseCategory = async (label: string) => {
  await waitFor(() => expect(screen.getByRole('button', { name: 'Вид техники' })).toBeEnabled())
  await userEvent.click(screen.getByRole('button', { name: 'Вид техники' }))
  await userEvent.click(screen.getByRole('button', { name: label }))
}

function renderPage(request: ApiClients['request'] = vi.fn().mockResolvedValue({ requestNumber: '20261106-0001' })) {
  return renderWithStore(<MasterCallPage />, { store: makeStore({ request }) })
}

describe('MasterCallPage', () => {
  beforeEach(() => {
    push.mockClear()
    sessionStorage.clear()
  })

  it('пустая отправка показывает ошибку обязательного поля, правка поля её убирает', async () => {
    renderPage()
    await submit()
    expect(await screen.findByText('Обязательное поле')).toBeInTheDocument()
    expect(screen.queryByText('Выберите технику')).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Номер телефона'))
    await userEvent.paste('9')
    await waitFor(() => expect(screen.queryByText('Обязательное поле')).not.toBeInTheDocument())
  })

  it('отправка наводит фокус на первое поле с ошибкой', async () => {
    renderPage()
    await submit()
    await waitFor(() => expect(screen.getByLabelText('Номер телефона')).toHaveFocus())
  })

  it('ввод отражается в чеке', async () => {
    renderPage()
    const receipt = screen.getByLabelText('Чек заявки')
    expect(screen.getByRole('button', { name: 'Номер ещё не присвоен. Показать пояснение' })).toBeInTheDocument()

    await chooseCategory('Холодильник')
    await userEvent.click(screen.getByLabelText('Номер телефона'))
    await userEvent.paste('9001234567')
    await userEvent.type(screen.getByLabelText('Комментарий к заявке'), 'Не морозит')
    expect(receipt.textContent).toContain('Холодильник')
    expect(receipt.textContent).toContain('+7 (900) 123-45-67')
    expect(receipt.textContent).toContain('Не морозит')
  })

  it('успешная отправка показывает «Заявка создана», «Хорошо» ведёт на главную', async () => {
    renderPage()
    await chooseCategory('Холодильник')
    await userEvent.click(screen.getByLabelText('Номер телефона'))
    await userEvent.paste('9001234567')
    await submit()

    expect(await screen.findByText('Заявка создана', undefined, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByText('# 20261106-0001')).toBeInTheDocument()

    expect(screen.getAllByRole('link', { name: 'Хорошо' })[0]).toHaveAttribute('href', '/')
    expect(sessionStorage.getItem('rbt:master-call:draft:v1')).toBeNull()
  })
  it('оставляет поля доступными во время запроса и показывает именно отправленные значения', async () => {
    let complete!: (value: { requestNumber: string }) => void
    const pending = new Promise<{ requestNumber: string }>((resolve) => {
      complete = resolve
    })
    const request = vi.fn().mockReturnValue(pending)
    renderPage(request)
    await submit()
    await userEvent.click(screen.getByLabelText('Номер телефона'))
    await userEvent.paste('9001234567')
    await submit()
    const phone = screen.getByLabelText('Номер телефона')
    expect(phone).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Вид техники' })).toBeEnabled()
    expect(screen.getByLabelText('Комментарий к заявке')).toBeEnabled()
    await userEvent.clear(phone)
    await userEvent.paste('9057654321')
    await act(async () => {
      complete({ requestNumber: '20261106-0001' })
    })
    expect(request).toHaveBeenCalledWith(
      '/customer/requests',
      expect.objectContaining({
        body: { phone: '+79001234567' },
      }),
    )
    expect(await screen.findByText('Заявка создана', undefined, { timeout: 3000 })).toBeInTheDocument()
    const receipt = screen.getByLabelText('Чек заявки')
    expect(receipt.textContent).toContain('+7 (900) 123-45-67')
    expect(receipt.textContent).not.toContain('+7 (905) 765-43-21')
  })
  it('показывает спокойное уведомление о повторе и сохраняет черновик', async () => {
    renderPage(vi.fn().mockRejectedValue(new ApiError(409, { code: 'duplicate', message: 'Повторная заявка' })))
    await waitFor(() => expect(screen.getByLabelText('Номер телефона')).toBeEnabled())
    await userEvent.click(screen.getByLabelText('Номер телефона'))
    await userEvent.paste('9001234567')
    await submit()
    expect(await screen.findByRole('status')).toHaveTextContent('Вы уже отправляли заявку')
    expect(screen.getByRole('status')).toHaveTextContent('Повторная отправка доступна через 15 минут.')
    expect(screen.queryByText('Заявка создана')).not.toBeInTheDocument()
    expect(sessionStorage.getItem('rbt:master-call:draft:v1')).not.toBeNull()
    await userEvent.type(screen.getByLabelText('Комментарий к заявке'), 'Уточнение')
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
  })

  it('привязывает ошибку API к своему варианту техники', async () => {
    renderPage(
      vi.fn().mockRejectedValue(
        new ApiError(400, {
          code: 'invalid',
          message: 'Неверные данные',
          attrErrors: [{ attr: 'equipmentName', code: 'invalid', message: 'invalid name' }],
        }),
      ),
    )
    await chooseCategory('Другое')
    await userEvent.type(screen.getByLabelText('Ваш вариант техники'), 'Кофемашина')
    await userEvent.click(screen.getByLabelText('Номер телефона'))
    await userEvent.paste('9001234567')
    await submit()
    expect(await screen.findByText('Проверьте название техники')).toBeInTheDocument()
    expect(screen.getByLabelText('Ваш вариант техники')).toHaveFocus()
    await userEvent.type(screen.getByLabelText('Ваш вариант техники'), ' новая')
    await waitFor(() => expect(screen.queryByText('Проверьте название техники')).not.toBeInTheDocument())
  })

  it('сохраняет пустые строки и переносы комментария в живом и итоговом чеке', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByLabelText('Комментарий к заявке')).toBeEnabled())
    const comment = '\nПервый абзац\n\n\nВторой абзац\n\n'
    await userEvent.type(screen.getByLabelText('Комментарий к заявке'), comment)
    expect(screen.getByLabelText('Чек заявки').textContent).toContain(comment)
    await userEvent.click(screen.getByLabelText('Номер телефона'))
    await userEvent.paste('9001234567')
    await submit()
    expect(await screen.findByText('Заявка создана', undefined, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByLabelText('Чек заявки').textContent).toContain(comment)
  })
})
