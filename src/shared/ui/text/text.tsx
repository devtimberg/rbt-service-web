import type { ComponentProps, ElementType } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './text.module.css'

/** Строчные и текстовые элементы: абзац, обёртка, жирный/важный, зачёркнутый (старая цена). */
export type TextElement = 'p' | 'span' | 'b' | 'strong' | 's' | 'em' | 'small' | 'del' | 'ins' | 'time'

const variants = {
  'body-lg': styles['body-lg'],
  'body-md': styles['body-md'],
  'body-sm': styles['body-sm'],
  'caption-md': styles['caption-md'],
  'caption-sm': styles['caption-sm'],
  'receipt-md': styles['receipt-md'],
  'receipt-sm': styles['receipt-sm'],
} as const

const weights = {
  regular: styles.regular,
  medium: styles.medium,
  semibold: styles.semibold,
  bold: styles.bold,
} as const

export type TextProps<T extends TextElement = 'p'> = ComponentProps<T> & {
  /** Элемент: `p` (по умолчанию), `span`, `b`, `strong`, `s` и т. д. */
  as?: T
  /** Текстовый стиль Figma (размер и высота строки); без него размер наследуется. */
  variant?: keyof typeof variants | undefined
  /** Начертание; без него наследуется. */
  weight?: keyof typeof weights | undefined
}

/**
 * Текст без своих стилей: рендерит `as` (по умолчанию `p`) с `className`, `ref`, `id`, `role` и прочим как есть.
 * Без `variant`/`weight` стилей нет; с ними добавляются классы текстовых стилей дизайн-системы.
 */
export function Text<T extends TextElement = 'p'>({ as, variant, weight, className, ...props }: TextProps<T>) {
  // Пропсы уже проверены по `ComponentProps<T>`; объединение тегов TS не сопоставляет с пропсами сам
  const Component = (as ?? 'p') as ElementType
  return (
    <Component
      className={cn(variant && variants[variant], weight && weights[weight], className) || undefined}
      {...props}
    />
  )
}

/** Перенос строки `<br />` внутри текста («Адрес:» и значение на новой строке). */
export function LineBreak(props: ComponentProps<'br'>) {
  return <br {...props} />
}
