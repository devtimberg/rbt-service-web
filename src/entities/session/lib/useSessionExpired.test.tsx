import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { useSessionExpired } from './useSessionExpired'

const navigate = vi.fn()
const invalidate = vi.fn()
vi.mock('@tanstack/react-router', () => ({ useRouter: () => ({ navigate, invalidate }) }))
vi.mock('../api/auth.functions', () => ({ getCurrentUser: vi.fn() }))

function setup() {
  const queryClient = new QueryClient()
  queryClient.setQueryData(['session', 'user'], { id: '1' })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, ...renderHook(() => useSessionExpired(), { wrapper }) }
}

describe('useSessionExpired', () => {
  beforeEach(() => {
    navigate.mockReset().mockResolvedValue(undefined)
    invalidate.mockReset().mockResolvedValue(undefined)
  })

  it('401: сбрасывает сессию в кэше и ведёт на /login', async () => {
    const { queryClient, result } = setup()
    expect(result.current({ ok: false, message: 'x', unauthorized: true })).toBe(true)
    expect(queryClient.getQueryData(['session', 'user'])).toBeNull()
    expect(navigate).toHaveBeenCalledWith({ to: '/login' })
  })

  it('успех и обычные ошибки не трогает', () => {
    const { queryClient, result } = setup()
    expect(result.current({ ok: true })).toBe(false)
    expect(result.current({ ok: false, message: 'x' })).toBe(false)
    expect(queryClient.getQueryData(['session', 'user'])).toEqual({ id: '1' })
    expect(navigate).not.toHaveBeenCalled()
  })
})
