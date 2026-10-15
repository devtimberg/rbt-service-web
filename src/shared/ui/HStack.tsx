import type { CSSProperties, HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type HStackProps = HTMLAttributes<HTMLDivElement> & {
  /** Число: шаг сетки Tailwind (gap * 0.25rem), строка: любое CSS-значение. */
  gap?: number | string
}

export function HStack({ className, gap, style, ...props }: HStackProps) {
  const resolvedGap = typeof gap === 'number' ? `${gap * 0.25}rem` : gap
  const mergedStyle: CSSProperties | undefined = gap === undefined ? style : { ...style, gap: resolvedGap }

  return <div data-slot="h-stack" className={cn('flex flex-row', className)} style={mergedStyle} {...props} />
}
