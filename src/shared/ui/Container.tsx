import { cn } from '@/shared/lib/cn'
import { Box, type BoxProps } from './Box'

/** Обёртка контента: на всю ширину, с md ограничена 90rem (1440px) и полями 40px, по центру. */
export function Container({ className, ...props }: BoxProps) {
  return <Box className={cn('mx-auto w-full md:max-w-360 md:px-10', className)} {...props} />
}
