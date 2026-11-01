'use client'

import { type CSSProperties, useEffect, useRef, useState } from 'react'
import type { MasterCall } from '@/entities/master-call'
import { cn } from '@/shared/lib/cn'
import { Box, Image } from '@/shared/ui'
import type { MasterCallFormValues } from '../model/schema'
import { formatReceiptDate, useReceiptClock } from '../model/use-receipt-clock'
import { CallReceipt } from './call-receipt'
import styles from './receipt-printer.module.css'

type ReceiptPrinterProps = { values: Partial<MasterCallFormValues>; call?: MasterCall | undefined }

/** Принтер и бумага остаются одной сценой при переходе формы в результат. */
export function ReceiptPrinter({ values, call }: ReceiptPrinterProps) {
  const clock = useReceiptClock()
  const paper = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | null>(null)
  useEffect(() => {
    if (!paper.current || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setHeight(entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height)
    })
    observer.observe(paper.current)
    return () => observer.disconnect()
  }, [])
  const category = values.category === 'Другое' ? values.customCategory?.trim() || 'Другое' : values.category
  return (
    <Box
      className={cn(styles.scene, call && styles.created)}
      style={height === null ? undefined : ({ '--receipt-height': `${height}px` } as CSSProperties)}
    >
      <Box className={styles.glow} aria-hidden>
        <Image src="/master-call/glow.svg" width={742} height={935} alt="" />
      </Box>
      <Box className={styles.paper} ref={paper}>
        <CallReceipt
          category={category}
          phone={values.phone}
          comment={values.comment}
          number={call?.number}
          date={formatReceiptDate(call?.createdAt ?? clock)}
          torn={call ? 'both' : 'top'}
        />
        {!call && <Box className={styles.feedShadow} aria-hidden />}
      </Box>
      <Box className={styles.printer} aria-hidden>
        <Image src="/master-call/printer.png" width={1562} height={1007} alt="" className={styles.body} />
        <Image src="/master-call/sticker.png" width={1484} height={1060} alt="" className={styles.sticker} />
        <Box className={styles.indicator}>
          <Image src="/master-call/indicator.svg" width={99.3631} height={82.8026} alt="" />
        </Box>
      </Box>
    </Box>
  )
}
