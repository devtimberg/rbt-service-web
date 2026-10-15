import { type ComponentProps, createContext, type ReactNode, use, useId } from 'react'
import { cn } from '@/shared/lib/cn'
import { DialogShell } from './Dialog'
import { CloseIcon } from './icons'

type SheetContextValue = {
  onOpenChange: (open: boolean) => void
  open: boolean
  titleId: string
  descriptionId: string
}

const SheetContext = createContext<SheetContextValue | null>(null)

function useSheet() {
  const ctx = use(SheetContext)
  if (!ctx) throw new Error('Компоненты Sheet используются только внутри <Sheet>')
  return ctx
}

type SheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

/** Нижняя шторка на нативном `<dialog>`. Контекст открытия и id для aria; сам DOM рисует SheetContent. */
export function Sheet({ open, onOpenChange, children }: SheetProps) {
  const titleId = useId()
  const descriptionId = useId()
  return <SheetContext value={{ open, onOpenChange, titleId, descriptionId }}>{children}</SheetContext>
}

type SheetContentProps = ComponentProps<'div'> & { showCloseButton?: boolean }

export function SheetContent({ className, children, showCloseButton = true }: SheetContentProps) {
  const { open, onOpenChange, titleId, descriptionId } = useSheet()
  return (
    <DialogShell
      open={open}
      onClose={() => onOpenChange(false)}
      labelledBy={titleId}
      describedBy={descriptionId}
      placement="bottom"
      className={cn('flex flex-col gap-4 p-0', className)}
    >
      {children}
      {showCloseButton ? (
        <SheetClose className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100">
          <CloseIcon className="size-6" />
          <span className="sr-only">Закрыть</span>
        </SheetClose>
      ) : null}
    </DialogShell>
  )
}

/** Кнопка, закрывающая шторку. */
export function SheetClose({ onClick, ...props }: ComponentProps<'button'>) {
  const { onOpenChange } = useSheet()
  return (
    <button
      type="button"

      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) onOpenChange(false)
      }}
      {...props}
    />
  )
}

export function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />
}

export function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
}

export function SheetTitle({ className, ...props }: ComponentProps<'h2'>) {
  const { titleId } = useSheet()
  return (
    // Содержимое приходит через props.children
    // oxlint-disable-next-line jsx-a11y/heading-has-content
    <h2
      id={titleId}

      className={cn('text-xl font-semibold text-primary', className)}
      {...props}
    />
  )
}

export function SheetDescription({ className, ...props }: ComponentProps<'p'>) {
  const { descriptionId } = useSheet()
  return <p id={descriptionId} className={cn('text-sm text-tertiary', className)} {...props} />
}
