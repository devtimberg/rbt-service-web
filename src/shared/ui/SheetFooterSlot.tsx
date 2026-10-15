import { type ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/lib/cn'
import { Box } from './Box'

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
    <Box
      className={cn(
        'flex items-center justify-center rounded-t-[24px] bg-[#F7FAFF] px-4 py-4 shadow-[0_-0px_60px_-0px] shadow-primary-900/15 sm:rounded-none sm:rounded-b-[40px] sm:bg-white sm:px-6 sm:py-8 sm:shadow-none',
        className,
      )}
    >
      <Box className={cn('flex w-full max-w-360 items-center', contentClassName)}>{children}</Box>
    </Box>,
    target,
  )
}
