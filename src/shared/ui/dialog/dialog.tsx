'use client'

import { type MouseEvent, type ReactNode, useEffect, useId, useRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { CloseIcon } from '../icons'
import styles from './dialog.module.css'

type Placement = 'center' | 'bottom' | 'responsive'

type DialogShellProps = {
  open: boolean
  onClose: () => void
  /** id заголовка внутри окна (aria-labelledby). */
  labelledBy?: string
  describedBy?: string
  /** center: окно по центру; bottom: шторка снизу; responsive: шторка ниже md, окно по центру от md. */
  placement?: Placement
  className?: string
  children: ReactNode
}

const PLACEMENT_CLASS: Record<Placement, string> = {
  center: styles.center,
  bottom: styles.bottom,
  responsive: styles.responsive,
}

/**
 * Основа модальных окон на нативном `<dialog>`: фокус-ловушку, Esc и затемнение даёт браузер.
 * Открытием управляет проп `open` (showModal/close), закрытие (Esc, клик по затемнению) сообщается в `onClose`.
 * Анимации входа и выхода на CSS (dialog.module.css). Страница под окном не прокручивается.
 */
export function DialogShell({
  open,
  onClose,
  labelledBy,
  describedBy,
  placement = 'center',
  className,
  children,
}: DialogShellProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    // Клик по ::backdrop приходит в сам элемент dialog, клик по содержимому нет
    if (event.target === event.currentTarget) onClose()
  }

  return (
    // Закрытие с клавиатуры даёт Esc у нативного dialog
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      data-placement={placement}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={cn(styles.root, PLACEMENT_CLASS[placement], className)}
    >
      {children}
    </dialog>
  )
}

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  /** Прибитый к низу блок действий. */
  footer?: ReactNode
  placement?: Placement
  /** md: 24rem (по умолчанию), lg: 32rem от md. */
  size?: 'md' | 'lg'
  className?: string
}

/** Модальное окно с заголовком, крестиком, описанием, содержимым и футером. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  placement = 'center',
  size = 'md',
  className,
}: DialogProps) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      {...(description ? { describedBy: descriptionId } : {})}
      placement={placement}
      className={cn(styles.padded, size === 'lg' && styles.sizeLg, className)}
    >
      <button type="button" aria-label="Закрыть" onClick={onClose} className={styles.close}>
        <CloseIcon className={styles.closeIcon} />
      </button>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {description ? (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      ) : null}
      {children ? <div className={styles.body}>{children}</div> : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </DialogShell>
  )
}
