import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

type Side = 'top' | 'right' | 'bottom' | 'left'

type LayoutSheetProps = Omit<ComponentProps<'div'>, 'role'> & {
  /** Открыта ли панель; родитель сам управляет таймингом (анимация входа и выхода на CSS). */
  open: boolean
  side?: Side
  /** Отключает анимацию (первый рендер сразу открытым, переход между маршрутами шторки). */
  disableOpenAnimation?: boolean
  /** Подпись панели для скринридера. */
  label?: string
}

const SIDE_CLASS: Record<Side, string> = {
  right: 'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:translate-x-full sm:max-w-sm',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:-translate-x-full sm:max-w-sm',
  top: 'inset-x-0 top-0 h-auto border-b data-[state=closed]:-translate-y-full',
  bottom: 'inset-x-0 bottom-0 data-[state=closed]:translate-y-full lg:bottom-4 lg:mx-4',
}

/**
 * Страничная панель-шторка, закрепляемая поверх раскладки (замена Radix Dialog с modal=false и LayoutSheetContent).
 * Не модальна и не закрывается по Esc или клику снаружи: открытием управляет только родитель (по маршруту).
 * Состояние отдаётся атрибутом data-state="open|closed", анимация на CSS (shared/ui/overlay.css).
 */
export function LayoutSheet({
  open,
  side = 'bottom',
  disableOpenAnimation = false,
  label = 'Страница',
  className,
  children,
  ...props
}: LayoutSheetProps) {
  return (
    // Не модальная панель: нативный <dialog> с showModal здесь не подходит
    <div
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="dialog"
      aria-modal="false"
      aria-label={label}
      data-slot="layout-sheet-content"
      data-state={open ? 'open' : 'closed'}
      data-no-animation={disableOpenAnimation ? 'true' : undefined}
      className={cn(
        'ui-layout-sheet fixed z-50 flex flex-col gap-4 bg-[#F7FAFF] text-primary shadow-lg',
        SIDE_CLASS[side],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
