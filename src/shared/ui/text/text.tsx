import type { ComponentProps, ElementType } from 'react'

/** Строчные и текстовые элементы: абзац, обёртка, жирный/важный, зачёркнутый (старая цена). */
export type TextElement = 'p' | 'span' | 'b' | 'strong' | 's' | 'em' | 'small' | 'del' | 'ins' | 'time'

export type TextProps<T extends TextElement = 'p'> = ComponentProps<T> & {
  /** Элемент: `p` (по умолчанию), `span`, `b`, `strong`, `s` и т. д. */
  as?: T
}

/**
 * Текст без своих стилей: рендерит `as` (по умолчанию `p`) с `className`, `ref`, `id`, `role` и прочим как есть.
 * Типографика задаётся классами (`text-caption font-medium` и т. п.), как и раньше на голом элементе.
 */
export function Text<T extends TextElement = 'p'>({ as, ...props }: TextProps<T>) {
  // Пропсы уже проверены по `ComponentProps<T>`; объединение тегов TS не сопоставляет с пропсами сам
  const Component = (as ?? 'p') as ElementType
  return <Component {...props} />
}

/** Перенос строки `<br />` внутри текста («Адрес:» и значение на новой строке). */
export function LineBreak(props: ComponentProps<'br'>) {
  return <br {...props} />
}
