import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Box } from '../box'
import { Label } from '../field'
import { Input } from '../input'
import { Text } from '../text'
import styles from './text-field.module.css'

type TextFieldProps = Omit<ComponentProps<'input'>, 'placeholder'> & {
  label: string
  name: string
  /** Текст ошибки под полем (приоритетнее подсказки). Есть: рамка и подпись цвета ошибки, у поля `aria-invalid`. */
  error?: string | undefined
  /** Пояснение под полем серым. */
  hint?: string | undefined
  /** Класс самого `<input>`; `className` — на обёртке. */
  inputClassName?: string
  /** Слой внутри рамки поверх значения (хвост маски у `PhoneField`), без событий указателя. */
  overlay?: ReactNode
}

/**
 * Figma «[C] Fluent Input»: высота 56, радиус 8, подпись внутри поля. Пустое поле без фокуса — заливка input-fill
 * без рамки, подпись 16/24 по центру. В фокусе или со значением подпись 12/14 поднимается к верхнему краю (8 от рамки),
 * значение 16/24 под ней. Фокус — рамка primary-500, заполненное — рамка input-border, ошибка — рамка и подпись
 * цвета ошибки. «Заполнено» определяет CSS (`:placeholder-shown`), без JS и без рассинхрона на SSR.
 * id поля — `id` вызывающего или `name`; `ref` — на `<input>`.
 */
export function TextField({
  id,
  label,
  name,
  error,
  hint,
  className,
  inputClassName,
  overlay,
  required,
  ...props
}: TextFieldProps) {
  const inputId = id ?? name
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`
  const describedBy = error ? errorId : hint ? hintId : undefined
  return (
    <Box className={cn(styles.root, className)}>
      <Box className={styles.control}>
        {/* Непустой placeholder нужен селектору :placeholder-shown, самого текста не видно */}
        <Input
          id={inputId}
          name={name}
          placeholder=" "
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(styles.input, error && styles.inputError, inputClassName)}
          {...props}
        />
        <Label htmlFor={inputId} className={styles.label}>
          {label}
          {required ? '*' : null}
        </Label>
        {overlay}
      </Box>
      {error ? (
        <Text className={cn(styles.message, styles.error)} id={errorId}>
          {error}
        </Text>
      ) : hint ? (
        <Text className={cn(styles.message, styles.hint)} id={hintId}>
          {hint}
        </Text>
      ) : null}
    </Box>
  )
}

/** Поле одноразового кода: только цифры, фиксированная длина. */
export function OtpField({
  error,
  length,
  ...props
}: Omit<ComponentProps<'input'>, 'name'> & { error?: string | undefined; length: number }) {
  return (
    <TextField
      label="Код из письма"
      name="code"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern={`\\d{${length}}`}
      maxLength={length}
      error={error}
      inputClassName={styles.otp}
      {...props}
    />
  )
}
