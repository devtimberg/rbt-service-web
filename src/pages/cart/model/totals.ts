type Line = { price: number; oldPrice?: number | undefined; quantity: number }

/** Итоги выбранных позиций. Скидка не бывает отрицательной (oldPrice < price даёт 0). */
export function calcCartTotals(lines: Line[]) {
  const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0)
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
  const discount = lines.reduce((sum, l) => sum + Math.max(0, (l.oldPrice ?? l.price) - l.price) * l.quantity, 0)
  return { totalItems, subtotal, discount }
}
