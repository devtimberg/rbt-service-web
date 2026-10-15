"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
} from "@/shared/ui/kit";
import { cn } from "@/shared/lib/utils";

/** Общая обёртка экранов авторизации: заголовок, подпись, тело формы. */
export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Container className="flex max-w-md flex-col gap-6 px-3 sm:px-0">
      <VStack gap={2}>
        <Heading size="lg">{title}</Heading>
        {description ? (
          <Text
            variant="secondary"
            size="sm"
          >
            {description}
          </Text>
        ) : null}
      </VStack>

      {children}

      {footer ? <VStack gap={3}>{footer}</VStack> : null}
    </Container>
  );
}

/** Форма авторизации. `noValidate` обязателен: нативные подсказки браузера
 * («Заполните это поле», «Введите адрес электронной почты») не переводятся,
 * не совпадают со стилем приложения и перебивают наши сообщения от zod. */
export function AuthForm({
  action,
  children,
}: {
  action: (formData: FormData) => void;
  children: ReactNode;
}) {
  return (
    <form
      action={action}
      noValidate
    >
      {children}
    </form>
  );
}

/** Контролируемые значения полей формы.
 *
 * React 19 сбрасывает неконтролируемую форму после успешного выполнения
 * `action` — при ошибке от сервера пользователь терял бы введённое.
 * Здесь значения живут в состоянии, поэтому переживают ответ действия. */
export function useFormValues<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial);

  function bind(name: keyof T & string) {
    return {
      value: values[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        setValues((current) => ({ ...current, [name]: event.target.value })),
    };
  }

  return { values, bind };
}

export function Field({
  label,
  name,
  error,
  hint,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  label: string;
  name: string;
  error?: string;
  hint?: string;
}) {
  const errorId = `${name}-error`;
  return (
    <VStack gap={1.5}>
      <label
        htmlFor={name}
        className="text-secondary text-sm font-medium"
      >
        {label}
      </label>
      <Input
        id={name}
        name={name}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn("h-12 rounded-2xl", className)}
        {...props}
      />
      {error ? (
        <Text
          id={errorId}
          variant="error"
          size="xs"
        >
          {error}
        </Text>
      ) : hint ? (
        <Text
          variant="secondary"
          size="xs"
        >
          {hint}
        </Text>
      ) : null}
    </VStack>
  );
}

/** Поле одноразового кода: только цифры, фиксированная длина. */
export function OtpField({
  error,
  length,
  ...props
}: React.ComponentProps<"input"> & { error?: string; length: number }) {
  return (
    <Field
      label="Код из письма"
      name="code"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern={`\\d{${length}}`}
      maxLength={length}
      placeholder={"0".repeat(length)}
      error={error}
      className="text-center text-lg tracking-[0.5em]"
      {...props}
    />
  );
}

export function FormAlert({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text
      role="alert"
      variant="error"
      size="sm"
      className="bg-destructive/10 rounded-2xl px-4 py-3"
    >
      {message}
    </Text>
  );
}

/** Кнопка отправки, привязанная к состоянию родительской формы. */
export function SubmitButton({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="full"
      className="h-12"
      loading={pending}
      {...props}
    >
      {children}
    </Button>
  );
}
