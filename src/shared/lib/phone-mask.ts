/** Маска поля телефона: подчёркивания это пока не введённые цифры. */
export const PHONE_MASK = '+7 (___) ___-__-__'

/** Сколько цифр национального номера (после +7). */
export const PHONE_DIGITS = 10

/**
 * Достаёт из введённого или вставленного текста национальные цифры (без кода страны), не больше 10.
 * Понимает `+7 (900) 123-45-67`, `8 900 123 45 67`, `79001234567` и значение самого поля вместе с префиксом `+7 (`.
 * Ведущие `+7`, `7` и `8` считаются кодом страны и отбрасываются (мобильный номер начинается с 9). Нормализация формата ввода, не бизнес-логика.
 * Граничные случаи: срез поля до каретки (`+7 (9`) разбирается так же, как всё значение; если стёрт `+7` целиком
 * (` (900`), код страны не отбрасывается и цифры остаются как есть; если пользователь выделил всё и набрал `7` или `8`,
 * эта цифра считается кодом страны и даёт пустой результат.
 */
export function parsePhoneDigits(raw: string): string {
  const trimmed = raw.trim()
  const digits = trimmed.replace(/\D/g, '')
  const hasCode = /^(\+?7|8)/.test(trimmed)
  const withoutCountry = hasCode ? digits.slice(1) : digits
  return withoutCountry.slice(0, PHONE_DIGITS)
}

/** Неизменяемое начало значения поля: каретка не должна заходить левее. */
export const PHONE_PREFIX = '+7 ('

/**
 * Значение поля по набранным цифрам, только набранная часть: разделитель появляется вместе со следующей цифрой.
 * `''` → `+7 (`, `900` → `+7 (900`, `9001` → `+7 (900) 1`, `9001234` → `+7 (900) 123-4`.
 * Пустое значение у неактивного поля (чтобы подпись стояла по центру) решает компонент, а не эта функция.
 */
export function formatPhoneInput(digits: string): string {
  let result = PHONE_PREFIX
  let pending = ''
  let index = 0
  for (const char of PHONE_MASK.slice(PHONE_PREFIX.length)) {
    if (char !== '_') {
      pending += char
      continue
    }
    const digit = digits[index++]
    if (digit === undefined) break
    result += pending + digit
    pending = ''
  }
  return result
}

/** Позиция каретки сразу после N-й национальной цифры в отформатированном значении (N = 0: после `+7 (`). */
export function phoneCaretAfterDigits(formatted: string, count: number): number {
  if (count <= 0) return PHONE_PREFIX.length
  let seen = 0
  for (let i = PHONE_PREFIX.length; i < formatted.length; i++) {
    if (/\d/.test(formatted[i] ?? '') && ++seen === count) return i + 1
  }
  return formatted.length
}

/** Вид номера в чеке и на экране заявки: `+7 900 123 45 67`. Неполный номер возвращается как есть с `+7`. */
export function formatPhoneDisplay(digits: string): string {
  const d = digits.padEnd(PHONE_DIGITS, ' ')
  return `+7 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`.replace(/ +$/, '').trim()
}

/** Полный мобильный номер: 10 цифр, первая 9. Проверка ввода, не бизнес-логика. */
export function isValidPhone(digits: string): boolean {
  return /^9\d{9}$/.test(digits)
}
