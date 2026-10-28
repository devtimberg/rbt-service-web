import type { ComponentProps, Ref } from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './ScrollArea.module.css'

type ScrollAreaProps = ComponentProps<'div'> & {
  /** Классы прокручиваемой области (padding, overscroll и т.п.). */
  viewportClassName?: string
  viewportRef?: Ref<HTMLDivElement>
}

/**
 * Область с прокруткой на нативном overflow без Radix. Корень обрезает содержимое (relative, overflow hidden),
 * внутри вложенный блок-viewport прокручивается сам. Скроллбар тонкий, на мобильных скрыт.
 */
export function ScrollArea({ className, viewportClassName, viewportRef, children, ...props }: ScrollAreaProps) {
  return (
    <div className={cn(styles.root, className)} {...props}>
      <div ref={viewportRef} className={cn(styles.viewport, viewportClassName)}>
        {children}
      </div>
    </div>
  )
}
