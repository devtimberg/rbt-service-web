import { type ReactNode, useEffect, useState } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './Tooltip.module.css'

type TooltipProps = {
  /** Текст подсказки. */
  content: string
  /** С какой стороны от элемента показывать подсказку. */
  side?: 'top' | 'bottom'
  children: ReactNode
  className?: string
}

const SIDE = {
  top: styles.top,
  bottom: styles.bottom,
} as const

/**
 * Подсказка на чистом CSS: показывается по наведению (с задержкой 300 мс) и фокусу с клавиатуры внутри обёртки.
 * Заменяет Radix Tooltip: провайдер больше не нужен, подсказка не живёт в портале.
 * Смысл элемента должен быть понятен и без неё (aria-label у кнопки), подсказка только дублирует.
 */
export function Tooltip({ content, side = 'bottom', children, className }: TooltipProps) {
  const [active, setActive] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Esc скрывает подсказку, пока триггер в фокусе или под курсором (WCAG 1.4.13)
  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDismissed(true)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active])

  const activate = () => {
    setActive(true)
    setDismissed(false)
  }
  const deactivate = () => {
    setActive(false)
    setDismissed(false)
  }

  return (
    <span
      className={cn(styles.root, className)}
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
    >
      {children}
      <span role="tooltip" data-dismissed={dismissed ? 'true' : undefined} className={cn(styles.tip, SIDE[side])}>
        {content}
      </span>
    </span>
  )
}
