import { useState, type ChangeEvent } from 'react'

/** Контролируемые значения полей формы: введённое не теряется при ошибке ответа.
 * `bind(name)` отдаёт `value` и `onChange` для поля. */
export function useFormValues<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial)

  function bind(name: keyof T & string) {
    return {
      value: values[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        setValues((current) => ({ ...current, [name]: event.target.value })),
    }
  }

  function reset() {
    setValues(initial)
  }

  return { values, bind, reset }
}
