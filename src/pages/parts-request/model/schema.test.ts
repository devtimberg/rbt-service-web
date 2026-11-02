import { describe, expect, it } from 'vite-plus/test'
import { partsRequestSchema } from './schema'

const valid = { phone: '9001234567', email: 'mail@example.ru' }

function message(value: unknown) {
  const result = partsRequestSchema.safeParse(value)
  return result.success ? null : result.error.issues[0]?.message
}

describe('partsRequestSchema', () => {
  it('принимает заказ без партномера и комментария, убирает пробелы вокруг email', () => {
    expect(partsRequestSchema.parse({ ...valid, email: ' mail@example.ru ' })).toEqual(valid)
  })

  it.each(['phone', 'email'])('требует %s', (field) => {
    expect(message({ ...valid, [field]: '' })).toBe('Обязательное поле')
  })

  it.each(['900123', '8131232132'])('отклоняет некорректный телефон %s', (phone) => {
    expect(message({ ...valid, phone })).toBe('Некорректный номер телефона')
  })

  it('проверяет email', () => {
    expect(message({ ...valid, email: 'client.example.ru' })).toBe('Некорректный адрес электронной почты')
    expect(message({ ...valid, email: '  ' })).toBe('Обязательное поле')
  })

  it('проверяет граничные длины партномера и комментария', () => {
    expect(
      partsRequestSchema.safeParse({ ...valid, partNumber: 'a'.repeat(50), comment: 'a'.repeat(255) }).success,
    ).toBe(true)
    expect(message({ ...valid, partNumber: 'a'.repeat(51) })).toBe('Максимальное кол-во символов 50')
    expect(message({ ...valid, comment: 'a'.repeat(256) })).toBe('Не больше 255 символов')
  })
})
