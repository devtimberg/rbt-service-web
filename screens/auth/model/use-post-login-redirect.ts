"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { AuthFormState } from "./form-state";

/** Переход после успешного входа.
 *
 * Server action ставит куку, но навигацию делаем здесь, а не через `redirect()`:
 * при редиректе из action слот параллельного роута `@sheet` откатывается на
 * `default.tsx` и лист остаётся пустым. Перед переходом перечитываем сессию —
 * SessionProvider смонтирован с прежним (пустым) значением и о новой куке
 * сам не узнает. */
export function usePostLoginRedirect(state: AuthFormState) {
  const router = useRouter();
  const { update } = useSession();

  useEffect(() => {
    if (state.status !== "success" || !state.redirectTo) return;

    let cancelled = false;
    void update().then(() => {
      if (cancelled) return;
      router.replace(state.redirectTo as string);
      router.refresh();
    });

    return () => {
      cancelled = true;
    };
    // `update` и `router` стабильны между рендерами, реагируем только на результат.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
}
