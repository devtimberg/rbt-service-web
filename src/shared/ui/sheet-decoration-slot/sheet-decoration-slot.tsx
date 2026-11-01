'use client'

import { type ReactNode, type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './sheet-decoration-slot.module.css'

const SHEET_DECORATION_SLOT_ID = 'sheet-decoration-slot'

/** Декорации обрезаются оверлеем и не участвуют в прокрутке его содержимого. */
export function SheetDecorationSlotTarget() {
  return <div id={SHEET_DECORATION_SLOT_ID} className={styles.target} aria-hidden />
}

/** Привязывает декоративный слой к точке в содержимом, сохраняя его вне scroll-viewport. */
export function SheetDecorationSlot({
  anchorRef,
  layoutRef,
  children,
}: {
  anchorRef: RefObject<HTMLElement | null>
  /** Размер этого элемента может менять положение точки без изменения размеров её родителей. */
  layoutRef?: RefObject<HTMLElement | null>
  children: ReactNode
}) {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const placement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setTarget(document.getElementById(SHEET_DECORATION_SLOT_ID)))
    return () => cancelAnimationFrame(frame)
  }, [])

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    const layer = placement.current
    if (!target || !anchor || !layer) return
    function place() {
      if (!target || !anchor || !layer) return
      const point = anchor.getBoundingClientRect()
      const bounds = target.getBoundingClientRect()
      layer.style.transform = `translate(${point.left - bounds.left}px, ${point.top - bounds.top}px)`
    }
    place()
    // Привязка готова до первого отображения: принтер не появляется в начале координат.
    layer.style.visibility = 'visible'
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place)
    observer?.observe(target)
    observer?.observe(anchor)
    if (layoutRef?.current) observer?.observe(layoutRef.current)
    // Высота соседнего блока может сдвинуть точку привязки без изменения её размера.
    if (anchor.parentElement) observer?.observe(anchor.parentElement)
    if (anchor.parentElement?.parentElement) observer?.observe(anchor.parentElement.parentElement)
    document.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      observer?.disconnect()
      document.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [target, anchorRef, layoutRef])

  if (!target) return null
  return createPortal(
    <div ref={placement} className={styles.anchor}>
      {children}
    </div>,
    target,
  )
}
