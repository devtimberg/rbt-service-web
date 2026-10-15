import { type ElementType, type HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type TextVariant = 'default' | 'secondary' | 'disabled' | 'error'
type TextSize = 'default' | 'xs' | 'sm' | 'lg'

type TextProps = HTMLAttributes<HTMLElement> & {
  variant?: TextVariant
  size?: TextSize
  /** HTML-тег (по умолчанию p). Заменяет прежний asChild: нужен другой элемент, укажите его здесь. */
  element?: ElementType
}

const variants = {
  default: 'text-primary',
  secondary: 'text-secondary',
  disabled: 'text-disabled',
  error: 'text-input-error-message leading-5!',
} as const

const sizes = {
  default: 'text-base',
  xs: 'text-xs',
  sm: 'text-sm',
  lg: 'text-lg',
} as const

export function Text({
  className,
  element: Element = 'p',
  variant = 'default',
  size = 'default',
  ...props
}: TextProps) {
  return <Element className={cn('cursor-default font-normal', variants[variant], sizes[size], className)} {...props} />
}
