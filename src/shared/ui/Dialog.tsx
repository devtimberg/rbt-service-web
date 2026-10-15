import { type MouseEvent, type ReactNode, useEffect, useId, useRef } from 'react'
import { cn } from '@/shared/lib/cn'
import { CloseIcon } from './icons'

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
  center: 'm-auto max-w-sm rounded-2xl',
  bottom: 'm-0 mt-auto max-w-none rounded-t-3xl',
  responsive: 'm-0 mt-auto max-w-none rounded-t-3xl md:m-auto md:max-w-sm md:rounded-2xl',
}

/**
 * Основа модальных окон на нативном `<dialog>`: фокус-ловушку, Esc и затемнение даёт браузер.
 * Открытием управляет проп `open` (showModal/close), закрытие (Esc, клик по затемнению) сообщается в `onClose`.
 * Анимации входа и выхода на CSS (shared/ui/overlay.css). Страница под окном не прокручивается.
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
      className={cn(
        'ui-dialog max-h-[90vh] w-full overflow-y-auto bg-white p-6 text-primary shadow-xl',
        PLACEMENT_CLASS[placement],
        className,
      )}
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
  /** md: max-w-sm (по умолчанию), lg: max-w-lg. */
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
      className={cn(size === 'lg' && 'md:max-w-lg', className)}
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-lg text-tertiary hover:text-primary"
      >
        <CloseIcon className="size-6" />
      </button>
      <h2 id={titleId} className="pr-8 text-lg font-semibold">
        {title}
      </h2>
      {description ? (
        <p id={descriptionId} className="mt-2 text-sm text-tertiary">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
      {footer ? <div className="mt-6">{footer}</div> : null}
    </DialogShell>
  )
}
