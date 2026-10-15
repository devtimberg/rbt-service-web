import { type ChangeEvent, type ComponentProps, createContext, use, useId, useState } from 'react'
import { cn } from '@/shared/lib/cn'

type RadioGroupContextValue = {
  name: string
  value: string | undefined
  onValueChange: (value: string) => void
  disabled: boolean | undefined
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

type RadioGroupProps = Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
}

/**
 * Группа радиокнопок на нативных `<input type="radio">` с общим name: стрелки клавиатуры и формы работают сами.
 * Значение управляется как раньше: `value` + `onValueChange` (контролируемый режим) или `defaultValue`.
 */
export function RadioGroup({
  className,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  ...props
}: RadioGroupProps) {
  const generatedName = useId()
  // Без `value` группа хранит выбор сама (стартует с defaultValue)
  const [innerValue, setInnerValue] = useState(defaultValue)

  function handleValueChange(next: string) {
    setInnerValue(next)
    onValueChange?.(next)
  }

  return (
    <RadioGroupContext
      value={{ name: name ?? generatedName, value: value ?? innerValue, onValueChange: handleValueChange, disabled }}
    >
      <div role="radiogroup" data-slot="radio-group" className={cn('grid gap-3', className)} {...props} />
    </RadioGroupContext>
  )
}

type RadioGroupItemProps = Omit<ComponentProps<'input'>, 'type' | 'name' | 'checked' | 'size'> & { value: string }

export function RadioGroupItem({ className, value, disabled, onChange, ...props }: RadioGroupItemProps) {
  const group = use(RadioGroupContext)
  if (!group) throw new Error('RadioGroupItem используется только внутри <RadioGroup>')

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event)
    if (event.target.checked) group?.onValueChange(value)
  }

  return (
    <span data-slot="radio-group-item" className={cn('relative inline-flex size-4.5 shrink-0', className)}>
      <input
        type="radio"
        name={group.name}
        value={value}
        disabled={disabled ?? group.disabled}
        checked={group.value === value}
        onChange={handleChange}
        className={cn(
          'peer size-full cursor-pointer appearance-none rounded-full border-2 border-[#DEE9FE] bg-[#F7FAFF] transition-shadow',
          'checked:border-primary-300 focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        {...props}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 hidden size-2.5 -translate-1/2 rounded-full bg-primary-300 peer-checked:block"
      />
    </span>
  )
}
