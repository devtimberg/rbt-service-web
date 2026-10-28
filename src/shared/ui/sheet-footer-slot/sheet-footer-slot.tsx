'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/lib/cn'
import { Box } from '../box'
import styles from './sheet-footer-slot.module.css'

const SHEET_FOOTER_SLOT_ID = 'sheet-footer-slot'

/** Место в раскладке шторки, куда экраны через SheetFooterSlot выносят свой нижний блок действий. */
export function SheetFooterSlotTarget() {
  return <div id={SHEET_FOOTER_SLOT_ID} />
}

type SheetFooterSlotProps = {
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function SheetFooterSlot({ children, className, contentClassName }: SheetFooterSlotProps) {
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Цель рисуется шторкой-родителем, поэтому ищем её после монтирования, в следующем кадре
    const frame = requestAnimationFrame(() => setTarget(document.getElementById(SHEET_FOOTER_SLOT_ID)))
    return () => cancelAnimationFrame(frame)
  }, [])

  if (!target) return null
  return createPortal(
    <Box className={cn(styles.root, className)}>
      <Box className={cn(styles.content, contentClassName)}>{children}</Box>
    </Box>,
    target,
  )
}
