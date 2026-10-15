import { type ReactNode, useEffect, useState } from 'react'
import { cn } from '@/shared/lib/cn'

type TooltipProps = {
  /** Текст подсказки. */
  content: string
  /** С какой стороны от элемента показывать подсказку. */
  side?: 'top' | 'bottom'
  children: ReactNode
  className?: string
}

const SIDE = {
  top: 'bottom-full mb-1',
  bottom: 'top-full mt-0.5',
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
      className={cn('group/tooltip relative inline-flex', className)}
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
    >
      {children}
      <span
        role="tooltip"
        data-dismissed={dismissed ? 'true' : undefined}
        className={cn(
          'pointer-events-none invisible absolute left-1/2 z-50 -translate-x-1/2 rounded-md bg-primary px-3 py-1.5 text-xs text-balance whitespace-nowrap text-inverse opacity-0 transition-opacity',
          'group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100',
          'group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-hover/tooltip:delay-300',
          'data-[dismissed=true]:invisible! data-[dismissed=true]:opacity-0!',
          SIDE[side],
        )}
      >
        {content}
      </span>
    </span>
  )
}
