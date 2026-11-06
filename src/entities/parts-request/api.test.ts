import { describe, expect, it, vi } from 'vite-plus/test'
import { makeStore } from '@/shared/api'
import { partsRequestApi } from './api'

describe('мутация заявки на запчасти', () => {
  it('нормализует телефон и необязательные поля, использует номер из API', async () => {
    const request = vi.fn().mockResolvedValue({ requestCode: '20261106-0002' })
    const store = makeStore({ request })
    const result = store.dispatch(
      partsRequestApi.endpoints.createPartsRequest.initiate({
        phone: '9001234567',
        email: ' mail@example.ru ',
        partNumber: ' ABC ',
        comment: '  ',
      }),
    )
    const data = await result.unwrap()
    expect(request).toHaveBeenCalledWith(
      '/customer/spare-part-requests',
      expect.objectContaining({
        body: { phone: '+79001234567', email: 'mail@example.ru', partNumber: 'ABC' },
      }),
    )
    expect(data.number).toBe('20261106-0002')
    expect(Number.isNaN(Date.parse(data.createdAt))).toBe(false)
    result.reset()
  })

  it('отклоняет успешный HTTP-ответ без номера вместо выдуманного успеха', async () => {
    const store = makeStore({ request: vi.fn().mockResolvedValue({}) })
    const result = store.dispatch(
      partsRequestApi.endpoints.createPartsRequest.initiate({
        phone: '9001234567',
        email: 'mail@example.ru',
      }),
    )
    expect(await result).toHaveProperty('error')
    result.reset()
  })
})
