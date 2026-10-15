import { useState, type FormEvent } from 'react'
import { fieldErrors, passwordChangeSchema, resultMessage } from '@/entities/session'
import { useFormValues } from '@/shared/lib/useFormValues'
import { Button } from '@/shared/ui/Button'
import { Field } from '@/shared/ui/Field'
import { FormAlert } from '@/shared/ui/FormAlert'
import { VStack } from '@/shared/ui/VStack'
import { usePasswordChange } from '../model/usePasswordChange'

const EMPTY = { oldPassword: '', newPassword: '' }

/** Форма смены пароля: текущий и новый пароль. Ошибки валидатора бэкенда показываем у нового пароля,
 * неверный текущий пароль у своего поля, остальное общей плашкой. */
export function PasswordChangeForm() {
  const mutation = usePasswordChange()
  const { values, bind, reset, setErrors, fieldError } = useFormValues(EMPTY)
  const [done, setDone] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDone(false)
    const parsed = passwordChangeSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }
    setErrors({})
    mutation.mutate(parsed.data, {
      onSuccess: (result) => {
        if (result.ok) {
          reset()
          setDone(true)
        }
      },
    })
  }

  const failure = mutation.data && !mutation.data.ok ? mutation.data : undefined
  const serverFields = failure?.fieldErrors ?? {}
  // Общая плашка только если ошибка не привязана к полю
  const alert = Object.keys(serverFields).length > 0 ? undefined : resultMessage(mutation.data, mutation.error)

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Смена пароля">
      <VStack gap={4}>
        <Field
          label="Текущий пароль"
          name="oldPassword"
          type="password"
          autoComplete="current-password"
          error={fieldError('oldPassword', serverFields)}
          {...bind('oldPassword')}
        />
        <Field
          label="Новый пароль"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          error={fieldError('newPassword', serverFields)}
          {...bind('newPassword')}
        />
        <FormAlert message={alert} />
        {done ? <output className="text-center text-sm">Пароль изменён</output> : null}
        <Button type="submit" size="full" className="h-12" loading={mutation.isPending}>
          Сменить пароль
        </Button>
      </VStack>
    </form>
  )
}
