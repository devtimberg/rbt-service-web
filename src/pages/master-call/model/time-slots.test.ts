import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { getTimeSlotGroups } from './time-slots'

describe('getTimeSlotGroups', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Конец месяца: проверяем переход через границу месяца
    vi.setSystemTime(new Date(2026, 0, 30, 12, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('возвращает три дня с подписями «Сегодня», «Завтра», «Послезавтра» и датами', () => {
    const groups = getTimeSlotGroups()
    expect(groups.map((g) => g.key)).toEqual(['day-0', 'day-1', 'day-2'])
    expect(groups[0]?.label).toBe('Сегодня, 30 января')
    expect(groups[1]?.label).toBe('Завтра, 31 января')
    expect(groups[2]?.label).toBe('Послезавтра, 1 февраля')
  })

  it('в каждом дне четыре слота, недоступны только заданные', () => {
    const groups = getTimeSlotGroups()
    for (const group of groups) expect(group.slots).toHaveLength(4)
    const unavailable = groups.flatMap((g) => g.slots).filter((s) => !s.available)
    expect(unavailable.map((s) => s.key)).toEqual(['0-0', '1-2', '2-3'])
  })
})
