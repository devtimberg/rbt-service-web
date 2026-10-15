import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { signupResendOtp, signupStart, signupVerify } from '@/entities/session'
import { SignupFlow } from './SignupFlow'

vi.mock('@/entities/session', async (importActual) => ({
  ...(await importActual<typeof import('@/entities/session')>()),
  signupStart: vi.fn(),
  signupVerify: vi.fn(),
  signupResendOtp: vi.fn(),
  signupComplete: vi.fn(),
  usePostLoginRedirect: vi.fn(() => vi.fn()),
}))

function renderFlow() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <SignupFlow />
    </QueryClientProvider>,
  )
}

describe('SignupFlow', () => {
  beforeEach(() => {
    vi.mocked(signupStart).mockReset()
    vi.mocked(signupVerify).mockReset()
    vi.mocked(signupResendOtp).mockReset()
  })

  it('email → шаг с кодом: показывает адрес и обратный отсчёт повторной отправки', async () => {
    vi.mocked(signupStart).mockResolvedValue({ ok: true, resendIn: 90 })
    renderFlow()
    await userEvent.type(screen.getByLabelText('Email'), 'New@Mail.ru')
    await userEvent.click(screen.getByRole('button', { name: 'Отправить код' }))

    expect(await screen.findByText(/Код из 6 цифр отправлен на new@mail.ru/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Повторно через 01:30' })).toBeDisabled()
  })

  it('неверный код показывает ошибку бэкенда, верный открывает шаг с профилем', async () => {
    vi.mocked(signupStart).mockResolvedValue({ ok: true, resendIn: 0 })
    vi.mocked(signupVerify)
      .mockResolvedValueOnce({ ok: false, message: 'Неверный или устаревший код' })
      .mockResolvedValueOnce({ ok: true, ticket: 'ticket-1' })
    renderFlow()
    await userEvent.type(screen.getByLabelText('Email'), 'a@b.ru')
    await userEvent.click(screen.getByRole('button', { name: 'Отправить код' }))

    const code = await screen.findByLabelText('Код из письма')
    await userEvent.type(code, '12')
    await userEvent.click(screen.getByRole('button', { name: 'Подтвердить' }))
    expect(await screen.findByText('Код состоит из 6 цифр')).toBeInTheDocument()

    await userEvent.clear(code)
    await userEvent.type(code, '111111')
    await userEvent.click(screen.getByRole('button', { name: 'Подтвердить' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Неверный или устаревший код')

    await userEvent.click(screen.getByRole('button', { name: 'Подтвердить' }))
    expect(await screen.findByText('Немного о вас')).toBeInTheDocument()
    expect(signupVerify).toHaveBeenLastCalledWith({ data: { email: 'a@b.ru', code: '111111' } })
  })
})
