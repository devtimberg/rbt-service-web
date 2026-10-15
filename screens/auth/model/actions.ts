"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { authApi, ApiError, toUserMessage } from "@/shared/api";
import { ROUTES } from "@/shared/lib/route-paths";
import { formError, type AuthFormState } from "./form-state";
import {
  fieldErrors,
  loginSchema,
  passwordResetConfirmSchema,
  passwordResetRequestSchema,
  signupCompleteSchema,
  signupStartSchema,
  signupVerifySchema,
} from "./schemas";

/** NextAuth оборачивает ошибку из `authorize` в `CredentialsSignin`,
 * машинный код бэкенда доезжает в поле `code`. */
function signinErrorMessage(error: AuthError): string {
  const code = (error as { code?: string }).code;
  if (!code || code === "credentials") {
    return "Неверный email или пароль";
  }
  if (code === "network_error") {
    return "Не удалось связаться с сервером";
  }
  return toUserMessage(new ApiError(400, { code, message: code }));
}

// --- Вход ---

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error) };
  }

  const callbackUrl = String(formData.get("callbackUrl") || ROUTES.PROFILE);
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return formError(signinErrorMessage(error));
    }
    throw error;
  }
  return { status: "success", redirectTo: safeCallbackUrl(callbackUrl) };
}

export async function logoutAction() {
  await signOut({ redirectTo: ROUTES.HOME });
}

// --- Регистрация ---

export async function signupStartAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupStartSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error) };
  }

  try {
    const info = await authApi.signupStart(parsed.data.email);
    return { status: "success", resendIn: info.nextResendIn };
  } catch (error) {
    return apiFormError(error);
  }
}

export async function signupResendAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupStartSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error) };
  }

  try {
    const info = await authApi.signupResendOtp(parsed.data.email);
    return { status: "success", resendIn: info.nextResendIn };
  } catch (error) {
    return apiFormError(error);
  }
}

export async function signupVerifyAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupVerifySchema.safeParse({
    email: formData.get("email"),
    code: formData.get("code"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error) };
  }

  try {
    const { ticket } = await authApi.signupVerify(
      parsed.data.email,
      parsed.data.code,
    );
    return { status: "success", ticket };
  } catch (error) {
    return apiFormError(error);
  }
}

/** Завершает регистрацию через провайдер `signup`: бэкенд создаёт пользователя
 * и сразу отдаёт сессию, повторный вход по паролю не нужен. */
export async function signupCompleteAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupCompleteSchema.safeParse({
    ticket: formData.get("ticket"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error) };
  }

  try {
    await signIn("signup", {
      ticket: parsed.data.ticket,
      password: parsed.data.password,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return formError(signinErrorMessage(error));
    }
    throw error;
  }
  return { status: "success", redirectTo: ROUTES.PROFILE };
}

// --- Восстановление пароля ---

export async function passwordResetRequestAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = passwordResetRequestSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error) };
  }

  try {
    const info = await authApi.passwordResetRequest(parsed.data.email);
    return { status: "success", resendIn: info.nextResendIn };
  } catch (error) {
    return apiFormError(error);
  }
}

export async function passwordResetConfirmAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = passwordResetConfirmSchema.safeParse({
    email: formData.get("email"),
    code: formData.get("code"),
    newPassword: formData.get("newPassword"),
    passwordConfirm: formData.get("passwordConfirm"),
  });
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error) };
  }

  try {
    await authApi.passwordResetConfirm({
      email: parsed.data.email,
      code: parsed.data.code,
      newPassword: parsed.data.newPassword,
    });
    return { status: "success" };
  } catch (error) {
    return apiFormError(error);
  }
}

// --- helpers ---

function apiFormError(error: unknown): AuthFormState {
  const message = toUserMessage(error);
  if (error instanceof ApiError && error.isRateLimited) {
    return formError(message, { resendIn: error.retryIn });
  }
  return formError(message);
}

/** Пускаем в редирект только внутренние пути — иначе `?callbackUrl=` станет
 * open redirect на чужой домен. */
function safeCallbackUrl(value: string): string {
  return value.startsWith("/") && !value.startsWith("//")
    ? value
    : ROUTES.PROFILE;
}
