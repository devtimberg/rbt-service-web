import type { ComponentProps, ElementType } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './Box.module.css'

/** Блочные элементы, которые рисует `Box`/`Stack`. Строчные обёртки (`span`) — это `Text as="span"`. */
export type BoxElement = 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav'

export type BoxProps<T extends BoxElement = 'div'> = ComponentProps<T> & {
  /** Элемент для семантики: `section`, `nav`, `header` и т. д. По умолчанию `div`. */
  as?: T
}

/**
 * Блок без своих стилей: рендерит `as` (по умолчанию `div`) и отдаёт ему `className`, `ref`, `aria-*` и
 * обработчики как есть. Нужен, чтобы разметка вне shared/ui не писала голые HTML-элементы.
 */
export function Box<T extends BoxElement = 'div'>({ as, ...props }: BoxProps<T>) {
  // Пропсы уже проверены по `ComponentProps<T>`; объединение тегов TS не сопоставляет с пропсами сам
  const Component = (as ?? 'div') as ElementType
  return <Component {...props} />
}

const gaps = {
  0: styles.gap0,
  0.5: styles.gap0_5,
  1: styles.gap1,
  1.5: styles.gap1_5,
  2: styles.gap2,
  3: styles.gap3,
  4: styles.gap4,
  5: styles.gap5,
  6: styles.gap6,
  8: styles.gap8,
  10: styles.gap10,
  12: styles.gap12,
} as const

const aligns = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  baseline: styles.alignBaseline,
  stretch: styles.alignStretch,
} as const

const justifies = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
} as const

export type StackProps<T extends BoxElement = 'div'> = BoxProps<T> & {
  /** column: колонка (по умолчанию), row: строка. */
  direction?: 'column' | 'row'
  /** Зазор по шкале Tailwind: 4 → `gap-4` (16px). Адаптивные зазоры — через `className` (`tablet:gap-6`). */
  gap?: keyof typeof gaps
  align?: keyof typeof aligns
  justify?: keyof typeof justifies
  wrap?: boolean
}

/**
 * Flex-колонка или строка: классы модуля из пропсов (зазор, выравнивание, перенос). Tailwind-классы из `className`
 * идут следом и перекрывают модуль (`md:flex-row`, `hidden` и т. п.).
 */
export function Stack<T extends BoxElement = 'div'>({
  as,
  direction = 'column',
  gap,
  align,
  justify,
  wrap = false,
  className,
  ...props
}: StackProps<T>) {
  const Component = (as ?? 'div') as ElementType
  return (
    <Component
      {...props}
      className={cn(
        styles.stack,
        direction === 'column' && styles.column,
        gap !== undefined && gaps[gap],
        align && aligns[align],
        justify && justifies[justify],
        wrap && styles.wrap,
        className,
      )}
    />
  )
}
