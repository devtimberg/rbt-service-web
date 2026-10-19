import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type ChipVariant = 'default' | 'selected' | 'outline-default' | 'outline-selected'
type ChipSize = 'sm' | 'md' | 'lg'
type ChipRounded = 'full' | 'md'

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ChipVariant
  size?: ChipSize
  rounded?: ChipRounded
  /** Выбран ли чип: переключает default → selected и outline-default → outline-selected. */
  selected?: boolean
}

const variants = {
  default: 'border-gray-200 bg-white text-primary-500 hover:bg-gray-50',
  selected: 'border-transparent bg-primary-500 text-white',
  'outline-default': 'border-border-default bg-transparent text-tertiary',
  'outline-selected': 'border-transparent bg-primary-500 text-white',
} as const

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-5 py-2 text-sm',
  lg: 'px-5 py-2 sm:px-6 sm:py-3 sm:text-base sm:font-semibold',
} as const

const radii = { full: 'rounded-full', md: 'rounded-[8px]' } as const

export function Chip({ className, selected, variant = 'default', size = 'md', rounded = 'full', ...props }: ChipProps) {
  const isOutline = variant === 'outline-default' || variant === 'outline-selected'
  const resolved: ChipVariant = selected ? (isOutline ? 'outline-selected' : 'selected') : variant

  return (
    <button
      type="button"

      aria-pressed={selected}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center border font-medium transition-colors',
        variants[resolved],
        sizes[size],
        radii[rounded],
        className,
      )}
      {...props}
    />
  )
}
