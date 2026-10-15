import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { login, usePostLoginRedirect } from '@/entities/session'
import { LoginForm } from './LoginForm'

// Серверные функции и роутер подменяем; чистая логика сущности (схемы, resultMessage) остаётся настоящей
vi.mock('@/entities/session', async (importActual) => ({
  ...(await importActual<typeof import('@/entities/session')>()),
  login: vi.fn(),
  usePostLoginRedirect: vi.fn(),
}))

const finish = vi.fn()

function renderForm() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm redirectTo="/profile/orders" />
    </QueryClientProvider>,
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.mocked(login).mockReset()
    finish.mockReset()
    vi.mocked(usePostLoginRedirect).mockReturnValue(finish)
  })

  it('пустая отправка показывает ошибки полей и не вызывает сервер', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }))
    expect(await screen.findByText('Введите email')).toBeInTheDocument()
    expect(screen.getByText('Введите пароль')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('показывает сообщение об ошибке из результата мутации', async () => {
    vi.mocked(login).mockResolvedValue({ ok: false, message: 'Неверный email или пароль' })
    renderForm()
    await userEvent.type(screen.getByLabelText('Email'), 'User@Mail.ru')
    await userEvent.type(screen.getByLabelText('Пароль'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Неверный email или пароль')
    // email нормализован схемой перед отправкой, введённое значение осталось в поле
    expect(login).toHaveBeenCalledWith({ data: { email: 'user@mail.ru', password: 'wrong' } })
    expect(screen.getByLabelText('Email')).toHaveValue('User@Mail.ru')
    expect(finish).not.toHaveBeenCalled()
  })

  it('при успехе завершает вход с пользователем', async () => {
    const user = { id: '1', email: 'a@b.ru', isEmailVerified: true, firstName: 'И', lastName: 'П' }
    vi.mocked(login).mockResolvedValue({ ok: true, user })
    renderForm()
    await userEvent.type(screen.getByLabelText('Email'), 'a@b.ru')
    await userEvent.type(screen.getByLabelText('Пароль'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: 'Войти' }))

    await waitFor(() => expect(finish).toHaveBeenCalledWith(user))
    expect(usePostLoginRedirect).toHaveBeenCalledWith('/profile/orders')
  })
})
