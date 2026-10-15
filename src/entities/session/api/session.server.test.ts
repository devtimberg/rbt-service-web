import { deleteCookie, getRequestHeader, getRequestIP, setCookie } from '@tanstack/react-start/server'
// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { ApiError, ApiNetworkError, type ApiSession } from '@/shared/api'
import type { SessionData } from '../model/types'
import { refreshSession } from './auth-api.server'
import { sealSession, unsealSession } from './cookie-seal.server'
import { getClientMeta, getValidSession, readSession } from './session.server'

const h = vi.hoisted(() => ({
  secret: 'test-secret-test-secret-test-secret-0000',
  request: undefined as unknown as Request,
  cookie: undefined as string | undefined,
  trustProxy: false,
  headers: {} as Record<string, string>,
}))

vi.mock('@tanstack/react-start/server', () => ({
  getRequest: () => h.request,
  getCookie: () => h.cookie,
  setCookie: vi.fn(),
  deleteCookie: vi.fn(),
  getRequestHeader: vi.fn((name: string) => h.headers[name]),
  getRequestIP: vi.fn(),
}))
vi.mock('./auth-api.server', () => ({ refreshSession: vi.fn() }))
vi.mock('@/shared/config', () => ({
  getServerEnv: () => ({ API_INTERNAL_URL: 'http://api.test', SESSION_SECRET: h.secret, TRUST_PROXY: h.trustProxy }),
}))

const user = { id: '1', email: 'a@b.ru', emailVerified: true, firstName: 'Иван', lastName: 'Петров' }
const expired: SessionData = {
  user: { id: '1', email: 'a@b.ru', isEmailVerified: true, firstName: 'Иван', lastName: 'Петров' },
  accessToken: 'access-old',
  refreshToken: 'refresh-old',
  accessTokenExpiresAt: 0,
}
const apiSession = (refreshToken?: string): ApiSession => ({
  accessToken: 'access-new',
  tokenType: 'Bearer',
  expiresIn: 900,
  user,
  ...(refreshToken ? { refreshToken } : {}),
})

beforeEach(() => {
  vi.clearAllMocks()
  h.request = new Request('http://app.test/')
  h.cookie = sealSession(expired, h.secret, 60_000)
  h.trustProxy = false
  h.headers = {}
})

describe('getValidSession', () => {
  it('годный access-токен: refresh не вызывается', async () => {
    h.cookie = sealSession({ ...expired, accessTokenExpiresAt: Date.now() + 600_000 }, h.secret, 60_000)
    expect((await getValidSession())?.accessToken).toBe('access-old')
    expect(refreshSession).not.toHaveBeenCalled()
  })

  it('обычная ротация: новый refreshToken записывается в cookie', async () => {
    vi.mocked(refreshSession).mockResolvedValue(apiSession('refresh-new'))
    const session = await getValidSession()
    expect(session?.refreshToken).toBe('refresh-new')
    expect(setCookie).toHaveBeenCalledTimes(1)
    const sealed = vi.mocked(setCookie).mock.calls[0]?.[1] as string
    expect(unsealSession(sealed, h.secret)?.refreshToken).toBe('refresh-new')
  })

  it('grace-ответ без refreshToken: access живёт только в этом запросе, cookie не перезаписывается', async () => {
    vi.mocked(refreshSession).mockResolvedValue(apiSession())
    const session = await getValidSession()
    expect(session?.accessToken).toBe('access-new')
    expect(setCookie).not.toHaveBeenCalled()
    expect(deleteCookie).not.toHaveBeenCalled()
    // повторное чтение в том же запросе не ходит в API второй раз
    expect(readSession()?.accessToken).toBe('access-new')
    await getValidSession()
    expect(refreshSession).toHaveBeenCalledTimes(1)
  })

  it('refresh отклонён (4xx): cookie очищается, гость', async () => {
    vi.mocked(refreshSession).mockRejectedValue(new ApiError(401, { code: 'refresh_token_revoked', message: 'x' }))
    expect(await getValidSession()).toBeNull()
    expect(deleteCookie).toHaveBeenCalled()
  })

  it('сетевой сбой refresh: гость на этот запрос, cookie сохраняется', async () => {
    vi.mocked(refreshSession).mockRejectedValue(new ApiNetworkError())
    expect(await getValidSession()).toBeNull()
    expect(deleteCookie).not.toHaveBeenCalled()
    expect(readSession()).not.toBeNull()
  })
})

describe('getClientMeta', () => {
  beforeEach(() => {
    h.headers = { 'user-agent': 'UA', 'x-forwarded-for': '6.6.6.6, 10.0.0.1', 'x-real-ip': '7.7.7.7' }
  })

  it('по умолчанию не доверяет X-Forwarded-For и X-Real-IP клиента', () => {
    vi.mocked(getRequestIP).mockReturnValue('1.2.3.4')
    expect(getClientMeta()).toEqual({ userAgent: 'UA', ip: '1.2.3.4' })
    expect(getRequestIP).toHaveBeenCalledWith({ xForwardedFor: false })
  })

  it('без адреса сокета IP не берётся из клиентских заголовков', () => {
    vi.mocked(getRequestIP).mockReturnValue(undefined)
    expect(getClientMeta().ip).toBeUndefined()
  })

  it('TRUST_PROXY=true: доверяет X-Forwarded-For, затем X-Real-IP', () => {
    h.trustProxy = true
    vi.mocked(getRequestIP).mockReturnValue('6.6.6.6')
    expect(getClientMeta().ip).toBe('6.6.6.6')
    expect(getRequestIP).toHaveBeenCalledWith({ xForwardedFor: true })
    vi.mocked(getRequestIP).mockReturnValue(undefined)
    expect(getClientMeta().ip).toBe('7.7.7.7')
    expect(getRequestHeader).toHaveBeenCalled()
  })
})
