'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './tooltip.module.css'

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
  const [focusVisible, setFocusVisible] = useState(false)
  const suppressRestoredFocus = useRef(false)
  const suppressRestoredHover = useRef(false)

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
  }

  return (
    <span
      className={cn(styles.root, className)}
      data-focus-visible={focusVisible ? 'true' : undefined}
      onMouseEnter={() => {
        if (suppressRestoredHover.current) return
        suppressRestoredFocus.current = false
        activate()
      }}
      onMouseMove={() => {
        // После закрытия dialog браузер может восстановить :hover без движения мыши.
        if (!suppressRestoredHover.current) return
        suppressRestoredHover.current = false
        suppressRestoredFocus.current = false
        activate()
      }}
      onMouseLeave={deactivate}
      onClickCapture={() => {
        // Активация триггера закрывает подсказку, включая последующий возврат фокуса из dialog.
        suppressRestoredFocus.current = true
        suppressRestoredHover.current = true
        setDismissed(true)
      }}
      onFocus={(event) => {
        setFocusVisible(event.target.matches(':focus-visible'))
        if (suppressRestoredFocus.current) {
          suppressRestoredFocus.current = false
          setDismissed(true)
          return
        }
        activate()
      }}
      onBlur={() => {
        setFocusVisible(false)
        // Обычный уход с кнопки начинает новый цикл фокуса. При открытии dialog
        // сохраняем подавление до автоматического возврата на его триггер.
        if (!document.querySelector('dialog[open]')) suppressRestoredFocus.current = false
        deactivate()
      }}
    >
      {children}
      <span role="tooltip" data-dismissed={dismissed ? 'true' : undefined} className={cn(styles.tip, SIDE[side])}>
        {content}
      </span>
    </span>
  )
}
