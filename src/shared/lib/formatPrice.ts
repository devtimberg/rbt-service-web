/** Цена с пробелами между разрядами: 12345 → «12 345». */
export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU')
}
