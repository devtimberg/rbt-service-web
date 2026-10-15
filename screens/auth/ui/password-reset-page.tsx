"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { Button, Text, VStack } from "@/shared/ui/kit";
import { ROUTES } from "@/shared/lib/route-paths";
import {
  passwordResetConfirmAction,
  passwordResetRequestAction,
} from "../model/actions";
import { IDLE_FORM_STATE } from "../model/form-state";
import { OTP_LENGTH } from "../model/schemas";
import { useResendCountdown } from "../model/use-resend-countdown";
import {
  AuthForm,
  AuthShell,
  Field,
  FormAlert,
  OtpField,
  SubmitButton,
  useFormValues,
} from "./auth-form-parts";

type Step = "request" | "confirm" | "done";

export function PasswordResetPage() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [resendIn, setResendIn] = useState(0);

  if (step === "confirm") {
    return (
      <ConfirmStep
        email={email}
        initialResendIn={resendIn}
        backAction={() => setStep("request")}
        doneAction={() => setStep("done")}
      />
    );
  }

  if (step === "done") {
    return (
      <AuthShell
        title="Пароль обновлён"
        description="Все прежние сессии завершены — войдите с новым паролем."
      >
        <Button asChild>
          <Link href={ROUTES.LOGIN}>Перейти ко входу</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <RequestStep
      submittedAction={(value, nextResendIn) => {
        setEmail(value);
        setResendIn(nextResendIn);
        setStep("confirm");
      }}
    />
  );
}

function RequestStep({
  submittedAction,
}: {
  submittedAction: (email: string, resendIn: number) => void;
}) {
  const [state, formAction] = useActionState(
    passwordResetRequestAction,
    IDLE_FORM_STATE,
  );
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (state.status === "success") {
      submittedAction(email, state.resendIn ?? 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <AuthShell
      title="Восстановление пароля"
      description="Отправим код для смены пароля на указанный email"
      footer={
        <Text
          variant="secondary"
          size="sm"
          className="text-center"
        >
          Вспомнили пароль?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="text-link font-medium"
          >
            Войти
          </Link>
        </Text>
      }
    >
      <AuthForm action={formAction}>
        <VStack gap={4}>
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={state.fieldErrors?.email}
          />
          <FormAlert message={state.message} />
          <SubmitButton>Отправить код</SubmitButton>
        </VStack>
      </AuthForm>
    </AuthShell>
  );
}

function ConfirmStep({
  email,
  initialResendIn,
  backAction,
  doneAction,
}: {
  email: string;
  initialResendIn: number;
  backAction: () => void;
  doneAction: () => void;
}) {
  const [state, formAction] = useActionState(
    passwordResetConfirmAction,
    IDLE_FORM_STATE,
  );
  const [resendState, resendAction] = useActionState(
    passwordResetRequestAction,
    IDLE_FORM_STATE,
  );
  const { canResend, label } = useResendCountdown(
    resendState.resendIn ?? initialResendIn,
  );
  const { bind } = useFormValues({
    code: "",
    newPassword: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    if (state.status === "success") {
      doneAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <AuthShell
      title="Новый пароль"
      // Бэкенд не раскрывает, зарегистрирован ли email, — формулировка нейтральная.
      description={`Если аккаунт с ${email} существует, на него отправлен код из ${OTP_LENGTH} цифр. Он действует 5 минут.`}
      footer={
        <>
          <form action={resendAction}>
            <input
              type="hidden"
              name="email"
              value={email}
            />
            <VStack gap={2}>
              <Button
                type="submit"
                variant="link"
                className="mx-auto"
                disabled={!canResend}
              >
                {canResend ? "Отправить код заново" : `Повторно через ${label}`}
              </Button>
              <FormAlert message={resendState.message} />
            </VStack>
          </form>
          <Button
            variant="link"
            className="mx-auto"
            onClick={backAction}
          >
            Изменить email
          </Button>
        </>
      }
    >
      <AuthForm action={formAction}>
        <VStack gap={4}>
          <input
            type="hidden"
            name="email"
            value={email}
          />
          <OtpField
            length={OTP_LENGTH}
            error={state.fieldErrors?.code}
            autoFocus
            {...bind("code")}
          />
          <Field
            label="Новый пароль"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            hint="Не короче 8 символов, не только цифры"
            error={state.fieldErrors?.newPassword}
            {...bind("newPassword")}
          />
          <Field
            label="Повторите пароль"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            error={state.fieldErrors?.passwordConfirm}
            {...bind("passwordConfirm")}
          />
          <FormAlert message={state.message} />
          <SubmitButton>Сменить пароль</SubmitButton>
        </VStack>
      </AuthForm>
    </AuthShell>
  );
}
