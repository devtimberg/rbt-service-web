import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * Размеры заголовков этого проекта (tokens.css не задаёт text-h*, поэтому размер, высота строки и жирность
 * лежат здесь). Вместе с размером идут `cursor-default text-current`, как у прежнего Heading.
 */
const sizes = {
  xs: 'cursor-default text-current text-[14px] leading-[18px] font-medium',
  sm: 'cursor-default text-current text-[18px] font-medium',
  md: 'cursor-default text-current text-[20px] font-medium',
  lg: 'cursor-default text-current text-[21px] leading-[28px] font-semibold sm:text-[24px] sm:leading-[38px]',
  xl: 'cursor-default text-current text-[40px] leading-[48px] font-semibold',
} as const

export type HeadingProps = ComponentProps<'h2'> & {
  /** Уровень в структуре документа: 1–6 → h1–h6. Не связан с видом. */
  level: 1 | 2 | 3 | 4 | 5 | 6
  /** Визуальный размер; без него стилей нет, вид задаёт `className`. */
  size?: keyof typeof sizes | undefined
}

/** Заголовок `h1`–`h6` без своих стилей (кроме `size`, если он задан). */
export function Heading({ level, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const
  return <Tag className={size ? cn(sizes[size], className) : className} {...props} />
}
