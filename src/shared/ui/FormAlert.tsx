import { Text } from './Text'

/** Ошибка формы целиком (от бэкенда или сети). Без сообщения ничего не рисует. */
export function FormAlert({ message }: { message?: string | undefined }) {
  if (!message) return null
  return (
    <Text
      role="alert"
      className="cursor-default font-normal text-input-error-message leading-5! text-sm bg-destructive/10 rounded-2xl px-4 py-3"
    >
      {message}
    </Text>
  )
}
