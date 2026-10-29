import type { ComponentProps } from 'react'
import { formatPhoneDisplay } from '@/shared/lib/phone-mask'
import { Receipt, ReceiptRow, ReceiptRule, ReceiptText } from '@/shared/ui'

type CallReceiptProps = {
  category?: string | undefined
  /** Национальные цифры без `+7`. */
  phone?: string | undefined
  comment?: string | undefined
  number?: string | undefined
  /** Уже отформатированная дата `ДД.ММ.ГГГГ ЧЧ:ММ`. */
  date: string
  torn?: ComponentProps<typeof Receipt>['torn']
  className?: string
}

/** Чек заявки: на экране формы заполняется по мере ввода, на «Заявка создана» показывает итог. */
export function CallReceipt({
  category,
  phone,
  comment,
  number = '____-____',
  date,
  torn,
  className,
}: CallReceiptProps) {
  return (
    <Receipt {...(torn && { torn })} className={className} aria-label="Чек заявки">
      <ReceiptText size="title">ТТЦ «Рембыттехника»</ReceiptText>
      <ReceiptText size="note">пн–пт 9:00–18:00</ReceiptText>
      <ReceiptRule />
      <ReceiptText size="title">Заявка № {number}</ReceiptText>
      <ReceiptText size="note">от {date}</ReceiptText>
      <ReceiptRow label="Техника" value={category} />
      <ReceiptRow label="Телефон" value={phone ? formatPhoneDisplay(phone) : undefined} />
      <ReceiptRow label="Комментарий от заказчика" value={comment} multiline />
      <ReceiptRule />
      <ReceiptText size="consent">Создавая заявку, вы даёте согласие на обработку персональных данных</ReceiptText>
    </Receipt>
  )
}
