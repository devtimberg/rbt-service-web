import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import { Box } from '../box'
import { Label } from '../field'
import { ChevronDownIcon } from '../icons'
import { Text } from '../text'
import styles from './select.module.css'

export type SelectOption = { value: string; label: string }

type SelectProps = Omit<ComponentProps<'select'>, 'children' | 'value' | 'defaultValue'> & {
  label: string
  name: string
  /** Выбранное значение; `''` — ничего не выбрано. Поле контролируемое: с react-hook-form через `Controller`. */
  value: string
  options: readonly SelectOption[]
  error?: string | undefined
}

/**
 * Figma «[C] Select»: высота 56, радиус 8, заливка input-fill, справа chevron 24. Пусто — подпись 16/24 по центру,
 * выбрано — подпись 12/14 сверху и значение 16/24 под ней. Фокус — белый фон и тёмная рамка, ошибка — рамка,
 * подпись и chevron цвета ошибки. Внутри нативный `<select>`: на мобильных открывается системный список.
 * id поля — `id` вызывающего или `name`; `className` — на обёртке, `ref` — на `<select>`.
 */
export function Select({ id, label, name, value, options, error, required, className, ...props }: SelectProps) {
  const selectId = id ?? name
  const errorId = `${selectId}-error`
  const filled = value !== ''
  return (
    <Box className={cn(styles.root, className)}>
      <Box className={styles.control}>
        <select
          id={selectId}
          name={name}
          value={value}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(styles.select, !filled && styles.empty, error && styles.error)}
          {...props}
        >
          {/* oxlint-disable-next-line jsx-a11y/control-has-associated-label -- скрытая заглушка «ничего не выбрано», вместо её текста видна подпись */}
          <option value="" disabled hidden />
          {options.map((option) => (
            <option key={option.value} value={option.value} className={styles.option}>
              {option.label}
            </option>
          ))}
        </select>
        <Label htmlFor={selectId} className={cn(styles.label, filled && styles.labelFilled)}>
          {label}
          {required ? '*' : null}
        </Label>
        <ChevronDownIcon aria-hidden className={styles.chevron} />
      </Box>
      {error ? (
        <Text id={errorId} className={styles.message}>
          {error}
        </Text>
      ) : null}
    </Box>
  )
}
