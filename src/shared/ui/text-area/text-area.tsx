'use client'

import { type ChangeEvent, type ComponentProps, useState } from 'react'
import { cn } from '@/shared/lib/cn'
import { Box } from '../box'
import { Label } from '../field'
import { Text } from '../text'
import styles from './text-area.module.css'

type TextAreaProps = Omit<ComponentProps<'textarea'>, 'placeholder'> & {
  label: string
  name: string
  /** Текст ошибки под полем (приоритетнее подсказки). */
  error?: string | undefined
  /** Пояснение под полем серым. */
  hint?: string | undefined
  /** Класс самого `<textarea>` (высота и т. п.); `className` — на обёртке. */
  textareaClassName?: string
}

/**
 * Figma «[C] Textarea»: мин. высота 80, радиус 8, отступы 12, подпись внутри поля. Пустое поле без фокуса — заливка
 * input-fill, подпись 16/22 сверху; в фокусе или с текстом подпись 12/14, текст 16/22 под ней. Фокус — тёмная рамка,
 * заполненное — рамка input-border, ошибка — рамка и подпись цвета ошибки. С `maxLength` под полем справа счётчик
 * «12/255». Поле работает и неконтролируемым (`register`): длину для счётчика считает само по `onChange`.
 * id поля — `id` вызывающего или `name`; `ref` — на `<textarea>`.
 */
export function TextArea({
  id,
  label,
  name,
  error,
  hint,
  required,
  maxLength,
  value,
  defaultValue,
  onChange,
  className,
  textareaClassName,
  rows = 2,
  ...props
}: TextAreaProps) {
  const fieldId = id ?? name
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`
  const message = error ?? hint
  const messageId = error ? errorId : hint ? hintId : undefined
  const [typed, setTyped] = useState(() => String(defaultValue ?? '').length)
  const length = value === undefined ? typed : String(value).length

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setTyped(event.target.value.length)
    onChange?.(event)
  }

  return (
    <Box className={cn(styles.root, className)}>
      <Box className={styles.control}>
        {/* Непустой placeholder нужен селектору :placeholder-shown, самого текста не видно */}
        <textarea
          id={fieldId}
          name={name}
          placeholder=" "
          rows={rows}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={messageId}
          className={cn(styles.textarea, error && styles.error, textareaClassName)}
          onChange={handleChange}
          {...props}
        />
        <Label htmlFor={fieldId} className={styles.label}>
          {label}
          {required ? '*' : null}
        </Label>
      </Box>
      {message || maxLength !== undefined ? (
        <Box className={styles.footer}>
          {message ? (
            <Text id={messageId} className={cn(styles.message, error && styles.messageError)}>
              {message}
            </Text>
          ) : null}
          {maxLength !== undefined ? (
            <Text aria-hidden className={styles.counter}>
              {length}/{maxLength}
            </Text>
          ) : null}
        </Box>
      ) : null}
    </Box>
  )
}
