import type { ComponentProps, ElementType } from 'react'
import { cn } from '@/shared/lib/cn'

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
  0: 'gap-0',
  0.5: 'gap-0.5',
  1: 'gap-1',
  1.5: 'gap-1.5',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
} as const

const aligns = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
} as const

const justifies = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
} as const

export type StackProps<T extends BoxElement = 'div'> = BoxProps<T> & {
  /** column: `flex-col` (по умолчанию), row: строка. */
  direction?: 'column' | 'row'
  /** Зазор по шкале Tailwind: 4 → `gap-4` (16px). Адаптивные зазоры — через `className` (`tablet:gap-6`). */
  gap?: keyof typeof gaps
  align?: keyof typeof aligns
  justify?: keyof typeof justifies
  wrap?: boolean
}

/**
 * Flex-колонка или строка: `flex` + `flex-col` (или ничего для строки) + `gap-*`/`items-*`/`justify-*` из пропсов.
 * Классы из `className` склеиваются через `cn` и перекрывают пропсы (`tablet:flex-row` и т. п.).
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
        'flex',
        direction === 'column' && 'flex-col',
        gap !== undefined && gaps[gap],
        align && aligns[align],
        justify && justifies[justify],
        wrap && 'flex-wrap',
        className,
      )}
    />
  )
}
