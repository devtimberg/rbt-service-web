import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vite-plus/test'
import { getCurrentUser } from './auth.functions'
import { loadCurrentUser, sessionKeys } from './session.query'

vi.mock('./auth.functions', () => ({ getCurrentUser: vi.fn() }))

describe('loadCurrentUser', () => {
  it('сбой чтения сессии даёт null и не кэширует гостя', async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(new Error('session_refresh_unavailable'))
    const queryClient = new QueryClient()
    expect(await loadCurrentUser(queryClient)).toBeNull()
    expect(queryClient.getQueryData(sessionKeys.user())).toBeUndefined()
  })
})
