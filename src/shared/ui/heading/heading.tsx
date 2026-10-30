import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './heading.module.css'

/** Размеры: h1–h6 по текстовым стилям дизайн-системы, xs–xl прежние; классы в heading.module.css (вместе с размером идут `cursor: default` и `currentColor`). */
const sizes = {
  h1: styles.h1,
  h2: styles.h2,
  h3: styles.h3,
  h4: styles.h4,
  h5: styles.h5,
  h6: styles.h6,
  xs: styles.xs,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
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
