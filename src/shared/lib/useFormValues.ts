import { useState, type ChangeEvent } from 'react'

type FieldErrors = Record<string, string>

/** Контролируемые значения полей формы: введённое не теряется при ошибке ответа, а правка поля
 * убирает ошибку именно этого поля.
 *
 * - `bind(name)` отдаёт `value` и `onChange` для поля.
 * - `setErrors(next)` вызывается при отправке: кладёт клиентские (zod) ошибки и заново «взводит» серверные.
 * - `fieldError(name, serverErrors?)` возвращает ошибку поля: клиентская, иначе серверная; после правки поля — ничего.
 * Общую плашку формы (FormAlert) механизм не трогает. */
export function useFormValues<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial)
  const [errors, setErrorsState] = useState<FieldErrors>({})
  // Поля, правленные после последней отправки: их серверные ошибки уже неактуальны
  const [edited, setEdited] = useState<ReadonlySet<string>>(new Set())

  function bind(name: keyof T & string) {
    return {
      value: values[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setValues((current) => ({ ...current, [name]: value }))
        setErrorsState((current) => {
          if (!(name in current)) return current
          const { [name]: _removed, ...rest } = current
          return rest
        })
        setEdited((current) => (current.has(name) ? current : new Set(current).add(name)))
      },
    }
  }

  function setErrors(next: FieldErrors) {
    setErrorsState(next)
    setEdited(new Set())
  }

  function fieldError(name: keyof T & string, serverErrors?: FieldErrors): string | undefined {
    return errors[name] ?? (edited.has(name) ? undefined : serverErrors?.[name])
  }

  function reset() {
    setValues(initial)
    setErrors({})
  }

  return { values, bind, reset, errors, setErrors, fieldError }
}
