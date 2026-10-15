"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { Button, Text, VStack } from "@/shared/ui/kit";
import { ROUTES } from "@/shared/lib/route-paths";
import {
  signupCompleteAction,
  signupResendAction,
  signupStartAction,
  signupVerifyAction,
} from "../model/actions";
import { IDLE_FORM_STATE } from "../model/form-state";
import { OTP_LENGTH } from "../model/schemas";
import { usePostLoginRedirect } from "../model/use-post-login-redirect";
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

type Step = "email" | "code" | "profile";

export function SignupPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [ticket, setTicket] = useState("");

  if (step === "code") {
    return (
      <SignupCodeStep
        email={email}
        initialResendIn={resendIn}
        backAction={() => setStep("email")}
        verifiedAction={(value) => {
          setTicket(value);
          setStep("profile");
        }}
      />
    );
  }

  if (step === "profile") {
    return <SignupProfileStep ticket={ticket} />;
  }

  return (
    <SignupEmailStep
      submittedAction={(value, nextResendIn) => {
        setEmail(value);
        setResendIn(nextResendIn);
        setStep("code");
      }}
    />
  );
}

function SignupEmailStep({
  submittedAction,
}: {
  submittedAction: (email: string, resendIn: number) => void;
}) {
  const [state, formAction] = useActionState(signupStartAction, IDLE_FORM_STATE);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (state.status === "success") {
      submittedAction(email, state.resendIn ?? 0);
    }
    // Переход выполняем только по смене результата действия, не по вводу.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <AuthShell
      title="Регистрация"
      description="Отправим код подтверждения на ваш email"
      footer={
        <Text
          variant="secondary"
          size="sm"
          className="text-center"
        >
          Уже есть аккаунт?{" "}
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

function SignupCodeStep({
  email,
  initialResendIn,
  backAction,
  verifiedAction,
}: {
  email: string;
  initialResendIn: number;
  backAction: () => void;
  verifiedAction: (ticket: string) => void;
}) {
  const [state, formAction] = useActionState(
    signupVerifyAction,
    IDLE_FORM_STATE,
  );
  const [resendState, resendAction] = useActionState(
    signupResendAction,
    IDLE_FORM_STATE,
  );
  const { canResend, label } = useResendCountdown(
    resendState.resendIn ?? initialResendIn,
  );
  const { bind } = useFormValues({ code: "" });

  useEffect(() => {
    if (state.status === "success" && state.ticket) {
      verifiedAction(state.ticket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <AuthShell
      title="Подтверждение почты"
      description={`Код из ${OTP_LENGTH} цифр отправлен на ${email}. Он действует 5 минут.`}
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
          <FormAlert message={state.message} />
          <SubmitButton>Подтвердить</SubmitButton>
        </VStack>
      </AuthForm>
    </AuthShell>
  );
}

function SignupProfileStep({ ticket }: { ticket: string }) {
  const [state, formAction] = useActionState(
    signupCompleteAction,
    IDLE_FORM_STATE,
  );
  const { bind } = useFormValues({
    firstName: "",
    lastName: "",
    password: "",
    passwordConfirm: "",
  });
  usePostLoginRedirect(state);

  return (
    <AuthShell
      title="Немного о вас"
      description="Осталось указать имя и придумать пароль"
    >
      <AuthForm action={formAction}>
        <VStack gap={4}>
          <input
            type="hidden"
            name="ticket"
            value={ticket}
          />
          <Field
            label="Имя"
            name="firstName"
            autoComplete="given-name"
            error={state.fieldErrors?.firstName}
            {...bind("firstName")}
          />
          <Field
            label="Фамилия"
            name="lastName"
            autoComplete="family-name"
            error={state.fieldErrors?.lastName}
            {...bind("lastName")}
          />
          <Field
            label="Пароль"
            name="password"
            type="password"
            autoComplete="new-password"
            hint="Не короче 8 символов, не только цифры"
            error={state.fieldErrors?.password}
            {...bind("password")}
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
          <SubmitButton>Создать аккаунт</SubmitButton>
        </VStack>
      </AuthForm>
    </AuthShell>
  );
}
