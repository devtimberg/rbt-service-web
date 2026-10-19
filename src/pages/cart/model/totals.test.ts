import { describe, expect, it } from 'vite-plus/test'
import { calcCartTotals } from './totals'

describe('calcCartTotals', () => {
  it.each([
    { name: 'пусто', lines: [], want: { totalItems: 0, subtotal: 0, discount: 0 } },
    {
      name: 'со скидкой',
      lines: [
        { price: 80, oldPrice: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ],
      want: { totalItems: 3, subtotal: 210, discount: 40 },
    },
    {
      name: 'oldPrice ниже price: скидка не уходит в минус',
      lines: [{ price: 100, oldPrice: 90, quantity: 1 }],
      want: { totalItems: 1, subtotal: 100, discount: 0 },
    },
  ])('$name', ({ lines, want }) => {
    expect(calcCartTotals(lines)).toEqual(want)
  })
})
