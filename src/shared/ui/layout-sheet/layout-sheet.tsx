import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './layout-sheet.module.css'

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
  right: styles.right,
  left: styles.left,
  top: styles.top,
  bottom: styles.bottom,
}

/**
 * Страничная панель-шторка, закрепляемая поверх раскладки (замена Radix Dialog с modal=false и LayoutSheetContent).
 * Не модальна и не закрывается по Esc или клику снаружи: открытием управляет только родитель (по маршруту).
 * Состояние отдаётся атрибутом data-state="open|closed", анимация на CSS (layout-sheet.module.css).
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

      data-state={open ? 'open' : 'closed'}
      data-no-animation={disableOpenAnimation ? 'true' : undefined}
      className={cn(styles.root, SIDE_CLASS[side], className)}
      {...props}
    >
      {children}
    </div>
  )
}
