/** Общий контракт состояния для всех форм авторизации (`useActionState`). */
export type AuthFormState = {
  status: "idle" | "error" | "success";
  /** Ошибка формы целиком (от бэкенда или сети). */
  message?: string;
  /** Ошибки по конкретным полям (клиентская валидация zod). */
  fieldErrors?: Record<string, string>;
  /** Секунды до следующей разрешённой отправки кода (429 или nextResendIn). */
  resendIn?: number;
  /** Одноразовый ticket после успешной проверки OTP при регистрации. */
  ticket?: string;
  /** Куда уйти после успешного входа. Переход делает клиент: `redirect()` из
   * server action не перерисовывает слот параллельного роута `@sheet` —
   * он откатывается на `default.tsx`, и лист остаётся пустым. */
  redirectTo?: string;
};

export const IDLE_FORM_STATE: AuthFormState = { status: "idle" };

export function formError(
  message: string,
  extra: Partial<AuthFormState> = {},
): AuthFormState {
  return { status: "error", message, ...extra };
}
