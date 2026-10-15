import { describe, expect, it } from 'vite-plus/test'
import {
  fieldErrors,
  loginSchema,
  OTP_LENGTH,
  passwordResetConfirmSchema,
  signupCompleteSchema,
  signupVerifySchema,
} from './schemas'

describe('схемы авторизации', () => {
  it('email нормализуется: trim и нижний регистр', () => {
    const parsed = loginSchema.parse({ email: '  User@Mail.RU ', password: 'x' })
    expect(parsed.email).toBe('user@mail.ru')
  })

  it('пустой и некорректный email дают разные сообщения', () => {
    const empty = loginSchema.safeParse({ email: '  ', password: 'x' })
    const bad = loginSchema.safeParse({ email: 'abc', password: 'x' })
    expect(!empty.success && fieldErrors(empty.error)).toEqual({ email: 'Введите email' })
    expect(!bad.success && fieldErrors(bad.error)).toEqual({ email: 'Некорректный email' })
  })

  it('пустой пароль при входе отклоняется', () => {
    const result = loginSchema.safeParse({ email: 'a@b.ru', password: '' })
    expect(!result.success && fieldErrors(result.error)).toEqual({ password: 'Введите пароль' })
  })

  it('код: ровно OTP_LENGTH цифр', () => {
    expect(signupVerifySchema.safeParse({ email: 'a@b.ru', code: '1'.repeat(OTP_LENGTH) }).success).toBe(true)
    const short = signupVerifySchema.safeParse({ email: 'a@b.ru', code: '123' })
    expect(!short.success && fieldErrors(short.error)).toEqual({ code: `Код состоит из ${OTP_LENGTH} цифр` })
    expect(signupVerifySchema.safeParse({ email: 'a@b.ru', code: 'abcdef' }).success).toBe(false)
  })

  it('регистрация: пароли не совпадают, имя обрезается', () => {
    const base = { ticket: 't', firstName: ' Иван ', lastName: 'Петров', password: 'password1' }
    const mismatch = signupCompleteSchema.safeParse({ ...base, passwordConfirm: 'password2' })
    expect(!mismatch.success && fieldErrors(mismatch.error)).toEqual({ passwordConfirm: 'Пароли не совпадают' })
    const ok = signupCompleteSchema.parse({ ...base, passwordConfirm: 'password1' })
    expect(ok.firstName).toBe('Иван')
  })

  it('короткий пароль отклоняется', () => {
    const result = signupCompleteSchema.safeParse({
      ticket: 't',
      firstName: 'И',
      lastName: 'П',
      password: '123',
      passwordConfirm: '123',
    })
    expect(!result.success && fieldErrors(result.error).password).toBe('Пароль должен быть не короче 8 символов')
  })

  it('сброс пароля: несовпадение паролей', () => {
    const result = passwordResetConfirmSchema.safeParse({
      email: 'a@b.ru',
      code: '123456',
      newPassword: 'password1',
      passwordConfirm: 'other',
    })
    expect(!result.success && fieldErrors(result.error)).toEqual({ passwordConfirm: 'Пароли не совпадают' })
  })

  it('fieldErrors оставляет первое сообщение по каждому полю', () => {
    const result = signupCompleteSchema.safeParse({
      ticket: 't',
      firstName: '',
      lastName: '',
      password: '1',
      passwordConfirm: '2',
    })
    const errors = !result.success ? fieldErrors(result.error) : {}
    expect(errors.firstName).toBe('Введите имя')
    expect(errors.lastName).toBe('Введите фамилию')
  })
})
