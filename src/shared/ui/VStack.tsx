import type { CSSProperties, HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type VStackProps = HTMLAttributes<HTMLDivElement> & {
  /** Число: шаг сетки Tailwind (gap * 0.25rem), строка: любое CSS-значение. */
  gap?: number | string
}

export function VStack({ className, gap, style, ...props }: VStackProps) {
  const resolvedGap = typeof gap === 'number' ? `${gap * 0.25}rem` : gap
  const mergedStyle: CSSProperties | undefined = gap === undefined ? style : { ...style, gap: resolvedGap }

  return <div data-slot="v-stack" className={cn('flex flex-col', className)} style={mergedStyle} {...props} />
}
