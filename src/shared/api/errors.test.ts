import { describe, expect, it } from 'vite-plus/test'
import { ApiError, ApiNetworkError, messageForCode, toUserMessage } from './errors'

const apiError = (code: string, details?: string[], status = 400) =>
  new ApiError(status, { code, message: `raw:${code}`, details: details ?? null })

describe('toUserMessage', () => {
  it.each([
    ['invalid_credentials', 'Неверный email или пароль'],
    ['email_already_registered', 'Этот email уже зарегистрирован'],
    ['invalid_code', 'Неверный или устаревший код'],
    ['invalid_ticket', 'Сессия регистрации недействительна, начните заново'],
    ['ticket_expired', 'Время регистрации истекло, начните заново'],
    ['invalid_password', 'Пароль не соответствует требованиям'],
    ['invalid_refresh_token', 'Сессия недействительна, войдите заново'],
    ['refresh_token_expired', 'Сессия истекла, войдите заново'],
    ['refresh_token_revoked', 'Сессия отозвана, войдите заново'],
    ['refresh_token_reused', 'Сессия завершена из соображений безопасности'],
    ['rate_limited', 'Слишком много попыток, попробуйте позже'],
    ['session_not_found', 'Сессия не найдена'],
    ['session_unknown', 'Обновите сессию и повторите'],
  ])('код %s', (code, message) => {
    expect(toUserMessage(apiError(code))).toBe(message)
  })

  it('invalid_password с details разворачивается в список требований', () => {
    expect(toUserMessage(apiError('invalid_password', ['Слишком короткий.', 'Только цифры.']))).toBe(
      'Слишком короткий. Только цифры.',
    )
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
    expect(messageForCode('invalid_code')).toBe('Неверный или устаревший код')
    expect(messageForCode('unknown')).toBe('Что-то пошло не так, попробуйте ещё раз')
    expect(messageForCode('unknown', [], 'сообщение')).toBe('сообщение')
  })
})
