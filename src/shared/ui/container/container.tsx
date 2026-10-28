import { cn } from '@/shared/lib/cn'
import { Box, type BoxProps } from '../box'
import styles from './container.module.css'

/** Обёртка контента: на всю ширину, с md ограничена 90rem (1440px) и полями 40px, по центру. */
export function Container({ className, ...props }: BoxProps) {
  return <Box className={cn(styles.root, className)} {...props} />
}
