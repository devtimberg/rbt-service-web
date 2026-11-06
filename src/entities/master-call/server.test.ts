// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'
import { createMasterCallHandler } from './server'

vi.mock('@/shared/config', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/config')>()),
  getServerEnv: () => ({ API_INTERNAL_URL: 'https://backend.test/api/' }),
}))

const body = { phone: '+79001234567', equipmentType: 'REFRIGERATOR' }
const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } })

function request(value: unknown = body, headers: Record<string, string> = { 'X-Real-IP': '203.0.113.1' }) {
  return new Request('https://site.test/api/customer/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(value),
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('серверная отправка заявки на вызов мастера', () => {
  it('отправляет проверенные данные и IP, возвращает серверный код', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json({ requestNumber: '20261106-0001' }))
    vi.stubGlobal('fetch', fetchMock)
    const response = await createMasterCallHandler(request({ ...body, unexpected: 'удаляется' }))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ requestNumber: '20261106-0001' })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://backend.test/api/customer/requests',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'X-Real-IP': '203.0.113.1',
        },
      }),
    )
  })

  it.each([{}, { ...body, phone: '9001234567' }, { ...body, comment: 'x'.repeat(256) }])(
    'не обращается к API при неверном теле %j',
    async (value) => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)
      expect((await createMasterCallHandler(request(value))).status).toBe(400)
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )

  it('не берёт IP из подставленного X-Forwarded-For', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    expect((await createMasterCallHandler(request(body, { 'X-Forwarded-For': '1.1.1.1' }))).status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each(['localhost:3001', '127.0.0.1:3001', '[::1]:3001'])(
    'поддерживает локальный make start на %s без прокси',
    async (host) => {
      vi.stubEnv('NODE_ENV', 'production')
      const fetchMock = vi.fn().mockResolvedValue(json({ requestNumber: '20261106-0001' }))
      vi.stubGlobal('fetch', fetchMock)
      const response = await createMasterCallHandler(request(body, { Host: host }))
      expect(response.status).toBe(200)
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ 'X-Real-IP': '127.0.0.1' }),
        }),
      )
    },
  )

  it('не подставляет loopback для публичного Host при внутреннем URL Next', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const incoming = new Request('http://localhost:3001/api/customer/requests', {
      method: 'POST',
      headers: { Host: 'site.test' },
      body: JSON.stringify(body),
    })
    expect((await createMasterCallHandler(incoming)).status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('сохраняет код дубликата и ошибки полей с nullable message', async () => {
    const attrErrors = [{ attr: 'phone', code: 'invalid', message: 'invalid phone' }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ code: 'duplicate', message: null, attrErrors }, 409)))
    const response = await createMasterCallHandler(request())
    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({ code: 'duplicate', message: 'Ошибка сервера', attrErrors })
  })

  it('не подтверждает создание без серверного номера', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({})))
    expect((await createMasterCallHandler(request())).status).toBe(502)
  })

  it('возвращает сериализуемую ошибку при сетевом сбое', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    const response = await createMasterCallHandler(request())
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ message: 'Не удалось связаться с сервером' })
  })
})
