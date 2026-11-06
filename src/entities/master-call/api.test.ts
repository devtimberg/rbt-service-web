import { describe, expect, it, vi } from 'vite-plus/test'
import { ApiError, makeStore } from '@/shared/api'
import { masterCallApi } from './api'

describe('мутация вызова мастера', () => {
  it('возвращает номер API и отправляет телефон в международном формате', async () => {
    const request = vi.fn().mockResolvedValue({ requestNumber: '20261106-0003' })
    const store = makeStore({ request })
    const result = store.dispatch(
      masterCallApi.endpoints.createMasterCall.initiate({
        phone: '9001234567',
        category: 'Холодильник',
        comment: ' Не охлаждает ',
      }),
    )
    const data = await result.unwrap()
    expect(request).toHaveBeenCalledWith(
      '/customer/requests',
      expect.objectContaining({
        body: { phone: '+79001234567', equipmentType: 'REFRIGERATOR', comment: 'Не охлаждает' },
      }),
    )
    expect(data.number).toBe('20261106-0003')
    expect(Number.isNaN(Date.parse(data.createdAt))).toBe(false)
    result.reset()
  })

  it('сохраняет код дубликата для сообщения об ограничении', async () => {
    const request = vi.fn().mockRejectedValue(new ApiError(409, { code: 'duplicate', message: 'Повторная заявка' }))
    const store = makeStore({ request })
    const result = store.dispatch(masterCallApi.endpoints.createMasterCall.initiate({ phone: '9001234567' }))
    expect(await result).toHaveProperty('error', {
      status: 409,
      code: 'duplicate',
      message: 'Повторная заявка',
      attrErrors: [],
    })
    expect(request).toHaveBeenCalledTimes(1)
    result.reset()
  })

  it('отклоняет успешный HTTP-ответ без номера вместо выдуманного успеха', async () => {
    const store = makeStore({ request: vi.fn().mockResolvedValue({}) })
    const result = store.dispatch(
      masterCallApi.endpoints.createMasterCall.initiate({
        phone: '9001234567',
      }),
    )
    expect(await result).toHaveProperty('error')
    result.reset()
  })
})
