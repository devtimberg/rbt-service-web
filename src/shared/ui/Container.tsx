import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

/** Обёртка контента: на всю ширину, с md ограничена 90rem (1440px) и полями 40px, по центру. */
export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="container" className={cn('mx-auto w-full md:max-w-360 md:px-10', className)} {...props} />
}
