import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { SHEET_CLOSE_DURATION_MS, useSheetState } from './use-sheet-state'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe('useSheetState', () => {
  it('открытие: монтируется закрытой, через кадры открывается', () => {
    const { result, rerender } = renderHook(({ s }) => useSheetState(s), { initialProps: { s: false } })
    expect(result.current).toMatchObject({ rendered: false, open: false })
    rerender({ s: true })
    expect(result.current).toMatchObject({ rendered: true, open: false })
    advance(100)
    expect(result.current.open).toBe(true)
  })

  it('закрытие: сразу open=false, размонтирование через SHEET_CLOSE_DURATION_MS', () => {
    const { result, rerender } = renderHook(({ s }) => useSheetState(s), { initialProps: { s: true } })
    expect(result.current).toMatchObject({ rendered: true, open: true, disableOpenAnimation: true })
    rerender({ s: false })
    advance(100)
    expect(result.current).toMatchObject({ rendered: true, open: false })
    advance(SHEET_CLOSE_DURATION_MS)
    expect(result.current.rendered).toBe(false)
  })

  it('повторное открытие в течение закрытия отменяет размонтирование', () => {
    const { result, rerender } = renderHook(({ s }) => useSheetState(s), { initialProps: { s: true } })
    rerender({ s: false })
    advance(100)
    rerender({ s: true })
    advance(SHEET_CLOSE_DURATION_MS * 2)
    expect(result.current).toMatchObject({ rendered: true, open: true })
  })
})
