import type { ComponentProps } from 'react'

/**
 * Форма `form` без своих стилей и поведения: `onSubmit`, `action`/`method`, `noValidate` и прочее как есть.
 * `preventDefault` вызывает обработчик сам (у поиска в шапке обычная GET-отправка).
 */
export function Form(props: ComponentProps<'form'>) {
  return <form {...props} />
}
