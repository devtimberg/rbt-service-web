import type { ComponentProps } from 'react'

/*
 * Примитивы полей формы без своих стилей. Готовые поля с подписью (`TextField`, `Select`, `SearchField`, `Checkbox`)
 * рисуют подпись сами; эти нужны, когда поле собрано вручную.
 */

/** Подпись `label`: связь с полем через `htmlFor` или вложенностью поля внутрь. */
export function Label(props: ComponentProps<'label'>) {
  // oxlint-disable-next-line jsx-a11y/label-has-associated-control -- связь задаёт вызывающий код (htmlFor или поле внутри)
  return <label {...props} />
}

/** Группа полей `fieldset` (радио-карточки, блок адреса). Название группы — `Legend` первым ребёнком. */
export function Fieldset(props: ComponentProps<'fieldset'>) {
  return <fieldset {...props} />
}

/** Название группы `legend`. */
export function Legend(props: ComponentProps<'legend'>) {
  return <legend {...props} />
}

/** Живой статус `output` (role=status): «Товар в корзине», «Ничего не найдено». */
export function Output(props: ComponentProps<'output'>) {
  return <output {...props} />
}
