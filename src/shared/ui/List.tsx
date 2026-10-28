import type { ComponentProps, ElementType } from 'react'

export type ListProps<T extends 'ul' | 'ol' = 'ul'> = ComponentProps<T> & {
  /** `ul` (по умолчанию) или `ol` (нумерованный, хлебные крошки). */
  as?: T
}

/** Список без своих стилей (маркеры и отступы сбрасывает reset.css). */
export function List<T extends 'ul' | 'ol' = 'ul'>({ as, ...props }: ListProps<T>) {
  // Пропсы уже проверены по `ComponentProps<T>`; объединение тегов TS не сопоставляет с пропсами сам
  const Component = (as ?? 'ul') as ElementType
  return <Component {...props} />
}

/** Пункт списка `li` без своих стилей. */
export function ListItem(props: ComponentProps<'li'>) {
  return <li {...props} />
}
