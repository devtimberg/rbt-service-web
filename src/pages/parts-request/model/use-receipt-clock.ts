import { useSyncExternalStore } from 'react'

const MINUTE = 60_000

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, MINUTE)
  return () => clearInterval(id)
}

// Округляем до минуты: снимок стабилен между тиками, useSyncExternalStore не зацикливается
const getSnapshot = () => Math.floor(Date.now() / MINUTE) * MINUTE

/** Текущая минута (мс) на клиенте, раз в минуту обновляется. На сервере и до гидратации `null`: часовой пояс сервера другой. */
export function useReceiptClock(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}

export const EMPTY_RECEIPT_DATE = '__.__.____ __:__'

/** `ДД.ММ.ГГГГ ЧЧ:ММ` в часовом поясе клиента. */
export function formatReceiptDate(time: number | string | null): string {
  if (time === null) return EMPTY_RECEIPT_DATE
  const d = new Date(time)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}
