'use client'

import { useRef } from 'react'
import type { PartsRequest } from '@/entities/parts-request'
import { cn } from '@/shared/lib/cn'
import { Box, Image, SheetDecorationSlot } from '@/shared/ui'
import type { PartsRequestFormValues } from '../model/schema'
import { formatReceiptDate, useReceiptClock } from '../model/use-receipt-clock'
import { CallReceipt } from './call-receipt'
import styles from './receipt-printer.module.css'

type ReceiptPrinterProps = {
  values: Partial<PartsRequestFormValues>
  call?: PartsRequest | undefined
  hasError?: boolean
  activity?: number
}

/** Принтер и бумага остаются одной сценой при переходе формы в результат. */
export function ReceiptPrinter({ values, call, hasError = false, activity = 0 }: ReceiptPrinterProps) {
  const clock = useReceiptClock()
  const anchor = useRef<HTMLDivElement>(null)
  const paper = useRef<HTMLDivElement>(null)
  const indicatorState = call ? 'success' : hasError ? 'error' : activity > 0 ? 'active' : 'idle'
  const printer = (
    <Box className={cn(styles.printer, call && styles.detached)} aria-hidden>
      <Image
        src="/images/receipt-printer/printer.webp"
        sources={[
          { media: '(width < 64rem)', srcSet: '/images/receipt-printer/printer-mobile.webp', width: 1150, height: 884 },
        ]}
        width={1562}
        height={1007}
        alt=""
        decoding="async"
        className={styles.body}
      />
      <Image
        src="/images/receipt-printer/sticker-parts-request.webp"
        width={572}
        height={440}
        alt=""
        decoding="async"
        className={styles.sticker}
      />
      <Box
        key={indicatorState === 'active' ? activity : indicatorState}
        className={styles.indicator}
        data-state={indicatorState}
      >
        <Image
          src="/images/receipt-printer/indicator.svg"
          width={99.3631}
          height={82.8026}
          alt=""
          className={styles.indicatorLens}
        />
      </Box>
    </Box>
  )
  return (
    <Box className={cn(styles.scene, call && styles.created)}>
      <Box className={styles.paper} ref={paper}>
        <CallReceipt
          email={values.email}
          partNumber={values.partNumber}
          phone={values.phone}
          comment={values.comment}
          number={call?.number}
          date={formatReceiptDate(call?.createdAt ?? clock)}
          torn={call ? 'both' : 'top'}
        />
        {!call && <Box className={styles.feedShadow} aria-hidden />}
      </Box>
      <Box className={styles.anchor} ref={anchor} aria-hidden>
        <Box className={styles.inlinePrinter}>{printer}</Box>
      </Box>
      <SheetDecorationSlot anchorRef={anchor} layoutRef={paper}>
        <Box className={styles.overlayPrinter}>{printer}</Box>
      </SheetDecorationSlot>
    </Box>
  )
}
