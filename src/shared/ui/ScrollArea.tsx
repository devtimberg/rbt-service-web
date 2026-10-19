import type { ComponentProps, Ref } from 'react'
import { cn } from '@/shared/lib/cn'

type ScrollAreaProps = ComponentProps<'div'> & {
  /** Классы прокручиваемой области (padding, overscroll и т.п.). */
  viewportClassName?: string
  viewportRef?: Ref<HTMLDivElement>
}

/**
 * Область с прокруткой на нативном overflow без Radix. Корень обрезает содержимое (relative overflow-hidden),
 * внутри вложенный блок-viewport прокручивается сам. Скроллбар тонкий, на мобильных скрыт.
 */
export function ScrollArea({ className, viewportClassName, viewportRef, children, ...props }: ScrollAreaProps) {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      <div
        ref={viewportRef}

        className={cn(
          'size-full overflow-auto rounded-[inherit] focus-visible:ring-[3px] focus-visible:ring-focus-ring/50 focus-visible:outline-1',
          'max-sm:scrollbar-none [scrollbar-color:oklch(0.7594_0.092_262.91/0.2)_transparent] [scrollbar-width:thin]',
          viewportClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
