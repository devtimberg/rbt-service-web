import type { ComponentProps } from 'react'
import {
  COMPANY_ADDRESS,
  COMPANY_NAME,
  COMPANY_TAX_IDS,
  SERVICE_EMAIL,
  SERVICE_PHONE,
  SUPPORT_PHONE,
  WORK_HOURS,
} from '@/shared/config'
import { formatPhoneDisplay } from '@/shared/lib/phone-mask'
import { Box, Receipt, ReceiptRow, ReceiptRule, ReceiptText } from '@/shared/ui'
import styles from './call-receipt.module.css'

type CallReceiptProps = {
  category?: string | undefined
  /** Национальные цифры без `+7`. */
  phone?: string | undefined
  comment?: string | undefined
  number?: string | undefined
  /** Уже отформатированная дата `ДД.ММ.ГГГГ ЧЧ:ММ`. */
  date: string
  torn?: ComponentProps<typeof Receipt>['torn']
  /** Блок согласия на обработку данных (только на экране формы). */
  consent?: boolean
  /** Сноска про стоимость приглушённым цветом (на экране «Заявка создана»). */
  mutedNote?: boolean
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
  consent,
  mutedNote,
  className,
}: CallReceiptProps) {
  return (
    <Receipt {...(torn && { torn })} className={className} aria-label="Чек заявки">
      <Box className={styles.head}>
        <ReceiptText size="title">{COMPANY_NAME}</ReceiptText>
        <ReceiptText size="legal" muted>
          {COMPANY_ADDRESS}
        </ReceiptText>
        <ReceiptText size="legal" muted>
          {COMPANY_TAX_IDS}
        </ReceiptText>
        <ReceiptText size="legal" muted>
          {SERVICE_PHONE} · {SUPPORT_PHONE}
        </ReceiptText>
        <ReceiptText size="legal" muted>
          {SERVICE_EMAIL}
        </ReceiptText>
        {WORK_HOURS.map((line) => (
          <ReceiptText key={line} size="legal" muted>
            {line}
          </ReceiptText>
        ))}
      </Box>
      <Box className={styles.head}>
        <ReceiptRule />
        <ReceiptText size="title">ЗАЯВКА № {number}</ReceiptText>
        <ReceiptText size="note" muted>
          от {date}
        </ReceiptText>
      </Box>
      <Box className={styles.rows}>
        <ReceiptRow label="Услуга" value="Ремонт" />
        <ReceiptRow label="Техника" value={category} placeholder="______________" />
        <ReceiptRow
          label="Телефон"
          value={phone ? formatPhoneDisplay(phone) : undefined}
          placeholder="______________"
        />
        <ReceiptRow
          label="Комментарий от заказчика"
          value={comment}
          placeholder="______________________________"
          multiline
        />
      </Box>
      <ReceiptText size="note" muted={mutedNote}>
        Стоимость работ определяется мастером после диагностики на месте
      </ReceiptText>
      {consent && (
        <ReceiptText size="consent" muted>
          Нажимая кнопку «Создать заявку», я даю согласие на обработку моих персональных данных, в соответствии с
          Федеральным законом от 27.07.2006 года №152-ФЗ «О персональных данных» для целей и на условиях, представленных
          в политике конфиденциальности
        </ReceiptText>
      )}
    </Receipt>
  )
}
