import { describe, expect, it } from 'vite-plus/test'
import { EMPTY_RECEIPT_DATE, formatReceiptDate } from './use-receipt-clock'

describe('formatReceiptDate', () => {
  it('до гидратации отдаёт заготовку', () => {
    expect(formatReceiptDate(null)).toBe(EMPTY_RECEIPT_DATE)
  })

  it('форматирует ДД.ММ.ГГГГ ЧЧ:ММ с нулями', () => {
    expect(formatReceiptDate(new Date(2026, 0, 5, 9, 7).getTime())).toBe('05.01.2026 09:07')
  })
})
