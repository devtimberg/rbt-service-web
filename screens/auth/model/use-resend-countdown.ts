"use client";

import { useEffect, useState } from "react";

/** Обратный отсчёт до следующей разрешённой отправки OTP.
 * Значение приходит от бэкенда (`nextResendIn`) и обновляется при каждой
 * успешной отправке или при 429. */
export function useResendCountdown(resendIn: number | undefined) {
  const [seconds, setSeconds] = useState(resendIn ?? 0);
  const [appliedResendIn, setAppliedResendIn] = useState(resendIn);

  // Сброс отсчёта при новом значении от бэкенда — корректировка состояния
  // во время рендера, а не в эффекте (иначе лишний каскадный рендер).
  if (resendIn !== appliedResendIn) {
    setAppliedResendIn(resendIn);
    setSeconds(resendIn ?? 0);
  }

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(seconds, 0);
  return {
    seconds: remaining,
    canResend: remaining <= 0,
    label: formatCountdown(remaining),
  };
}

function formatCountdown(total: number): string {
  const minutes = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const secs = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}
