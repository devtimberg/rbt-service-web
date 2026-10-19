import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

/** Заглушка на время загрузки. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden className={cn('animate-pulse rounded-lg bg-gray-100', className)} {...props} />
}
