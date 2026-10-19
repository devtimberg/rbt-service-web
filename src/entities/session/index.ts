// Публичный API сущности «сессия». Серверные модули (*.server.ts) сюда не экспортируются.
export {
  login,
  logout,
  logoutAll,
  passwordChange,
  passwordResetConfirm,
  passwordResetRequest,
  signupComplete,
  signupResendOtp,
  signupStart,
  signupVerify,
} from './api/auth.functions'
export { loadCurrentUser, sessionQuery, setSessionUser } from './api/session.query'
export { usePostLoginRedirect } from './lib/usePostLoginRedirect'
export { useSessionExpired } from './lib/useSessionExpired'
export { loginRedirectSearch } from './model/redirect'
export { resultMessage } from './model/result'
export {
  fieldErrors,
  loginSchema,
  OTP_LENGTH,
  passwordChangeSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  signupCompleteSchema,
  signupStartSchema,
  signupVerifySchema,
} from './model/schemas'
export type { SessionUser } from './model/types'
export { AuthShell } from './ui/AuthShell'
