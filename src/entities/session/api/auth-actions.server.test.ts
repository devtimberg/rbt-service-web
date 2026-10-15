// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { ApiError, ApiNetworkError, type ApiSession } from '@/shared/api'
import type { SessionData } from '../model/types'
import { logoutAction, logoutAllAction, passwordChangeAction } from './auth-actions.server'
import * as authApi from './auth-api.server'
import { clearSession, getValidSession, readSession, writeSession } from './session.server'

vi.mock('./auth-api.server', () => ({ logout: vi.fn(), logoutAll: vi.fn(), passwordChange: vi.fn() }))
vi.mock('./session.server', () => ({
  clearSession: vi.fn(),
  getClientMeta: vi.fn(() => ({ userAgent: 'UA', ip: '1.2.3.4' })),
  getValidSession: vi.fn(),
  readSession: vi.fn(),
  writeSession: vi.fn(),
}))

const session: SessionData = {
  user: { id: '1', email: 'a@b.ru', isEmailVerified: true, firstName: 'Иван', lastName: 'Петров' },
  accessToken: 'access',
  refreshToken: 'refresh',
  accessTokenExpiresAt: 0,
}
const apiSession: ApiSession = {
  accessToken: 'access-new',
  tokenType: 'Bearer',
  expiresIn: 900,
  refreshToken: 'refresh-new',
  user: { id: '1', email: 'a@b.ru', emailVerified: true, firstName: 'Иван', lastName: 'Петров' },
}
const revoked = () => new ApiError(401, { code: 'token_revoked', message: 'x' })
const passwords = { oldPassword: 'old', newPassword: 'new' }

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(readSession).mockReturnValue(session)
  vi.mocked(getValidSession).mockResolvedValue(session)
})

describe('passwordChangeAction', () => {
  it('передаёт UA и IP клиента, чтобы новая сессия не получила user_agent=node', async () => {
    vi.mocked(authApi.passwordChange).mockResolvedValue(apiSession)
    const result = await passwordChangeAction(passwords)
    expect(authApi.passwordChange).toHaveBeenCalledWith('access', 'old', 'new', { userAgent: 'UA', ip: '1.2.3.4' })
    expect(result.ok).toBe(true)
    expect(writeSession).toHaveBeenCalledWith(expect.objectContaining({ refreshToken: 'refresh-new' }))
  })

  it('неверный текущий пароль (400 invalid_credentials) — своё сообщение', async () => {
    vi.mocked(authApi.passwordChange).mockRejectedValue(
      new ApiError(400, { code: 'invalid_credentials', message: 'x' }),
    )
    expect(await passwordChangeAction(passwords)).toEqual({
      ok: false,
      message: 'Неверный текущий пароль',
      fieldErrors: { oldPassword: 'Неверный текущий пароль' },
    })
    expect(clearSession).not.toHaveBeenCalled()
  })

  it('валидатор пароля (400 invalid_password): список требований привязан к новому паролю', async () => {
    vi.mocked(authApi.passwordChange).mockRejectedValue(
      new ApiError(400, { code: 'invalid_password', message: 'x', details: ['Слишком короткий.', 'Слишком простой.'] }),
    )
    expect(await passwordChangeAction(passwords)).toEqual({
      ok: false,
      message: 'Слишком короткий. Слишком простой.',
      fieldErrors: { newPassword: 'Слишком короткий. Слишком простой.' },
    })
  })

  it('401 (сессию отозвали на другом устройстве): cookie чистится, просим войти заново', async () => {
    vi.mocked(authApi.passwordChange).mockRejectedValue(revoked())
    expect(await passwordChangeAction(passwords)).toEqual({
      ok: false,
      message: 'Сессия отозвана, войдите заново',
      unauthorized: true,
    })
    expect(clearSession).toHaveBeenCalled()
  })

  it('refresh отклонён (cookie уже очищена): сессия истекла', async () => {
    vi.mocked(getValidSession).mockResolvedValue(null)
    vi.mocked(readSession).mockReturnValue(null)
    expect(await passwordChangeAction(passwords)).toEqual({
      ok: false,
      message: 'Сессия истекла, войдите заново',
      unauthorized: true,
    })
    expect(authApi.passwordChange).not.toHaveBeenCalled()
  })

  it('временный сбой refresh (cookie сохранена): не «сессия истекла»', async () => {
    vi.mocked(getValidSession).mockResolvedValue(null)
    expect(await passwordChangeAction(passwords)).toEqual({ ok: false, message: 'Не удалось связаться с сервером' })
    expect(clearSession).not.toHaveBeenCalled()
  })
})

describe('logoutAllAction', () => {
  it('успех: бэкенд подтвердил, cookie чистится', async () => {
    vi.mocked(authApi.logoutAll).mockResolvedValue(undefined)
    expect(await logoutAllAction()).toEqual({ ok: true })
    expect(clearSession).toHaveBeenCalled()
  })

  it('401: cookie чистится, сообщение о завершённой сессии', async () => {
    vi.mocked(authApi.logoutAll).mockRejectedValue(revoked())
    expect(await logoutAllAction()).toEqual({
      ok: false,
      message: 'Сессия отозвана, войдите заново',
      unauthorized: true,
    })
    expect(clearSession).toHaveBeenCalled()
  })

  it.each([
    ['сеть', new ApiNetworkError()],
    ['5xx', new ApiError(503, { code: 'http_503', message: 'Ошибка сервера' })],
  ])('%s: успех не сообщаем, cookie не трогаем', async (_name, error) => {
    vi.mocked(authApi.logoutAll).mockRejectedValue(error)
    const result = await logoutAllAction()
    expect(result.ok).toBe(false)
    expect(clearSession).not.toHaveBeenCalled()
  })

  it('гость: нечего завершать', async () => {
    vi.mocked(readSession).mockReturnValue(null)
    expect(await logoutAllAction()).toEqual({ ok: true })
    expect(authApi.logoutAll).not.toHaveBeenCalled()
  })
})

describe('logoutAction', () => {
  it('при сетевой ошибке всё равно чистит cookie и сообщает об успехе (локальный выход важнее)', async () => {
    vi.mocked(authApi.logout).mockRejectedValue(new ApiNetworkError())
    expect(await logoutAction()).toEqual({ ok: true })
    expect(clearSession).toHaveBeenCalled()
  })
})
