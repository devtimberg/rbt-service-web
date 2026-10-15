import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import { Input } from './Input'
import { Text } from './Text'
import { VStack } from './VStack'

/** Поле формы: подпись, ввод, ошибка (приоритетнее) или подсказка. `name` служит и id для связки подписи. */
export function Field({
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
    <VStack gap={1.5}>
      <label htmlFor={name} className="text-secondary text-sm font-medium">
        {label}
      </label>
      <Input
        id={name}
        name={name}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn('h-12 rounded-2xl', className)}
        {...props}
      />
      {error ? (
        <Text id={errorId} variant="error" size="xs">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="secondary" size="xs">
          {hint}
        </Text>
      ) : null}
    </VStack>
  )
}

/** Поле одноразового кода: только цифры, фиксированная длина. */
export function OtpField({
  error,
  length,
  ...props
}: Omit<ComponentProps<'input'>, 'name'> & { error?: string | undefined; length: number }) {
  return (
    <Field
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
