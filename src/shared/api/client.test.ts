// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { apiFetch } from './client'
import { ApiError, ApiNetworkError } from './errors'

vi.mock('@/shared/config', () => ({
  getServerEnv: () => ({ API_INTERNAL_URL: 'http://api.test/' }),
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
    const error = await failure(apiFetch('/x'))
    expect(error.code).toBe('invalid_credentials')
    expect(error.status).toBe(400)
  })

  it('прочие ответы без code остаются http_N', async () => {
    mockFetch(json(500, { detail: 'boom' }))
    const error = await failure(apiFetch('/x'))
    expect(error.code).toBe('http_500')
  })
})

describe('apiFetch: таймаут', () => {
  it('передаёт signal, а abort превращается в ApiNetworkError', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new DOMException('timeout', 'TimeoutError'))
    vi.stubGlobal('fetch', fetchMock)
    await expect(apiFetch('/x')).rejects.toBeInstanceOf(ApiNetworkError)
    expect((fetchMock.mock.calls[0] as [string, RequestInit])[1].signal).toBeInstanceOf(AbortSignal)
  })
})
