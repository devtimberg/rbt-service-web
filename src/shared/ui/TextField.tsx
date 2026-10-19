import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import { Stack } from './Box'
import { Label } from './Field'
import { Text } from './Text'
import { TextInput } from './TextInput'

/** Поле формы: подпись, ввод, ошибка (приоритетнее) или подсказка. `name` служит и id для связки подписи. */
export function TextField({
  label,
  name,
  error,
  hint,
  className,
  ...props
}: ComponentProps<'input'> & {
  label: string
  name: string
  error?: string | undefined
  hint?: string
}) {
  const errorId = `${name}-error`
  return (
    <Stack gap={1.5}>
      <Label htmlFor={name} className="text-secondary text-sm font-medium">
        {label}
      </Label>
      <TextInput
        id={name}
        name={name}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn('h-12 rounded-2xl', className)}
        {...props}
      />
      {error ? (
        <Text className="cursor-default font-normal text-input-error-message leading-5! text-xs" id={errorId}>
          {error}
        </Text>
      ) : hint ? (
        <Text className="cursor-default font-normal text-secondary text-xs">{hint}</Text>
      ) : null}
    </Stack>
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
      placeholder={'0'.repeat(length)}
      error={error}
      className="text-center text-lg tracking-[0.5em]"
      {...props}
    />
  )
}
