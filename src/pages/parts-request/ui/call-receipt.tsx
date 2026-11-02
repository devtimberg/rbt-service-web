'use client'

import { type ComponentProps, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  COMPANY_ADDRESS,
  COMPANY_NAME,
  COMPANY_TAX_IDS,
  SERVICE_PHONE,
  SUPPORT_PHONE,
  WORK_HOURS,
} from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import { formatPhoneInput } from '@/shared/lib/phone-mask'
import { Box, Button, Receipt, ReceiptRow, ReceiptText, Text, Output } from '@/shared/ui'
import styles from './call-receipt.module.css'

type CallReceiptProps = {
  email?: string | undefined
  partNumber?: string | undefined
  phone?: string | undefined
  comment?: string | undefined
  number?: string | undefined
  date: string
  torn?: ComponentProps<typeof Receipt>['torn']
}

export function CallReceipt({ email, partNumber, phone, comment, number, date, torn = 'top' }: CallReceiptProps) {
  const [notice, setNotice] = useState(false)
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(false), 4000)
    return () => clearTimeout(timer)
  }, [notice])

  return (
    <>
      <Receipt torn={torn} aria-label="Чек заказа" className={styles.receipt}>
        <Box className={styles.head}>
          <ReceiptText size="title" className={styles.title}>
            {COMPANY_NAME}
          </ReceiptText>
          <Box className={styles.legal}>
            <ReceiptText size="legal">{COMPANY_ADDRESS}</ReceiptText>
            <ReceiptText size="legal">{COMPANY_TAX_IDS}</ReceiptText>
            <ReceiptText size="legal">
              {SERVICE_PHONE} · {SUPPORT_PHONE}
            </ReceiptText>
            <ReceiptText size="legal">{WORK_HOURS[0]?.replace('Сервис: ', '')}</ReceiptText>
          </Box>
        </Box>
        <Box className={styles.head}>
          <Box className={styles.number}>
            <ReceiptText size="title" className={styles.title}>
              ЗАКАЗ ЗАПЧАСТИ №
            </ReceiptText>
            {number ? (
              <ReceiptText size="title" className={styles.title}>
                {number}
              </ReceiptText>
            ) : (
              <Button
                variant="unstyled"
                className={styles.spoilerButton}
                aria-label="Номер ещё не присвоен. Показать пояснение"
                onClick={() => setNotice(true)}
              >
                <Text as="span" className={styles.spoiler} aria-hidden />
                <Text as="span" aria-hidden>
                  -
                </Text>
                <Text as="span" className={styles.spoiler} aria-hidden />
              </Button>
            )}
          </Box>
          <ReceiptText size="note" muted className={styles.date}>
            от {date}
          </ReceiptText>
        </Box>
        <Box className={styles.rows}>
          <ReceiptRow label="Заказ" value="Запчасть" className={styles.row} />
          <ReceiptRow
            label="Телефон"
            value={phone ? formatPhoneInput(phone) : undefined}
            placeholder="Не указан"
            className={styles.row}
          />
          <ReceiptRow label="Email" value={email} placeholder="Не указан" className={styles.row} />
          <ReceiptRow label="Партномер" value={partNumber} placeholder="Не указан" className={styles.row} />
          <ReceiptRow
            label="Комментарий к заказу"
            value={comment?.trim() ? comment : undefined}
            placeholder="Не добавлен"
            multiline
            className={cn(styles.row, styles.comment)}
          />
        </Box>
      </Receipt>
      {notice &&
        !number &&
        createPortal(
          <Output className={styles.notice}>Номер присвоится после создания документа</Output>,
          document.body,
        )}
    </>
  )
}
