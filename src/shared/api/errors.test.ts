import { describe, expect, it } from 'vite-plus/test'
import { ApiError, ApiNetworkError, messageForCode, toUserMessage } from './errors'

const apiError = (code: string, status = 400) => new ApiError(status, { code, message: `raw:${code}` })

describe('toUserMessage', () => {
  it('известный код', () => {
    expect(toUserMessage(apiError('rate_limited', 429))).toBe('Слишком много попыток, попробуйте позже')
  })

  it('неизвестный код отдаёт message из ответа бэкенда', () => {
    expect(toUserMessage(apiError('http_502'))).toBe('raw:http_502')
  })

  it('сетевая ошибка использует собственное сообщение', () => {
    expect(toUserMessage(new ApiNetworkError())).toBe('Не удалось связаться с сервером')
  })

  it('прочие ошибки дают общее сообщение', () => {
    expect(toUserMessage(new Error('boom'))).toBe('Что-то пошло не так, попробуйте ещё раз')
    expect(toUserMessage('строка')).toBe('Что-то пошло не так, попробуйте ещё раз')
  })

  it('ApiError: retryIn и isRateLimited', () => {
    const error = new ApiError(429, { code: 'rate_limited', message: 'x', nextResendIn: 30 })
    expect(error.isRateLimited).toBe(true)
    expect(error.retryIn).toBe(30)
    expect(apiError('x').isRateLimited).toBe(false)
  })
})

describe('messageForCode', () => {
  it('чистый маппинг без экземпляра ошибки', () => {
    expect(messageForCode('rate_limited')).toBe('Слишком много попыток, попробуйте позже')
    expect(messageForCode('unknown')).toBe('Что-то пошло не так, попробуйте ещё раз')
    expect(messageForCode('unknown', 'сообщение')).toBe('сообщение')
  })
})
