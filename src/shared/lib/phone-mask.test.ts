import { describe, expect, it } from 'vite-plus/test'
import {
  formatPhoneDisplay,
  formatPhoneInput,
  isValidPhone,
  parsePhoneDigits,
  phoneCaretAfterDigits,
} from './phone-mask'

describe('parsePhoneDigits', () => {
  it.each([
    ['9001234567', '9001234567'],
    ['+7 (900) 123-45-67', '9001234567'],
    ['8 900 123 45 67', '9001234567'],
    ['79001234567', '9001234567'],
    ['8 900 123 45 6', '900123456'],
    ['+7 (9', '9'],
    ['+7 (', ''],
    ['+7 (900) 123', '900123'],
    [' (900', '900'],
    ['', ''],
    ['abc', ''],
    ['90012345678999', '9001234567'],
  ])('%s → %s', (raw, expected) => {
    expect(parsePhoneDigits(raw)).toBe(expected)
  })
})

describe('formatPhoneInput', () => {
  it.each([
    ['', '+7 ('],
    ['9', '+7 (9'],
    ['900', '+7 (900'],
    ['9001', '+7 (900) 1'],
    ['900123', '+7 (900) 123'],
    ['9001234', '+7 (900) 123-4'],
    ['900123456', '+7 (900) 123-45-6'],
    ['9001234567', '+7 (900) 123-45-67'],
  ])('%s → %s', (digits, expected) => {
    expect(formatPhoneInput(digits)).toBe(expected)
  })
})

describe('phoneCaretAfterDigits', () => {
  it('после N-й цифры, при N = 0 после префикса', () => {
    const full = formatPhoneInput('9001234567')
    expect(phoneCaretAfterDigits(full, 0)).toBe(4)
    expect(phoneCaretAfterDigits(full, 1)).toBe(5)
    expect(phoneCaretAfterDigits(full, 3)).toBe(7)
    expect(phoneCaretAfterDigits(full, 4)).toBe(10)
    expect(phoneCaretAfterDigits(full, 10)).toBe(full.length)
  })
  it('цифр меньше N: в конец значения', () => {
    expect(phoneCaretAfterDigits('+7 (90', 5)).toBe(6)
  })
})

describe('formatPhoneDisplay', () => {
  it('+7 XXX XXX-XX-XX', () => {
    expect(formatPhoneDisplay('9001234567')).toBe('+7 900 123-45-67')
  })
})

describe('isValidPhone', () => {
  it('10 цифр, первая 9', () => {
    expect(isValidPhone('9001234567')).toBe(true)
    expect(isValidPhone('8001234567')).toBe(false)
    expect(isValidPhone('900123456')).toBe(false)
    expect(isValidPhone('90012345678')).toBe(false)
  })
})
