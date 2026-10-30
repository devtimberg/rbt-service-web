'use client'

import {
  type ChangeEvent,
  type ClipboardEvent,
  type ComponentProps,
  type SyntheticEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  formatPhoneInput,
  PHONE_DIGITS,
  PHONE_MASK,
  PHONE_PREFIX,
  parsePhoneDigits,
  phoneCaretAfterDigits,
} from '@/shared/lib/phone-mask'
import { TextField } from '../text-field'
import styles from './phone-field.module.css'

type PhoneFieldProps = Omit<
  ComponentProps<typeof TextField>,
  'value' | 'defaultValue' | 'onChange' | 'type' | 'inputMode' | 'overlay'
> & {
  /** Национальные цифры без `+7`: до 10 символов (`9001234567`). */
  value: string
  onValueChange: (digits: string) => void
}

/**
 * Поле номера телефона с маской `+7 (___) ___-__-__` (Figma «[C] Fluent Input», состояния «Phone Mask»).
 * Снаружи значение это до 10 национальных цифр. В самом `<input>` только набранное (`+7 (900) 1`), а незаполненный
 * остаток маски (`23-45-67`...) рисует серый «призрак» поверх поля с теми же шрифтом и отступами.
 * Пока поле пусто и без фокуса, значения нет: видна только подпись, как у `TextField`.
 * Редактирование нативное: каретку можно ставить куда угодно и править середину. Если стёрт разделитель
 * (`)`, пробел, `-`), удаляется ближайшая цифра. После форматирования каретка возвращается за ту же цифру.
 * Каретка не заходит в префикс `+7 (`. Вставка `+7…`, `8…`, `7…` или 10 цифр заменяет номер целиком,
 * короткий фрагмент вставляется в позицию каретки. Автозаполнение (`+79001234567`) нормализуется в `onChange`.
 * `inputMode="tel"`, `autoComplete="tel-national"`: на мобильных открывается цифровая клавиатура.
 * Внешний `ref` ведёт на `<input>` рядом с внутренним: по нему react-hook-form наводит фокус на поле с ошибкой.
 */
export function PhoneField({
  value,
  onValueChange,
  onFocus,
  onBlur,
  onClick,
  onSelect,
  ref,
  ...props
}: PhoneFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  // Позиция каретки после следующей отрисовки; новый объект на каждый ввод, чтобы эффект сработал и без смены значения
  const [caret, setCaret] = useState<{ position: number } | null>(null)
  const shown = focused || value ? formatPhoneInput(value) : ''

  useLayoutEffect(() => {
    const input = inputRef.current
    if (!caret || !input || document.activeElement !== input) return
    input.setSelectionRange(caret.position, caret.position)
  }, [caret])

  /** Применяет новые цифры и ставит каретку за `count`-й цифрой уже отформатированного значения. */
  function apply(digits: string, count: number) {
    const next = digits.slice(0, PHONE_DIGITS)
    onValueChange(next)
    setCaret({
      position: phoneCaretAfterDigits(formatPhoneInput(next), Math.min(count, next.length)),
    })
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value
    const position = event.target.selectionStart ?? raw.length
    const digits = parsePhoneDigits(raw)
    let before = parsePhoneDigits(raw.slice(0, position)).length

    const inputType = (event.nativeEvent as InputEvent).inputType
    if (digits === value) {
      // Цифры те же: стёрт разделитель или префикс. Backspace/Delete должен убрать соседнюю цифру
      if (inputType === 'deleteContentBackward' && before > 0) {
        apply(value.slice(0, before - 1) + value.slice(before), before - 1)
        return
      }
      if (inputType === 'deleteContentForward' && before < value.length) {
        apply(value.slice(0, before) + value.slice(before + 1), before)
        return
      }
    }
    before = Math.min(before, digits.length)
    apply(digits, before)
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    // Вставка в поле с маской: без перехвата префикс +7 склеился бы со вставленным +7
    event.preventDefault()
    const text = event.clipboardData.getData('text')
    const pasted = parsePhoneDigits(text)
    if (!pasted) return
    // Целый номер (с кодом страны или 10 цифр) заменяет введённое
    if (/^\s*(\+?7|8)/.test(text) || pasted.length >= PHONE_DIGITS) {
      apply(pasted, PHONE_DIGITS)
      return
    }
    // Обрывок встаёт на место выделения (или каретки) по индексу цифры
    const input = event.currentTarget
    const start = parsePhoneDigits(input.value.slice(0, input.selectionStart ?? input.value.length)).length
    const end = parsePhoneDigits(input.value.slice(0, input.selectionEnd ?? input.value.length)).length
    const next = (value.slice(0, start) + pasted + value.slice(end)).slice(0, PHONE_DIGITS)
    apply(next, start + pasted.length)
  }

  /** Каретка (без выделения) не заходит левее конца префикса `+7 (`. */
  function keepOutOfPrefix(input: HTMLInputElement) {
    const { selectionStart, selectionEnd } = input
    if (selectionStart === selectionEnd && selectionStart !== null && selectionStart < PHONE_PREFIX.length) {
      input.setSelectionRange(PHONE_PREFIX.length, PHONE_PREFIX.length)
    }
  }

  const ghost = shown ? (
    <span aria-hidden className={styles.ghost}>
      <span>
        <span className={styles.typed}>{shown}</span>
        <span className={styles.rest}>{PHONE_MASK.slice(shown.length)}</span>
      </span>
    </span>
  ) : null

  return (
    <TextField
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      {...props}
      ref={(node) => {
        inputRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      value={shown}
      overlay={ghost}
      onChange={handleChange}
      onPaste={handlePaste}
      onFocus={(event) => {
        setFocused(true)
        keepOutOfPrefix(event.currentTarget)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      onClick={(event) => {
        keepOutOfPrefix(event.currentTarget)
        onClick?.(event)
      }}
      onSelect={(event: SyntheticEvent<HTMLInputElement>) => {
        keepOutOfPrefix(event.currentTarget)
        onSelect?.(event)
      }}
    />
  )
}
