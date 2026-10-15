import { describe, expect, it } from 'vite-plus/test'
import { parseServerEnv } from './env'

const base = { API_INTERNAL_URL: 'http://api.test', SESSION_SECRET: 'x'.repeat(32) }

describe('parseServerEnv', () => {
  it('TRUST_PROXY по умолчанию выключен', () => {
    const parsed = parseServerEnv(base)
    expect(parsed.success && parsed.data.TRUST_PROXY).toBe(false)
  })

  it.each([
    ['true', true],
    ['1', true],
    ['false', false],
    ['0', false],
  ])('TRUST_PROXY=%s', (value, expected) => {
    const parsed = parseServerEnv({ ...base, TRUST_PROXY: value })
    expect(parsed.success && parsed.data.TRUST_PROXY).toBe(expected)
  })

  it('неизвестное значение TRUST_PROXY — ошибка', () => {
    expect(parseServerEnv({ ...base, TRUST_PROXY: 'yes' }).success).toBe(false)
  })
})
