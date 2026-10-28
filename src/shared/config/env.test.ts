import { describe, expect, it } from 'vite-plus/test'
import { parseServerEnv } from './env'

describe('parseServerEnv', () => {
  it('принимает абсолютный API_INTERNAL_URL', () => {
    expect(parseServerEnv({ API_INTERNAL_URL: 'http://api.test' }).success).toBe(true)
  })

  it('без API_INTERNAL_URL или с относительным — ошибка', () => {
    expect(parseServerEnv({}).success).toBe(false)
    expect(parseServerEnv({ API_INTERNAL_URL: '/api' }).success).toBe(false)
  })
})
