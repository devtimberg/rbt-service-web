import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { logoutAll, useSessionExpired } from '@/entities/session'
import { LogoutAllButton } from './LogoutAllButton'

const navigate = vi.fn()
const invalidate = vi.fn()

vi.mock('@tanstack/react-router', () => ({ useRouter: () => ({ navigate, invalidate }) }))
vi.mock('@/entities/session', async (importActual) => ({
  ...(await importActual<typeof import('@/entities/session')>()),
  logoutAll: vi.fn(),
  useSessionExpired: vi.fn(),
}))

const handleExpired = vi.fn()

function renderButton() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  queryClient.setQueryData(['session', 'user'], { id: '1' })
  render(
    <QueryClientProvider client={queryClient}>
      <LogoutAllButton />
    </QueryClientProvider>,
  )
  return queryClient
}

async function openConfirm() {
  await userEvent.click(screen.getByRole('button', { name: 'Выйти со всех устройств' }))
}

describe('LogoutAllButton', () => {
  beforeEach(() => {
    vi.mocked(logoutAll).mockReset()
    navigate.mockReset().mockResolvedValue(undefined)
    invalidate.mockReset().mockResolvedValue(undefined)
    handleExpired.mockReset().mockReturnValue(false)
    vi.mocked(useSessionExpired).mockReturnValue(handleExpired)
  })

  it('отмена подтверждения не вызывает logoutAll', async () => {
    renderButton()
    await openConfirm()
    await userEvent.click(await screen.findByRole('button', { name: 'Отмена' }))
    expect(logoutAll).not.toHaveBeenCalled()
  })

  it('подтверждение: вызывает logoutAll, сбрасывает сессию и уходит на главную', async () => {
    vi.mocked(logoutAll).mockResolvedValue({ ok: true })
    const queryClient = renderButton()
    await openConfirm()
    await userEvent.click(await screen.findByRole('button', { name: 'Выйти везде' }))

    await waitFor(() => expect(navigate).toHaveBeenCalledWith({ to: '/' }))
    expect(logoutAll).toHaveBeenCalledTimes(1)
    expect(queryClient.getQueryData(['session', 'user'])).toBeNull()
    expect(invalidate).toHaveBeenCalled()
  })

  it('401: делегирует обработчику истёкшей сессии, на главную не идёт', async () => {
    const result = { ok: false as const, message: 'Сессия отозвана, войдите заново', unauthorized: true as const }
    vi.mocked(logoutAll).mockResolvedValue(result)
    handleExpired.mockReturnValue(true)
    renderButton()
    await openConfirm()
    await userEvent.click(await screen.findByRole('button', { name: 'Выйти везде' }))

    await waitFor(() => expect(handleExpired).toHaveBeenCalledWith(result))
    expect(navigate).not.toHaveBeenCalled()
  })

  it('прочая ошибка показывается, сессия остаётся', async () => {
    vi.mocked(logoutAll).mockResolvedValue({ ok: false, message: 'Не удалось связаться с сервером' })
    const queryClient = renderButton()
    await openConfirm()
    await userEvent.click(await screen.findByRole('button', { name: 'Выйти везде' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось связаться с сервером')
    expect(navigate).not.toHaveBeenCalled()
    expect(queryClient.getQueryData(['session', 'user'])).toEqual({ id: '1' })
  })
})
