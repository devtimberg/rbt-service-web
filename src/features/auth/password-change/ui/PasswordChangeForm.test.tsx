import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { passwordChange, useSessionExpired } from '@/entities/session'
import { PasswordChangeForm } from './PasswordChangeForm'

vi.mock('@/entities/session', async (importActual) => ({
  ...(await importActual<typeof import('@/entities/session')>()),
  passwordChange: vi.fn(),
  useSessionExpired: vi.fn(),
}))

const user = { id: '1', email: 'a@b.ru', isEmailVerified: true, firstName: 'И', lastName: 'П' }
const handleExpired = vi.fn()

function renderForm() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <PasswordChangeForm />
    </QueryClientProvider>,
  )
}

async function fillAndSubmit(oldPassword = 'old-pass', newPassword = 'new-pass-123') {
  await userEvent.type(screen.getByLabelText('Текущий пароль'), oldPassword)
  await userEvent.type(screen.getByLabelText('Новый пароль'), newPassword)
  await userEvent.click(screen.getByRole('button', { name: 'Сменить пароль' }))
}

describe('PasswordChangeForm', () => {
  beforeEach(() => {
    vi.mocked(passwordChange).mockReset()
    handleExpired.mockReset()
    vi.mocked(useSessionExpired).mockReturnValue(handleExpired)
  })

  it('пустая отправка показывает ошибку текущего пароля и не вызывает сервер', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: 'Сменить пароль' }))
    expect(await screen.findByText('Введите текущий пароль')).toBeInTheDocument()
    expect(passwordChange).not.toHaveBeenCalled()
  })

  it('успех: сообщение, поля очищены', async () => {
    vi.mocked(passwordChange).mockResolvedValue({ ok: true, user })
    renderForm()
    await fillAndSubmit()

    expect(await screen.findByRole('status')).toHaveTextContent('Пароль изменён')
    expect(passwordChange).toHaveBeenCalledWith({ data: { oldPassword: 'old-pass', newPassword: 'new-pass-123' } })
    expect(screen.getByLabelText('Текущий пароль')).toHaveValue('')
    expect(screen.getByLabelText('Новый пароль')).toHaveValue('')
  })

  it('во время запроса кнопка недоступна', async () => {
    vi.mocked(passwordChange).mockReturnValue(new Promise(() => {}))
    renderForm()
    await fillAndSubmit()
    await waitFor(() => expect(screen.getByRole('button', { name: /Сменить пароль/ })).toBeDisabled())
  })

  it('ошибки валидатора бэкенда показываются у нового пароля, поля не очищаются', async () => {
    vi.mocked(passwordChange).mockResolvedValue({
      ok: false,
      message: 'Слишком простой. Только цифры.',
      fieldErrors: { newPassword: 'Слишком простой. Только цифры.' },
    })
    renderForm()
    await fillAndSubmit()

    expect(await screen.findByText('Слишком простой. Только цифры.')).toBeInTheDocument()
    expect(screen.getByLabelText('Новый пароль')).toBeInvalid()
    expect(screen.getByLabelText('Новый пароль')).toHaveValue('new-pass-123')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('неверный текущий пароль показывается у поля текущего пароля', async () => {
    vi.mocked(passwordChange).mockResolvedValue({
      ok: false,
      message: 'Неверный текущий пароль',
      fieldErrors: { oldPassword: 'Неверный текущий пароль' },
    })
    renderForm()
    await fillAndSubmit()

    expect(await screen.findByText('Неверный текущий пароль')).toBeInTheDocument()
    expect(screen.getByLabelText('Текущий пароль')).toBeInvalid()
  })

  it('прочая ошибка выводится общей плашкой', async () => {
    vi.mocked(passwordChange).mockResolvedValue({ ok: false, message: 'Не удалось связаться с сервером' })
    renderForm()
    await fillAndSubmit()
    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось связаться с сервером')
  })

  it('401: передаёт результат в обработчик истёкшей сессии, успех не показывается', async () => {
    const result = { ok: false as const, message: 'Сессия отозвана, войдите заново', unauthorized: true as const }
    vi.mocked(passwordChange).mockResolvedValue(result)
    renderForm()
    await fillAndSubmit()

    await waitFor(() => expect(handleExpired).toHaveBeenCalledWith(result))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
