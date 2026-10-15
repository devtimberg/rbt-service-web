import { z } from "zod";

/** Длина OTP — `OTP_LENGTH` в `apps/authentications/services/otp.py`. */
export const OTP_LENGTH = 6;

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Введите email")
  .email("Некорректный email")
  .transform((value) => value.toLowerCase());

/** Полную проверку пароля делает Django-валидатор на бэкенде и возвращает
 * список требований в `details`. Здесь — только минимум, чтобы не гонять
 * заведомо пустой запрос. */
export const passwordSchema = z
  .string()
  .min(8, "Пароль должен быть не короче 8 символов");

export const otpSchema = z
  .string()
  .trim()
  .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `Код состоит из ${OTP_LENGTH} цифр`);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Введите пароль"),
});

export const signupStartSchema = z.object({ email: emailSchema });

export const signupVerifySchema = z.object({
  email: emailSchema,
  code: otpSchema,
});

export const signupCompleteSchema = z
  .object({
    ticket: z.string().min(1),
    firstName: z.string().trim().min(1, "Введите имя"),
    lastName: z.string().trim().min(1, "Введите фамилию"),
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Пароли не совпадают",
  });

export const passwordResetRequestSchema = z.object({ email: emailSchema });

export const passwordResetConfirmSchema = z
  .object({
    email: emailSchema,
    code: otpSchema,
    newPassword: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Пароли не совпадают",
  });

/** Первое сообщение по каждому полю — форма показывает по одной ошибке. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in result)) {
      result[key] = issue.message;
    }
  }
  return result;
}
