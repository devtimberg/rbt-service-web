import { describe, expect, it } from 'vite-plus/test'
import { masterCallSchema } from './schema'

const valid = { category: 'fridge', phone: '9001234567', comment: 'Не морозит' }

function firstMessage(value: unknown) {
  const result = masterCallSchema.safeParse(value)
  return result.success ? null : result.error.issues[0]?.message
}

describe('masterCallSchema', () => {
  it('принимает корректные значения, комментарий необязателен', () => {
    expect(masterCallSchema.safeParse(valid).success).toBe(true)
    expect(masterCallSchema.safeParse({ ...valid, comment: undefined }).success).toBe(true)
  })

  it('не требует технику', () => {
    expect(masterCallSchema.safeParse({ ...valid, category: '' }).success).toBe(true)
    expect(masterCallSchema.safeParse({ ...valid, category: undefined }).success).toBe(true)
  })

  it('требует телефон', () => {
    expect(firstMessage({ ...valid, phone: '' })).toBe('Обязательное поле')
  })

  it('не принимает неполный и немобильный номер', () => {
    expect(firstMessage({ ...valid, phone: '900123' })).toBe('Некорректный номер телефона')
    expect(firstMessage({ ...valid, phone: '8131232132' })).toBe('Некорректный номер телефона')
  })

  it('ограничивает комментарий 255 символами', () => {
    expect(masterCallSchema.safeParse({ ...valid, comment: 'a'.repeat(255) }).success).toBe(true)
    expect(firstMessage({ ...valid, comment: 'a'.repeat(256) })).toBe('Не больше 255 символов')
  })
})
