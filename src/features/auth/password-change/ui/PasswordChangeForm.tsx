import { useState, type FormEvent } from 'react'
import { fieldErrors, passwordChangeSchema, resultMessage } from '@/entities/session'
import { useFormValues } from '@/shared/lib/useFormValues'
import { Stack } from '@/shared/ui/Box'
import { Button } from '@/shared/ui/Button'
import { Output } from '@/shared/ui/Field'
import { Form } from '@/shared/ui/Form'
import { FormAlert } from '@/shared/ui/FormAlert'
import { TextField } from '@/shared/ui/TextField'
import { usePasswordChange } from '../model/usePasswordChange'
import styles from './PasswordChangeForm.module.css'

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
    <Form onSubmit={handleSubmit} noValidate aria-label="Смена пароля">
      <Stack gap={4}>
        <TextField
          label="Текущий пароль"
          name="oldPassword"
          type="password"
          autoComplete="current-password"
          error={fieldError('oldPassword', serverFields)}
          {...bind('oldPassword')}
        />
        <TextField
          label="Новый пароль"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          error={fieldError('newPassword', serverFields)}
          {...bind('newPassword')}
        />
        <FormAlert message={alert} />
        {done ? <Output className={styles.done}>Пароль изменён</Output> : null}
        <Button type="submit" size="full" className={styles.submit} loading={mutation.isPending}>
          Сменить пароль
        </Button>
      </Stack>
    </Form>
  )
}
