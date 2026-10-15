"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { Button, Text, VStack } from "@/shared/ui/kit";
import { CALLBACK_URL_PARAM, ROUTES } from "@/shared/lib/route-paths";
import { loginAction } from "../model/actions";
import { IDLE_FORM_STATE } from "../model/form-state";
import { usePostLoginRedirect } from "../model/use-post-login-redirect";
import {
  AuthForm,
  AuthShell,
  Field,
  FormAlert,
  SubmitButton,
  useFormValues,
} from "./auth-form-parts";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get(CALLBACK_URL_PARAM) ?? ROUTES.PROFILE;
  const [state, formAction] = useActionState(loginAction, IDLE_FORM_STATE);
  const { bind } = useFormValues({ email: "", password: "" });
  usePostLoginRedirect(state);

  return (
    <AuthShell
      title="Вход"
      description="Войдите, чтобы видеть свои заказы, избранное и корзину"
      footer={
        <>
          <Text
            variant="secondary"
            size="sm"
            className="text-center"
          >
            Нет аккаунта?{" "}
            <Link
              href={ROUTES.SIGNUP}
              className="text-link font-medium"
            >
              Зарегистрироваться
            </Link>
          </Text>
          <Button
            asChild
            variant="link"
            className="mx-auto"
          >
            <Link href={ROUTES.PASSWORD_RESET}>Забыли пароль?</Link>
          </Button>
        </>
      }
    >
      <AuthForm action={formAction}>
        <VStack gap={4}>
          <input
            type="hidden"
            name="callbackUrl"
            value={callbackUrl}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={state.fieldErrors?.email}
            {...bind("email")}
          />
          <Field
            label="Пароль"
            name="password"
            type="password"
            autoComplete="current-password"
            error={state.fieldErrors?.password}
            {...bind("password")}
          />
          <FormAlert message={state.message} />
          <SubmitButton>Войти</SubmitButton>
        </VStack>
      </AuthForm>
    </AuthShell>
  );
}

export function LoginPage() {
  // useSearchParams требует Suspense-границы при статическом рендере.
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
