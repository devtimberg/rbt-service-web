// Публичный API сущности «сессия». Серверные модули (*.server.ts) сюда не экспортируются.
export {
  getCurrentUser,
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
export { loadCurrentUser, sessionKeys, sessionQuery, setSessionUser } from './api/session.query'
export { usePostLoginRedirect } from './lib/usePostLoginRedirect'
export { safeRedirectPath } from './model/redirect'
export { accessTokenExpiresAt, isAccessTokenFresh, REFRESH_SKEW_MS } from './model/refresh'
export { failureFrom, resultMessage, type ActionFailure, type ActionResult, type ActionSuccess } from './model/result'
export {
  emailSchema,
  fieldErrors,
  loginSchema,
  OTP_LENGTH,
  otpSchema,
  passwordChangeSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  passwordSchema,
  signupCompleteSchema,
  signupStartSchema,
  signupVerifySchema,
} from './model/schemas'
export type { SessionData, SessionUser } from './model/types'
export { AuthShell } from './ui/AuthShell'
