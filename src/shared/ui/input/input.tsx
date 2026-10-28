import type { ComponentProps } from 'react'

/**
 * Голое поле `input` без своих стилей — для поля внутри рамки, которую рисует вызывающий компонент
 * (плашка промокода, прозрачный `type="range"` поверх нарисованной шкалы). Для обычных полей есть
 * `TextField`, `SearchField`, `SearchBar`, `InputButton`, `NumberInput`, `Checkbox`, `Radio`, `Switch`.
 * Доступное имя обязательно: `aria-label`, `aria-labelledby` или `Label` с `htmlFor`.
 */
export function Input(props: ComponentProps<'input'>) {
  return <input {...props} />
}
