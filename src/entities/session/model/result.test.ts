import { describe, expect, it } from 'vite-plus/test'
import { ApiError, ApiNetworkError } from '@/shared/api'
import { failureFrom, resultMessage } from './result'

describe('failureFrom', () => {
  it('бизнес-ошибка превращается в сообщение без resendIn', () => {
    expect(failureFrom(new ApiError(401, { code: 'invalid_credentials', message: 'x' }))).toEqual({
      ok: false,
      message: 'Неверный email или пароль',
    })
  })
  it('при 429 сохраняет время до следующей попытки', () => {
    const error = new ApiError(429, { code: 'rate_limited', message: 'x', nextResendIn: 42 })
    expect(failureFrom(error)).toEqual({ ok: false, message: 'Слишком много попыток, попробуйте позже', resendIn: 42 })
  })
  it('429 без nextResendIn не добавляет resendIn', () => {
    expect(failureFrom(new ApiError(429, { code: 'rate_limited', message: 'x' }))).toEqual({
      ok: false,
      message: 'Слишком много попыток, попробуйте позже',
    })
  })
  it('сетевая ошибка', () => {
    expect(failureFrom(new ApiNetworkError())).toEqual({ ok: false, message: 'Не удалось связаться с сервером' })
  })
})

describe('resultMessage', () => {
  it('берёт сообщение из неуспешного результата', () => {
    expect(resultMessage({ ok: false, message: 'Ошибка' }, null)).toBe('Ошибка')
  })
  it('успех и отсутствие результата без ошибки дают undefined', () => {
    expect(resultMessage({ ok: true }, null)).toBeUndefined()
    expect(resultMessage(undefined, null)).toBeUndefined()
  })
  it('сбой самого вызова показывает общее сообщение', () => {
    expect(resultMessage(undefined, new Error('boom'))).toBe('Что-то пошло не так, попробуйте ещё раз')
  })
})
