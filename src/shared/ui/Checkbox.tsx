import { type ChangeEvent, type ComponentProps, useEffect, useRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { DashIcon, TickIcon } from './icons'

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
    <span className={cn('relative inline-flex size-4.5 shrink-0', className)}>
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        // 'indeterminate' нативно не бывает checked
        {...(checked === undefined ? {} : { checked: checked === true })}
        onChange={handleChange}
        aria-checked={indeterminate ? 'mixed' : undefined}
        className={cn(
          'peer size-full cursor-pointer appearance-none rounded-sm border-2 border-[#DEE9FE] bg-[#F7FAFF] transition-colors',
          'checked:border-primary-300 checked:bg-primary-300 indeterminate:border-primary-300 indeterminate:bg-primary-300',
          'focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        {...props}
      />
      <TickIcon
        aria-hidden
        className="pointer-events-none absolute inset-0 m-auto hidden size-3 text-inverse peer-checked:block peer-indeterminate:hidden"
      />
      <DashIcon
        aria-hidden
        className="pointer-events-none absolute inset-0 m-auto hidden size-3 text-inverse peer-indeterminate:block"
      />
    </span>
  )
}
