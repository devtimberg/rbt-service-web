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
import styles from './Popover.module.css'

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
      <span ref={rootRef} className={cn(styles.root, className)}>
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
  bottom: styles.sideBottom,
  top: styles.sideTop,
  left: styles.sideLeft,
  right: styles.sideRight,
} as const

const ALIGN_CLASS = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
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

  const offsetStyle: CSSProperties = { ...style, [OFFSET_PROP[side]]: sideOffset }

  return (
    // Не модальное окно: нативный <dialog> с showModal здесь не подходит
    <div
      id={panelId}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="dialog"

      data-side={side}
      style={offsetStyle}
      className={cn(styles.panel, SIDE_CLASS[side], ALIGN_CLASS[align], className)}
      {...props}
    />
  )
}

export function PopoverHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn(styles.header, className)} {...props} />
}

export function PopoverTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn(styles.title, className)} {...props} />
}

export function PopoverDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn(styles.description, className)} {...props} />
}
