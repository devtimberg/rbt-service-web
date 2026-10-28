import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './Chip.module.css'

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
  default: styles.variantDefault,
  selected: styles.variantSelected,
  'outline-default': styles.variantOutlineDefault,
  'outline-selected': styles.variantOutlineSelected,
} as const

const sizes = { sm: styles.sizeSm, md: styles.sizeMd, lg: styles.sizeLg } as const

const radii = { full: styles.roundedFull, md: styles.roundedMd } as const

export function Chip({ className, selected, variant = 'default', size = 'md', rounded = 'full', ...props }: ChipProps) {
  const isOutline = variant === 'outline-default' || variant === 'outline-selected'
  const resolved: ChipVariant = selected ? (isOutline ? 'outline-selected' : 'selected') : variant

  return (
    <button
      type="button"

      aria-pressed={selected}
      className={cn(styles.root, variants[resolved], sizes[size], radii[rounded], className)}
      {...props}
    />
  )
}
