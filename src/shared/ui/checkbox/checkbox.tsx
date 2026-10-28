import { type ChangeEvent, type ComponentProps, useEffect, useRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { DashIcon, TickIcon } from '../icons'
import styles from './checkbox.module.css'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type' | 'checked' | 'defaultChecked' | 'size'> & {
  /** Отмечен, не отмечен или «частично» (indeterminate). */
  checked?: boolean | 'indeterminate'
  defaultChecked?: boolean
  /** Вызывается с новым состоянием; прежний API Radix, вместо чтения event.target.checked. */
  onCheckedChange?: (checked: boolean) => void
}

/**
 * Чекбокс на нативном `<input type="checkbox">`: клавиатура, формы и `aria-*` работают как есть.
 * Квадрат 18px, в отмеченном и частичном состоянии заливка primary-300 с белой иконкой.
 * Подпись снаружи: оборачивайте в `<label>`.
 */
export function Checkbox({ className, checked, onCheckedChange, onChange, disabled, ...props }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  const indeterminate = checked === 'indeterminate'

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event)
    onCheckedChange?.(event.target.checked)
  }

  return (
    <span className={cn(styles.root, className)}>
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        // 'indeterminate' нативно не бывает checked
        {...(checked === undefined ? {} : { checked: checked === true })}
        onChange={handleChange}
        aria-checked={indeterminate ? 'mixed' : undefined}
        className={styles.input}
        {...props}
      />
      <TickIcon aria-hidden className={cn(styles.icon, styles.tick)} />
      <DashIcon aria-hidden className={cn(styles.icon, styles.dash)} />
    </span>
  )
}
