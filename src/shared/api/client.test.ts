// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { apiFetch } from './client'
import { ApiError, toUserMessage } from './errors'

vi.mock('@/shared/config', () => ({
  getServerEnv: () => ({ API_INTERNAL_URL: 'http://api.test/', SESSION_SECRET: 'x'.repeat(32), TRUST_PROXY: false }),
}))

function mockFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

async function failure(promise: Promise<unknown>): Promise<ApiError> {
  const error = await promise.then(
    () => null,
    (e: unknown) => e,
  )
  expect(error).toBeInstanceOf(ApiError)
  return error as ApiError
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('apiFetch: ошибки', () => {
  it('тело с code проходит как есть', async () => {
    mockFetch(json(400, { code: 'invalid_credentials', message: 'x' }))
    const error = await failure(apiFetch('/auth/password-change'))
    expect(error.code).toBe('invalid_credentials')
    expect(error.status).toBe(400)
  })

  it('401 Bolt {"detail":"token_revoked"} — отозванная сессия, а не «Ошибка сервера»', async () => {
    mockFetch(json(401, { detail: 'token_revoked' }))
    const error = await failure(apiFetch('/auth/logout-all'))
    expect(error.isUnauthorized).toBe(true)
    expect(error.code).toBe('token_revoked')
    expect(toUserMessage(error)).toBe('Сессия отозвана, войдите заново')
  })

  it('401 Bolt {"detail":"Authentication required"} — истёкшая сессия', async () => {
    mockFetch(json(401, { detail: 'Authentication required' }))
    const error = await failure(apiFetch('/auth/password-change'))
    expect(error.isUnauthorized).toBe(true)
    expect(error.code).toBe('unauthorized')
    expect(toUserMessage(error)).toBe('Сессия истекла, войдите заново')
  })

  it('401 с не-JSON телом тоже считается неавторизованным', async () => {
    mockFetch(new Response('<html>', { status: 401 }))
    expect((await failure(apiFetch('/auth/logout-all'))).code).toBe('unauthorized')
  })

  it('прочие ответы без code остаются http_N', async () => {
    mockFetch(json(500, { detail: 'boom' }))
    const error = await failure(apiFetch('/x'))
    expect(error.code).toBe('http_500')
    expect(error.isUnauthorized).toBe(false)
  })
})

describe('apiFetch: заголовки', () => {
  it('пробрасывает X-Client-Type, User-Agent и X-Real-IP клиента', async () => {
    const fetchMock = mockFetch(json(200, {}))
    await apiFetch('/auth/password-change', { body: {}, clientMeta: { userAgent: 'UA', ip: '1.2.3.4' } })
    const init = fetchMock.mock.calls[0]?.[1] as { headers: Record<string, string> }
    expect(init.headers).toMatchObject({ 'X-Client-Type': 'native', 'User-Agent': 'UA', 'X-Real-IP': '1.2.3.4' })
  })
})
