import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import { Input } from './Input'

/** Стилизованное текстовое поле без подписи. Невалидное состояние включается атрибутом aria-invalid. */
export function TextInput({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <Input
      type={type}
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-border-default bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] md:text-sm',
        'placeholder:text-input-placeholder selection:bg-primary selection:text-inverse',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'focus-visible:border-border-strong focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
        'aria-invalid:border-danger-700 aria-invalid:ring-danger-700/20',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
