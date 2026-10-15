import {
  type CSSProperties,
  cloneElement,
  type ComponentProps,
  createContext,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  use,
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
} from 'react'
import { cn } from '@/shared/lib/cn'

type PopoverContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  panelId: string
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

function usePopover() {
  const ctx = use(PopoverContext)
  if (!ctx) throw new Error('PopoverTrigger и PopoverContent используются только внутри <Popover>')
  return ctx
}

type PopoverProps = {
  /** Контролируемое состояние. Без него поповер управляет собой сам. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
  className?: string
}

/**
 * Всплывающая панель без Radix: корень задаёт позиционирование (relative), PopoverTrigger переключает
 * состояние, PopoverContent рисует панель рядом с корнем. Закрывается тапом снаружи и Esc.
 * Панель не выносится в портал: она позиционируется абсолютно внутри корня и не обрезается,
 * пока у предков нет overflow: hidden.
 */
export function Popover({ open: openProp, defaultOpen = false, onOpenChange, children, className }: PopoverProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const open = openProp ?? innerOpen
  const rootRef = useRef<HTMLSpanElement>(null)
  const panelId = useId()

  function setOpen(next: boolean) {
    if (openProp === undefined) setInnerOpen(next)
    onOpenChange?.(next)
  }

  // Актуальный setOpen для слушателей на документе без переподписки на каждый рендер
  const close = useEffectEvent(() => setOpen(false))

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <PopoverContext value={{ open, setOpen, panelId }}>
      <span ref={rootRef} data-slot="popover" className={cn('relative inline-flex', className)}>
        {children}
      </span>
    </PopoverContext>
  )
}

/**
 * Триггер: единственный дочерний элемент (например, <Button>) получает onClick и aria-* поповера.
 * Работает так же, как раньше `<PopoverTrigger asChild>`, поэтому атрибут asChild больше не нужен.
 */
export function PopoverTrigger({ children }: { children: ReactElement<ComponentProps<'button'>> }) {
  const { open, setOpen, panelId } = usePopover()
  return cloneElement(children, {
    'aria-expanded': open,
    'aria-controls': panelId,
    'aria-haspopup': 'dialog',
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      children.props.onClick?.(event)
      if (!event.defaultPrevented) setOpen(!open)
    },
  })
}

type PopoverContentProps = ComponentProps<'div'> & {
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  /** Отступ панели от триггера в пикселях. */
  sideOffset?: number
}

const SIDE_CLASS = {
  bottom: 'top-full',
  top: 'bottom-full',
  left: 'right-full',
  right: 'left-full',
} as const

const ALIGN_CLASS = {
  vertical: { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' },
  horizontal: { start: 'top-0', center: 'top-1/2 -translate-y-1/2', end: 'bottom-0' },
} as const

const OFFSET_PROP = {
  bottom: 'marginTop',
  top: 'marginBottom',
  left: 'marginRight',
  right: 'marginLeft',
} as const

export function PopoverContent({
  side = 'bottom',
  align = 'center',
  sideOffset = 4,
  className,
  style,
  ...props
}: PopoverContentProps) {
  const { open, panelId } = usePopover()
  if (!open) return null

  const axis = side === 'top' || side === 'bottom' ? 'vertical' : 'horizontal'
  const offsetStyle: CSSProperties = { ...style, [OFFSET_PROP[side]]: sideOffset }

  return (
    // Не модальное окно: нативный <dialog> с showModal здесь не подходит
    <div
      id={panelId}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="dialog"
      data-slot="popover-content"
      data-side={side}
      style={offsetStyle}
      className={cn(
        'absolute z-50 w-72 rounded-md border border-border-default bg-white p-4 text-primary shadow-md',
        SIDE_CLASS[side],
        ALIGN_CLASS[axis][align],
        className,
      )}
      {...props}
    />
  )
}

export function PopoverHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="popover-header" className={cn('flex flex-col gap-1 text-sm', className)} {...props} />
}

export function PopoverTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="popover-title" className={cn('font-medium', className)} {...props} />
}

export function PopoverDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="popover-description" className={cn('text-tertiary', className)} {...props} />
}
