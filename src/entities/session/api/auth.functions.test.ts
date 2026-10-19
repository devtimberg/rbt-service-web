// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import * as authApi from './auth-api.server'
import * as fns from './auth.functions'

// createServerFn подменён: handler вызывается напрямую с { data }.
vi.mock('@tanstack/react-start', () => {
  const builder = { validator: () => builder, handler: (fn: unknown) => fn }
  return { createServerFn: () => builder }
})
vi.mock('./auth-actions.server', () => ({}))
vi.mock('./auth-api.server', () => ({
  signupStart: vi.fn(),
  signupResendOtp: vi.fn(),
  signupVerify: vi.fn(),
  passwordResetRequest: vi.fn(),
  passwordResetConfirm: vi.fn(),
}))
vi.mock('./session.server', () => ({
  getClientMeta: vi.fn(() => ({ userAgent: 'UA', ip: '1.2.3.4' })),
  writeSession: vi.fn(),
}))

const meta = { userAgent: 'UA', ip: '1.2.3.4' }
const call = (fn: unknown, data: unknown) => (fn as (a: { data: unknown }) => Promise<unknown>)({ data })

beforeEach(() => vi.resetAllMocks())

describe('OTP-функции передают UA и IP клиента (иначе лимит API считается по IP сервера)', () => {
  it('signupStart, signupResendOtp, passwordResetRequest', async () => {
    const info = { nextResendIn: 60 }
    vi.mocked(authApi.signupStart).mockResolvedValue(info as never)
    vi.mocked(authApi.signupResendOtp).mockResolvedValue(info as never)
    vi.mocked(authApi.passwordResetRequest).mockResolvedValue(info as never)
    await call(fns.signupStart, { email: 'a@b.ru' })
    await call(fns.signupResendOtp, { email: 'a@b.ru' })
    await call(fns.passwordResetRequest, { email: 'a@b.ru' })
    expect(authApi.signupStart).toHaveBeenCalledWith('a@b.ru', meta)
    expect(authApi.signupResendOtp).toHaveBeenCalledWith('a@b.ru', meta)
    expect(authApi.passwordResetRequest).toHaveBeenCalledWith('a@b.ru', meta)
  })

  it('signupVerify, passwordResetConfirm', async () => {
    vi.mocked(authApi.signupVerify).mockResolvedValue({ ticket: 't' } as never)
    await call(fns.signupVerify, { email: 'a@b.ru', code: '123456' })
    await call(fns.passwordResetConfirm, { email: 'a@b.ru', code: '123456', newPassword: 'p' })
    expect(authApi.signupVerify).toHaveBeenCalledWith('a@b.ru', '123456', meta)
    expect(authApi.passwordResetConfirm).toHaveBeenCalledWith(
      { email: 'a@b.ru', code: '123456', newPassword: 'p' },
      meta,
    )
  })
})
